<template>
  <div class="col p-0 m-0">
    <div class="bg-primary-subtle ps-4">
      <span>사용자 관리 > 패널티 > 패널티 관리 </span>
    </div>
    <div class="p-3">
      <h1>패널티 정보 목록</h1>
      <div class="filters">
        <select v-model="filter.type">
          <option value="">패널티 타입</option>
          <option value="ban">ban</option>
          <option value="permanent">permanent</option>
        </select>
        <input v-model="filter.reason" placeholder="패널티 사유" />
        <button @click="fetchData">조회</button>
      </div>
      <table>
        <thead>
        <tr>
          <th>패널티 번호</th>
          <th>닉네임</th>
          <th>타입</th>
          <th>사유</th>
          <th>시작일</th>
          <th>종료일</th>
          <th>상세조회</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in paginatedData" :key="item.penaltySeq">
          <td>{{ item.penaltySeq }}</td>
          <td>{{ item.userNickname }}</td>
          <td>{{ item.penaltyType }}</td>
          <td>{{ item.penaltyReasonContent }}</td>
          <td>{{ item.penaltyStartDate }}</td>
          <td>{{ item.penaltyEndDate }}</td>
          <td><button @click="viewDetails(item.penaltySeq)">조회</button></td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const data = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = ref(1);
const filter = ref({ state: '', type: '', reason: '' }); // 패널티 사유로 필터 추가

const fetchData = async () => {
  // 기본 엔드포인트
  let endpoint = 'https://matzipapi.huichan.kr/back/api/v1/penalty?';

  // 조건에 따라 쿼리 파라미터 추가
  const params = [];
  if (filter.value.state) {
    params.push(`penaltyStatus=${filter.value.state}`);
  }
  if (filter.value.type) {
    params.push(`penaltyType=${filter.value.type}`);
  }
  if (filter.value.reason) { // 패널티 사유로 검색
    params.push(`penaltyReasonContent=${filter.value.reason}`);
  }

  // 페이지 및 사이즈 추가
  params.push(`page=${currentPage.value}`);
  params.push(`size=${itemsPerPage}`);

  // 쿼리 파라미터를 URL에 추가
  endpoint += params.join('&');

  // URL 로그
  console.log('Request URL:', endpoint);

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 토큰 추가
      }
    });
    data.value = response.data.penalties; // 서버에서 받은 데이터
    totalPages.value = Math.ceil(response.data.totalPenalties / itemsPerPage); // 총 페이지 수 계산
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error);
  }
};

const viewDetails = (id) => {
  // 상세 조회 로직
  console.log('상세 조회 ID:', id);
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchData();
};

// 계산된 속성: 현재 페이지의 데이터
const paginatedData = computed(() => {
  if (!data.value || data.value.length === 0) {
    return []; // 데이터가 없을 경우 빈 배열 반환
  }
  const start = (currentPage.value - 1) * itemsPerPage;
  return data.value.slice(start, start + itemsPerPage);
});

// 컴포넌트가 mounted될 때 기본 조회
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.pagination {
  margin-top: 20px;
}
</style>
