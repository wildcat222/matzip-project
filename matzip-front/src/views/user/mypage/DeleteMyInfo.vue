<script setup>
import {computed, ref} from 'vue';
import InputField from '@/components/auth/InputField.vue';
import Button from '@/components/auth/Button.vue';
import NavBar from "@/components/user/mypage/NavBar.vue";
import {useAuthStore} from "@/components/stores/auth.js";
import axios from "axios";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const userSeq = computed(() => authStore.userSeq);
const router = useRouter();

const formData = ref({
  userSeq: userSeq.value,
  userPassword: '',
});

// 탈퇴 요청
const submitWithdrawal = async () => {
  try {
    const response = await axios.delete(`https://matzipapi.huichan.kr/user/api/v1/user/${userSeq.value}`, {
      data: {
        userSeq: formData.value.userSeq,
        userPassword: formData.value.userPassword,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }
    });
      alert('회원 탈퇴가 완료되었습니다.');
    authStore.logout();
      await router.push(`/user/${userSeq.value}/withdrawSuccess`);
  } catch (error) {
    // console.error('회원 탈퇴 실패:', error);
    alert('회원 탈퇴에 실패했습니다. 다시 시도해 주세요.');
    // console.error(formData.value.userPassword)
  }
};
</script>

<template>
  <div class="withdraw-page-wrapper">
    <NavBar/>
    <div class="withdraw-page">
      <h2>회원탈퇴</h2>
      <form @submit.prevent="submitWithdrawal">
        <InputField v-model="formData.email" label="이메일" placeholder="이메일을 입력하세요." />
        <InputField v-model="formData.userPassword" type="password" label="비밀번호" placeholder="비밀번호를 입력하세요." />
        <Button label="탈퇴하기" type="submit" />
      </form>
    </div>
  </div>
</template>


<style scoped>
.withdraw-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 상단에 배치 */
  padding-top: 30px;
}

.withdraw-page {
  max-width: 500px;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 0;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
