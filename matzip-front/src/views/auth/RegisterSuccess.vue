<script setup>
import Logo from '@/components/common/Logo.vue';
import Button from '@/components/auth/Button.vue';
import {useRouter} from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="complete-page">
    <Logo size="150px" />

    <h1>환영합니다!</h1>
    <p>다양한 맛집 소식을 만들어주세요.</p>

    <Button label="로그인" width="150px" height="45px" @click="goToLogin"/>
  </div>
</template>

<style scoped>
.complete-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f9f9f9;
  text-align: center;
}

h1 {
  font-size: 2rem;
  margin-top: 20px;
  margin-bottom: 10px;
}

p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 30px;
}
</style>
