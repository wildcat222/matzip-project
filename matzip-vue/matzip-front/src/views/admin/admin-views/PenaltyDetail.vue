<template>
  <div class="col p-0 m-0">
    <div class="bg-primary-subtle ps-4">
      <span>사용자 관리 > 패널티 > 패널티 관리 </span>
    </div>
    <div class="container">
      <div class="header">
        <h1>패널티 관리</h1>
        <div class="user-info">
          <span class="nickname">회원 닉네임: {{ reportedUserNickname }}</span> <!-- 피신고자 닉네임 -->
          <span class="category">신고 카테고리: {{ filter.type }}</span> <!-- 카테고리 변수 -->
        </div>
      </div>

      <div class="filters">
        <select v-model="filter.type" class="filter-select">
          <option value="">패널티 타입</option>
          <option value="ban">ban</option>
          <option value="permanent">permanent</option>
        </select>
        <input v-model="filter.reason" placeholder="패널티 사유" class="filter-input" />
        <button @click="onSubmit" class="submit-button">신고 접수</button> <!-- 수정된 부분 -->
      </div>

      <table class="data-table">
        <thead>
        <tr>
          <th>신고번호</th>
          <th>카테고리</th>
          <th>일련번호</th>
          <th>피신고자</th>
          <th>신고일</th>
          <th>신고자</th>
          <th>신고내용</th>
          <th>처리여부</th>
          <th>처리시간</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in paginatedData" :key="item.reportId">
          <td>{{ item.reportSeq }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.seq }}</td>
          <td>{{ item.reportedUserName }}</td>
          <td>{{ item.reportTime }}</td>
          <td>{{ item.reporterUserName }}</td>
          <td>{{ item.reportContent }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.processedAt }}</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const data = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = ref(1);
const filter = ref({ type: '', reason: '' });
const reportedUserNickname = ref(''); // 피신고자 닉네임 저장 변수

// fetchData는 penaltySeq를 사용하여 데이터를 가져옵니다.
const fetchData = async (penaltySeq) => {
  let endpoint = `https://matzipapi.huichan.kr/back/api/v1/report?penaltySeq=${penaltySeq}`; // penaltySeq를 path variable로 사용

  const params = [];

  if (filter.value.type) {
    params.push(`&penaltyType=${filter.value.type}`);
  }
  if (filter.value.reason) {
    params.push(`&penaltyReason=${filter.value.reason}`);
  }

  // 페이지와 사이즈는 쿼리 파라미터로 사용
  params.push(`page=${currentPage.value}`);
  params.push(`size=${itemsPerPage}`);
  endpoint += `&${params.join('&')}`; // ?로 시작하는 쿼리 파라미터 추가

  // URL 로그
  console.log('Request URL:', endpoint); // 생성된 URL 출력

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    data.value = response.data.reports; // 서버에서 받은 데이터
    totalPages.value = Math.ceil(response.data.totalItems / itemsPerPage);

    // 피신고자 닉네임 설정
    if (response.data.reports.length > 0) {
      reportedUserNickname.value = response.data.reports[0].reportedUserName; // 첫 번째 보고서의 피신고자 닉네임
    }
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error);
  }
};

// 신고 접수 버튼 클릭 시 호출되는 함수
const onSubmit = () => {
  const penaltySeq = router.currentRoute.value.params.id; // URL에서 penaltySeq 가져오기
  fetchData(penaltySeq); // penaltySeq를 인자로 전달하여 데이터 로드
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  const penaltySeq = router.currentRoute.value.params.id; // URL에서 penaltySeq 가져오기
  fetchData(penaltySeq); // pagination에 맞는 penaltySeq를 사용하여 데이터 가져오기
};

// onMounted 훅에서 path variable을 사용하여 fetchData 호출
onMounted(() => {
  const penaltySeq = router.currentRoute.value.params.id; // URL에서 penaltySeq 가져오기
  fetchData(penaltySeq); // penaltySeq를 인자로 전달하여 데이터 로드
});

const paginatedData = computed(() => {
  if (!data.value || data.value.length === 0) {
    return [];
  }
  const start = (currentPage.value - 1) * itemsPerPage;
  return data.value.slice(start, start + itemsPerPage);
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.user-info {
  margin-bottom: 10px;
}

.nickname {
  font-weight: bold;
  margin-right: 15px;
}

.category {
  font-weight: bold;
}

.filters {
  margin-bottom: 20px;
}

.filter-select,
.filter-input,
.submit-button {
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.submit-button:hover {
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
