<script setup>
import { defineProps, ref } from "vue";
import axios from "axios";

// props 정의
const props = defineProps({
  restaurants: {
    type: Array,
    default: () => []
  },
});

const isModalOpen = ref(false); // 모달 열림 상태 관리
const selectedRestaurant = ref(null); // 선택한 맛집
const selectedListSeq = ref(null); // 선택된 리스트 ID
const myListOptions = ref([
  { id: 1, name: "나의 리스트 1" },
  { id: 2, name: "나의 리스트 2" },
  { id: 3, name: "나의 리스트 3" },
  { id: 4, name: "나의 리스트 4" },
  { id: 5, name: "나의 리스트 5" },
  { id: 6, name: "나의 리스트 6" },
]);

// 모달을 여는 함수
const openModal = (restaurant) => {
  selectedRestaurant.value = restaurant;
  isModalOpen.value = true;
};

// 모달을 닫는 함수
const closeModal = () => {
  isModalOpen.value = false;
  selectedRestaurant.value = null;
};

// 맛집을 나의 리스트에 추가하는 함수
const addRestaurantToList = async () => {
  try {
    const response = await axios.post("https://matzipapi.huichan.kr/back/v1/list/matzip/collect", {
      listSeq: selectedListSeq.value,
      restaurantSeq: selectedRestaurant.value.restaurantSeq,
      listMatzipComment: selectedRestaurant.value.listMatzipComment,
    });

    console.log("맛집 추가 성공:", response.data);
    closeModal(); // 추가 완료 후 모달 닫기
  } catch (error) {
    console.error("맛집 추가 실패:", error);
  }
};
</script>

<template>
  <div class="list-detail-matzip">
    <ul>
      <li v-for="restaurant in restaurants" :key="restaurant.restaurantTitle">
        <h4>{{ restaurant.restaurantTitle }}</h4>
        <p>{{ restaurant.listMatzipComment }}</p>
        <p>주소: {{ restaurant.restaurantAddress }}</p>
        <p>전화번호: {{ restaurant.restaurantPhone }}</p>
        <p>별점: {{ restaurant.restaurantStar }}</p>
        <img src="../../assets/LikeMark.png" />
        <p>{{ restaurant.likeCount }}</p>
        <!-- 모달 열기 버튼 추가 -->
        <button @click="openModal(restaurant)">리스트에 추가</button>
      </li>
    </ul>
    <p v-if="restaurants.length === 0">등록된 맛집이 없습니다.</p>

    <!-- 모달 -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>맛집 가져오기</h3>
        <p>어디에 추가할까요?</p>
        <!-- 선택 목록에 스크롤과 제한된 높이 추가 -->
        <div class="select-scrollable">
          <label v-for="list in myListOptions" :key="list.id" class="select-option">
            <input type="radio" v-model="selectedListSeq" :value="list.id" />
            {{ list.name }}
          </label>
        </div>
        <button @click="addRestaurantToList">저장하기</button>
        <button @click="closeModal">닫기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-detail-matzip {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}
.select-scrollable {
  max-height: 120px; /* 최대 높이를 5개 항목 정도로 제한 */
  overflow-y: auto; /* 스크롤 생성 */
  margin: 10px 0;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
}
.select-option {
  display: block;
  margin: 5px 0;
}
</style>
