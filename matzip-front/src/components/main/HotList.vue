<template>
  <div class="hot-list-container">
    <h2 class="hot-list-title">인기 리스트</h2>
    <div class="hot-list-items">
      <div class="hot-list-item"
           v-for="(item, index) in items"
           :key="index"
           @click="goToListPage(item.listSeq)">
        <div class="item-name">{{ item.listTitle }}</div>
        <p>{{ item.userName }}</p>
        <p>{{ item.listContent }}</p>
        <p>좋아요: {{ item.listLike }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

// 인기리스트 데이터 받기
const props = defineProps({
  items: {
    type: Array,
    default: () => [] // 기본값을 빈 배열로 설정
  }
});

const router = useRouter();

// 리스트 페이지로 이동하기
const goToListPage = (listSeq) => {
  router.push(`/list/${listSeq}`); // listSeq 값을 URL에 포함해서 이동
};
</script>

<style scoped>
.hot-list-container {
  margin-top: 150px;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
}

.hot-list-title {
  margin: 20px;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
}

.hot-list-items {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.hot-list-item {
  flex-basis: 18%;
  flex-grow: 1;
  min-width: 240px;
  min-height: 280px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  text-align: left;
}

.item-name {
  font-weight: bold;
}
</style>
