<template>
  <div class="col p-0 m-0">
    <div class="bg-primary-subtle ps-4">
      <span>사용자 관리 > 신고 > 신고 조회</span>
    </div>
    <div class="container p-3">
      <h1>신고 정보 목록</h1>
      <div class="search-bar">
        <select v-model="category" class="search-select">
          <option value="">카테고리</option>
          <option value="message">message</option>
          <option value="review">review</option>
          <option value="post">post</option>
          <option value="list">list</option>
          <option value="list_comment">list_comment</option>
        </select>
        <input v-model="sequence" placeholder="일련번호" class="search-input" />
        <input v-model="reporter" placeholder="신고자" class="search-input" />
        <input v-model="reported" placeholder="피신고자" class="search-input" />
        <select v-model="reportStatus" class="search-select">
          <option value="">처리여부</option>
          <option value="wait">wait</option>
          <option value="penalty">penalty</option>
          <option value="none">none</option>
        </select>
        <button @click="searchReports" class="search-button">조회</button>
      </div>
      <ReportTable
          :reports="reports"
          :currentPage="currentPage"
          :totalItems="totalItems"
          :itemsPerPage="itemsPerPage"
          @item-selected="fetchItemReports"
          @page-changed="changePage"
          @report-action="handleReportAction"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Vue Router 사용
import ReportTable from "@/components/admin/admin-views/Penalty/ReportTable.vue";
import axios from 'axios';

const router = useRouter(); // Router 인스턴스 생성

const category = ref('');
const sequence = ref('');
const reporter = ref('');
const reported = ref('');
const reportStatus = ref('');
const currentPage = ref(1);
const itemsPerPage = 10; // 페이지당 아이템 수
const reports = ref([]); // 조회된 보고서 데이터
const totalItems = ref(0); // 총 아이템 수

// endPoint 생성
const generateEndPoint = () => {
  let endPoint = `/back/api/v1/report?`; // 기본 URL
  if (category.value) endPoint += `category=${category.value}&`;
  if (sequence.value) endPoint += `sequence=${sequence.value}&`;
  if (reporter.value) endPoint += `reporterUserSeq=${reporter.value}&`;
  if (reported.value) endPoint += `reportedUserSeq=${reported.value}&`;
  if (reportStatus.value) endPoint += `reportStatus=${reportStatus.value}&`;
  endPoint += `page=${currentPage.value}&size=${itemsPerPage}`; // 페이지 추가
  return endPoint;
};

// 보고서 조회 함수
const fetchReports = async () => {
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr${generateEndPoint()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    reports.value = response.data.reports; // 조회된 데이터 저장
    totalItems.value = response.data.totalItems; // 총 아이템 수 저장
  } catch (error) {
    console.error('보고서 조회 중 오류 발생:', error);
  }
};

// 검색 기능
const searchReports = async () => {
  currentPage.value = 1; // 검색 시 첫 페이지로 초기화
  await fetchReports(); // 보고서 조회
};

// 아이템 선택 시 해당 아이템의 카테고리와 일련번호로 데이터 조회
const fetchItemReports = async ({ category, sequence }) => {
  currentPage.value = 1; // 첫 페이지로 초기화
  reports.value = []; // 이전 데이터 초기화

  try {
    const response = await axios.get(`${category}&sequence=${sequence}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    reports.value = response.data.reports; // 조회된 데이터 저장
    totalItems.value = response.data.totalItems; // 총 아이템 수 저장
  } catch (error) {
    console.error('보고서 조회 중 오류 발생:', error);
  }
};

// 페이지 변경
const changePage = (newPage) => {
  currentPage.value = newPage;
  fetchReports(); // 페이지 변경 시 데이터 조회
};

// 신고 처리 버튼 클릭 시 라우팅 처리
const handleReportAction = (report) => {
  // 선택된 보고서 정보를 라우팅할 경로에 전달
  router.push({ name: 'ReportHandling', params: { reportId: report.id } });// ReportHandling 페이지로 라우팅
};
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.search-select,
.search-input,
.search-button {
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-select, .search-input {
  flex: 1; /* 입력 필드가 가능한 공간을 차지하도록 설정 */
}

.search-button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.search-button:hover {
  background-color: #0056b3;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.pagination-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>
