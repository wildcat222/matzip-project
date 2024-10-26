<script setup>
import {onMounted, ref} from 'vue';
import TableComponent from "@/components/admin/admin-views/activity-level/TableComponent.vue";
import axios from "axios";


const tableData = ref();
const currentPage = ref(1); // 현재 페이지
const maxPages = ref(0); // 최대 페이지 수


// 'edit' 이벤트를 처리하는 함수
function handleEdit(level) {


}

const updateActiveLevel = async () => {

  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/user/api/v1/active-l`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
    );
    tableData.value = response.data['activeLevels'];
    console.log(tableData.value)
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
  }
}

// 페이지 이동 함수
const goToPage = (page) => {
  currentPage.value = page;
  search(currentPage.value);
  console.log(`Navigated to page ${page}`);
};

// 다음 페이지로 이동하는 함수
const goToMaxPage = () => {
  if (currentPage.value < maxPages.value) {
    currentPage.value = maxPages.value;
    search(currentPage.value);
  }
};

const goToMinPage = () => {
  if (currentPage.value > 1) {
    currentPage.value = 1;
    search(currentPage.value);
  }
}

const search = async (page) => {

  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/user/api/v1/active-level?page=${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
    );
    tableData.value = response.data['activeLevels'];
    console.log(tableData.value)
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
  }
}

const getAllPages = async () => {

  try {
    const response = await axios.get("https://matzipapi.huichan.kr/user/api/v1/active-level-count", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    const cnt = response.data.data2;
    maxPages.value = Math.ceil(cnt / 10);
    console.log(response);


  } catch (error) {
    console.log(error);
  }
}

// mounted hook (onMounted 사용)
onMounted(() => {
  // filteredData.value = tableData.value;
  getAllPages();
  search(1);
});
</script>

<template>
  <div class="col p-0 m-0">

    <div class="bg-primary-subtle ps-4">
      <span>사용자 관리 > 회원 > 활동 등급 관리 </span>
    </div>
    <div class="col my-4 ms-4">
      <h2 class="mb-4">활동 등급 관리</h2>


      <TableComponent :tableData="tableData" @edit="handleEdit"/>

      <div>
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <button class="page-link" @click="goToMinPage" :disabled="currentPage <= 1">&laquo;</button>
          </li>
          <li class="page-item" v-for="n in maxPages" :key="n">
            <button class="page-link" @click="goToPage(n)">{{ n }}</button>
          </li>
          <li class="page-item">
            <button class="page-link" @click="goToMaxPage" :disabled="currentPage >= maxPages">&raquo;</button>
          </li>
        </ul>
      </div>

      <!-- Add Button -->
      <div class="text-end mt-3">
        <button class="btn btn-custom">추가</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Add any custom style if needed */
</style>
