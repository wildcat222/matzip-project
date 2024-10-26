<template class="container">
  <div class="list-detail-matzip">
    <h4 class="nickname">
      <div class="nickname-text">
        {{ lists.length > 0 ? lists[0]?.userNickname : '등록된 리스트가 없습니다.' }}님의 리스트
      </div>
      <div class="back-button-container">
        <button class="back-button" @click="goBack"><</button>
      </div>
    </h4>

    <ul v-if="lists && lists.length > 0">
      <li v-for="(list, index) in lists" :key="index" class="list-item">
        <router-link :to="`/user/list/detail/${list.listSeq}`" class="list-title-link">
          <div class="list-title">{{ list.listTitle || '제목 없음' }}</div>
        </router-link>
        <p class="list-content">{{ list.listContent || '내용 없음' }}</p>
      </li>
    </ul>
    <p v-else></p>
  </div>
</template>

<script setup>
import {defineProps, watch} from "vue";
import {useRouter} from 'vue-router'; // useRouter 임포트

const props = defineProps({
  lists: {
    type: Array,
    default: () => []
  },
});

// 뒤로가기 함수
const router = useRouter();
const goBack = () => {
  router.go(-1); // 이전 페이지로 이동
};

// props.lists의 변화를 감지하여 콘솔에 출력
watch(() => props.lists, (newLists) => {
  console.log('Updated lists:', newLists);
}, {immediate: true}); // immediate: true로 초기값도 로그에 출력

</script>

<style scoped>
.container {
  display: flex;
  justify-content: flex-start; /* 요소를 왼쪽에 정렬 */
  align-items: flex-start; /* 요소를 세로 방향으로 상단에 정렬 */
}

.list-detail-matzip {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin: 16px;
  max-width: 600px; /* 최대 가로폭 설정 */
  /* 좌우 마진 제거하여 왼쪽 정렬 유지 */
  margin-left: 0; /* 왼쪽 정렬을 위해 수정 */
  margin-right: auto; /* 오른쪽 자동 마진 설정 */
}

.nickname {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.nickname-text {
  padding: 25px 0 0 0;
  font-size: 32px;
  font-weight: bold;
}

.list-item {
  border: 1px solid transparent; /* 선 색은 없어도 되므로 투명 설정 */
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
  background-color: #f9f9f9; /* 박스 배경 색상 */
}

.list-title {
  font-weight: bold;
  font-size: 1.2rem;
}

/* 링크 스타일 */
.list-title-link {
  text-decoration: none; /* 밑줄 없애기 */
  color: inherit; /* 부모 요소의 색상 그대로 사용 */
}

.list-content {
  font-size: 1rem;
  color: #555;
}

.back-button-container {
  margin: 20px; /* 버튼 주위 여백 설정 */
}

.back-button {
  background-color: #FF7315; /* 배경 색상 */
  color: white; /* 글씨 색상 */
  font-weight: bold; /* 글씨 볼드 */
  border: none; /* 기본 테두리 제거 */
  padding: 10px 15px; /* 버튼 내부 여백 설정 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 마우스 커서 포인터로 변경 */
  transition: all 0.3s ease; /* 부드러운 전환 효과 */
}

.back-button:hover {
  background-color: #e65c13; /* 호버 시 색상 변화 */
}

.back-button:active {
  border: 2px solid #FF7315; /* 눌렀을 때 테두리 색상 */
  color: black; /* 눌렀을 때 글씨 색상 */
  background-color: white; /* 눌렀을 때 배경 색상 */
}
</style>
