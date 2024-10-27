<template>
  <div class="board-list" style="justify-content: center">
    <div class="board-item" v-for="(board, index) in boards" :key="index">
      <h3 class="board-name" @click="onBoardClick(board.boardCategorySeq)">{{ board.boardCategoryName }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  boards: {
    type: Array,
    required: true
  }
});

// 이벤트 정의
const emit = defineEmits(['board-click']);

// 클릭 이벤트 핸들러
const onBoardClick = (boardSeq) => {
  emit('board-click', boardSeq);  // 클릭한 게시판의 ID(boardSeq)를 부모 컴포넌트로 전송
};

</script>

<style scoped>

.board-list {
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  gap: 20px; /* 각 게시판 사이의 간격 설정 */
}

.board-name {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  trinsition: color 0.3s;
}

.board-name:hover {
  color: #ff6f20;
}

</style>
