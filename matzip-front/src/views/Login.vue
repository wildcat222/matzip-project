
<script setup>
import axios from 'axios';
import {useAuthStore} from "@/store/auth.js";
import { ref } from 'vue';
import {useRouter} from "vue-router";


const authStore = useAuthStore();
const userId = ref('');
const pwd = ref('');
const router = useRouter();
const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:8000/user/api/v1/auth/login', {
      userEmail: userId.value,
      userPassword: pwd.value,
    });



    if(response.status === 200) {
      authStore.login(response.headers.token);
      console.log(response);
      console.log(localStorage.getItem('accessToken'));
      await router.push('/admin');

    }

    const userSeqRes = await axios.get(`http://localhost:8000/user/api/v1/useremail?userEmail=${userId.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (userSeqRes.status === 200) {
      localStorage.setItem('userSeq', userSeqRes.data.data2);
      console.log(userSeqRes.data.data2);
      console.log(localStorage.getItem('userSeq'));
    }

  } catch (error) {
    console.error('로그인 실패', error);
  }
};
</script>

<template>
  <div class="login-container">
    <h1>로그인</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="userId">사용자 ID</label>
        <input v-model="userId" id="userId" required />
      </div>
      <div>
        <label for="pwd">비밀번호</label>
        <input type="password" v-model="pwd" id="pwd" required />
      </div>
      <button type="submit">로그인</button>
    </form>
  </div>
</template>


<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
