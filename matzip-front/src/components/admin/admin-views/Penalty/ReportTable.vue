<template>
  <div>
    <table class="table">
      <thead>
      <tr>
        <th>신고번호</th>
        <th>카테고리</th>
        <th>일련번호</th>
        <th>피신고자</th>
        <th>신고시간</th>
        <th>신고자</th>
        <th>신고내용</th>
        <th>처리여부</th>
        <th>처리시간</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="report in reports" :key="report.id" @click="selectItem(report)">
        <td>{{ report.reportSeq }}</td>
        <td>{{ report.category }}</td>
        <td>{{ report.seq }}</td>
        <td>{{ report.reportedUserName }}</td>
        <td>{{ report.reportTime }}</td>
        <td>{{ report.reporterUserName }}</td>
        <td>{{ report.reportContent }}</td>
        <td>{{ report.reportStatus }}</td>
        <td>{{ report.reportFinishedTime === null ? '-' : report.reportFinishedTime }}</td>
      </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages">다음</button>
      <button @click="handleReportAction" :disabled="!selectedReport">신고 처리</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  reports: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    required: true
  }
});

// emit 정의
const emit = defineEmits(['page-changed', 'item-selected', 'report-action']);

const selectedReport = ref(null); // 선택된 보고서 저장

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

// 아이템 선택 시 이벤트 발생
const selectItem = (report) => {
  selectedReport.value = report; // 선택된 보고서 저장
  emit('item-selected', { category: report.category, sequence: report.seq });
};

// 신고 처리 버튼 클릭 시 이벤트 발생
const handleReportAction = () => {
  if (selectedReport.value) {
    emit('report-action', selectedReport.value); // 부모에게 선택된 보고서 정보 전달
  }
};

// 페이지 변경 함수
const nextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('page-changed', props.currentPage + 1);
  }
};

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('page-changed', props.currentPage - 1);
  }
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>
