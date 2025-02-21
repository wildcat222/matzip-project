<script setup>
import { computed } from 'vue';

// 부모 컴포넌트로부터 전달받는 props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  totalPosts: {
    type: Number,
    required: true
  }
});

// 페이지 변경 시 부모 컴포넌트로 이벤트를 전달
const emit = defineEmits(['page-changed']);

// 페이지 변경 함수
const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-changed', page); // 부모에게 페이지 변경 이벤트 전달
  }
};

// 현재 페이지 주변의 페이지 번호를 계산
/*
computed 속성은 의존하는 반응형 데이터가 변경될 때 자동으로 다시 계산된다. 이를 통해 상태가 변할 때마다 관련 데이터를 동기화할 수 있다.
또한 한 번 계산된 값을 캐싱하여, 의존하는 데이터가 변경되지 않는 한 동일한 결과를 반복적으로 계산하지 않는다. 이는 성능을 향상시키는 데 도움이 된다.
*/
const visiblePages = computed(() => {
  const pages = [];
  const range = 5; // 현재 페이지를 기준으로 몇 개의 페이지를 표시할지 결정
  const start = Math.max(1, props.currentPage - range);
  const end = Math.min(props.totalPages, props.currentPage + range);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});
</script>

<template>
  <div class="paging-bar">
    <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)">
      Previous
    </button>

    <span v-for="page in visiblePages" :key="page">
      <button
          :class="{ active: page === currentPage }"
          @click="changePage(page)">
        {{ page }}
      </button>
    </span>

    <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)">
      Next
    </button>

    <div class="pagination-info">
      Page {{ currentPage }} of {{ totalPages }} ({{ totalPosts }} items)
    </div>
  </div>
</template>

<style scoped>
.paging-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 20px;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #e0e0e0;
  cursor: pointer;
  font-size: 1rem;
}

button.active {
  background-color: #ff6f20;
  color: white;
}

button:disabled {
  background-color: #b0b0b0;
  cursor: not-allowed;
}

.pagination-info {
  margin-left: 1rem;
  font-size: 0.875rem;
  color: #757575;
}
</style>
