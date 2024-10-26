<template>
  <div class="hot-list">
    <h2>실시간 인기 태그</h2>
    <ul>
      <li v-for="(tag, index) in tags" :key="index">
        {{ index + 1 }}.&nbsp;&nbsp; {{ tag }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.hot-list {
  background-color: #f0f0f0; /* 회색 배경 */
  padding: 10px; /* 패딩 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  min-width: 250px;
  padding-top: 30px;
  padding-left: 30px;
}

h2 {
  margin-bottom: 30px; /* 제목과 리스트 사이의 간격 */
  display: flex;
  font-size: 20px;
  font-weight: bold;
  justify-content: center;
}

ul {
  list-style-type: none; /* 기본 리스트 스타일 제거 */
  padding: 0; /* 기본 패딩 제거 */
}

li {
  margin-bottom: 15px; /* 각 태그 사이의 간격 */
}
</style>
