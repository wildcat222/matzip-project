<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'; // Vue Router import

// props 정의
const props = defineProps({
  nickname: {
    type: String,
    required: true,
  },
  userSeq: { // userSeq prop 추가
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
});

const router = useRouter(); // Router 인스턴스 가져오기

// 닉네임 클릭 시 이동하는 함수
const navigateToUserList = () => {
  router.push(`/user/listbox/${props.userSeq}`); // userSeq에 따라 URL로 이동
};
</script>

<template>
  <div class="list-detail-content">
    <div class="header">
      <img src="../../assets/ListMark.png" alt="List Mark" />
      <h3 @click="navigateToUserList" class="nickname">{{ nickname }}</h3> <!-- 닉네임 클릭 시 이동 -->
    </div>
    <h2>{{ title }}</h2>
    <p class="content">{{ content }}</p>
  </div>
</template>

<style scoped>
.list-detail-content {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 20px 0;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px; /* 제목 크기 조정 */
  font-weight: bold;
  word-wrap: break-word; /* 단어가 박스를 넘어가지 않도록 설정 */
  overflow-wrap: break-word; /* 글자 사이의 줄 바꿈을 허용 */
}

h3 {
  color: #555;
  margin: 0; /* 기본 여백 제거 */
  cursor: pointer; /* 커서 포인터로 변경 */
}

img {
  width: 35px;
  height: 32px;
  margin-right: 10px;
}

.header {
  display: flex;
  align-items: center; /* 이미지와 텍스트를 수평 중앙에 정렬 */
  margin: 20px 0;
}

/* p 요소에 강제 줄 바꿈 설정 및 내용 박스 내 고정 */
.content {
  margin-top: 5px;
  word-wrap: break-word; /* 단어가 박스를 넘어가지 않도록 설정 */
  overflow-wrap: break-word; /* 글자 사이의 줄 바꿈을 허용 */
  white-space: normal; /* 줄 바꿈을 허용 */
  max-width: 100%; /* 박스 크기 내에 고정 */
}
</style>
