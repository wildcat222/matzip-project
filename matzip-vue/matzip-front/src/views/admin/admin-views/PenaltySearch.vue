<template>
  <div class="col p-0 m-0">
    <div class="bg-primary-subtle ps-4">
      <span>사용자 관리 > 패널티 > 패널티 관리 </span>
    </div>
    <div class="container p-3">
      <h1>패널티 정보 목록</h1>
      <div class="filters">
        <select v-model="filter.type" class="filter-select">
          <option value="">패널티 타입</option>
          <option value="ban">ban</option>
          <option value="permanent">permanent</option>
        </select>
        <input v-model="filter.reason" placeholder="패널티 사유" class="filter-input" />
        <button @click="fetchData" class="submit-button">조회</button>
      </div>
      <table class="data-table">
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
          <td><button @click="viewDetails(item.penaltySeq)" class="detail-button">조회</button></td>
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
import {ref, computed, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';

const router = useRouter();
const data = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = ref(1);
const filter = ref({state: '', type: '', reason: ''});

const fetchData = async () => {
  let endpoint = 'https://matzipapi.huichan.kr/back/api/v1/penalty?';
  const params = [];
  if (filter.value.state) {
    params.push(`penaltyStatus=${filter.value.state}`);
  }
  if (filter.value.type) {
    params.push(`penaltyType=${filter.value.type}`);
  }
  if (filter.value.reason) {
    params.push(`penaltyReasonContent=${filter.value.reason}`);
  }
  params.push(`page=${currentPage.value}`);
  params.push(`size=${itemsPerPage}`);

  endpoint += params.join('&');
  console.log('Request URL:', endpoint);

  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    data.value = response.data.penalties;
    totalPages.value = Math.ceil(response.data.totalPenalties / itemsPerPage);
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error);
  }
};

const viewDetails = (id) => {
  router.push(`/admin/penalty-detail/${id}`);
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchData();
};

const paginatedData = computed(() => {
  if (!data.value || data.value.length === 0) {
    return [];
  }
  const start = (currentPage.value - 1) * itemsPerPage;
  return data.value.slice(start, start + itemsPerPage);
});

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.detail-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.detail-button:hover {
  background-color: #218838;
}
</style>
