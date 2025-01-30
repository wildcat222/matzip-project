import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref(null);
    const userRole = ref(null);
    const userSeq  = ref(null);
    const isTermsAccepted = ref(false); // 약관 동의 여부

    // 페이지가 로드될 때 localStorage에서 토큰을 읽어와 상태를 초기화
    onMounted(() => {
        const token = localStorage.getItem('accessToken');
        const termsAccepted = localStorage.getItem('isTermsAccepted');
        if (token) {
            accessToken.value = token;
            const payload = JSON.parse(atob(token.split('.')[1])); // JWT 토큰의 페이로드 추출
            userRole.value = payload.auth;
            userSeq.value = payload.sub;
        }
        if (termsAccepted === 'true') {
            isTermsAccepted.value = true;

        }
    });

    function login(token) {
        accessToken.value = token;
        localStorage.setItem('accessToken', token); // 토큰을 localStorage에 저장
        const payload = JSON.parse(atob(token.split('.')[1])); // JWT 토큰의 페이로드 추출
        userRole.value = payload.auth;
        userSeq.value = payload.sub;
    }

    function logout() {
        accessToken.value = null;
        userRole.value = null;
        userSeq.value = null;
        localStorage.removeItem('accessToken'); // localStorage에서 토큰 제거
    }

    function isAuthorized(requiredRole) {
        if (!userRole.value) return false;
        return userRole.value.includes(requiredRole);   // 배열로 반환 되었으므로 includes로 확인
    }

    function acceptTerms() {
        isTermsAccepted.value = true;
        localStorage.setItem('isTermsAccepted', 'true'); // 약관 동의 상태를 `localStorage`에 저장
    }

    function refuseTerms() {
        isTermsAccepted.value = false;
        localStorage.removeItem('isTermsAccepted'); // 약관 동의 상태 삭제
    }

    return { accessToken, userRole, userSeq, isTermsAccepted, acceptTerms, refuseTerms, login, logout, isAuthorized };
});
