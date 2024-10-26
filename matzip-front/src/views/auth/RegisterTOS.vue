<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from "@/components/auth/Button.vue";
import {useAuthStore} from "@/components/stores/auth.js";

export default {
  components: {Button},
  setup() {
    const isAgreed = ref(false);
    const router = useRouter();
    const authStore = useAuthStore();

    const agreeTerms = () => {
      if (isAgreed.value) {
        router.push('/user/auth/register'); // 회원가입 페이지로 이동
        authStore.acceptTerms();
      } else {
        alert('약관에 동의해야 회원가입을 진행할 수 있습니다.');
      }
    };

    return {
      isAgreed,
      agreeTerms,
    };
  },
};
</script>

<template>
  <div class="terms-container">
    <h1>약관 동의</h1>
    <div class="terms-content">
      <h2>서비스 이용 약관</h2>
      <p>본 서비스는 다양한 맛집 정보를 제공하고, 사용자가 맛집을 검색하고 리뷰를 작성할 수 있는 플랫폼입니다. 사용자는 자신이 방문한 맛집을 리스트로 정리하여 저장하거나, 다른 사용자의 리스트를 내 리스트에 추가할 수 있습니다. 사용자 간의 팔로우 및 메시지 전송 기능이 제공되며, 특정 사용자는 인기 회원으로 지정될 수 있습니다.</p>
      <h3>주요 기능</h3>
      <ul>
        <li>맛집 검색 및 리뷰 작성</li>
        <li>리스트 공유 및 저장</li>
        <li>게시판에 게시글 작성 및 공유</li>
        <li>팔로우 및 팔로워 관리</li>
        <li>신고 및 제재 기능</li>
        <li>메시지 전송 기능</li>
      </ul>
      <h2>개인정보 처리 방침</h2>
      <p>사용자의 개인정보는 안전하게 관리되며, 사용자의 동의 없이 제3자에게 제공되지 않습니다. 사용자의 휴대폰 번호 및 이메일 주소는 본인 인증 및 서비스 제공 목적으로만 사용됩니다.</p>
    </div>
    <div class="terms-agree">
      <label>
        <input type="checkbox" v-model="isAgreed" />
        약관에 동의합니다.
      </label>
    </div>
    <Button @click="agreeTerms" :disabled="!isAgreed" label="다음" class="agree-btn"/>
  </div>
</template>

<style scoped>
.terms-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.terms-content {
  margin-bottom: 20px;
  line-height: 1.6;
}

.terms-content h2, .terms-content h3 {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 5px;
  color: #333;
}

.terms-content p {
  margin-bottom: 10px;
  color: #666;
}

.terms-content ul {
  list-style: disc;
  padding-left: 20px;
}

.terms-agree {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.terms-agree label {
  font-size: 16px;
  color: #333;
}

.agree-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #ff7f50;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.agree-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
