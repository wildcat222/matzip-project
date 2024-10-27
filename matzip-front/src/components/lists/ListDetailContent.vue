<script setup>
import { defineProps } from 'vue';

// props 정의
const props = defineProps({
  nickname: {
    type: String,
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
</script>

<template>
  <div class="list-detail-content">
    <div class="header">
      <img src="../../assets/ListMark.png" alt="List Mark" />
      <h3>{{ nickname }}</h3>
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
  margin-bottom: 10px;
  font-size: 24px; /* 제목 크기 조정 */
  word-wrap: break-word; /* 단어가 박스를 넘어가지 않도록 설정 */
  overflow-wrap: break-word; /* 글자 사이의 줄 바꿈을 허용 */
}

h3 {
  color: #555;
  margin: 0; /* 기본 여백 제거 */
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
