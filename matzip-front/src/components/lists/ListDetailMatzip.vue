<script setup>
import { defineProps, ref, onMounted } from "vue";
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
const myListOptions = ref([]); // 나의 리스트 옵션을 동적으로 불러오기

// 로컬 스토리지에서 userSeq 가져오기
const getUserSeqFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub; // 토큰의 sub 필드가 userSeq임을 가정
    } catch (error) {
      console.error("토큰 파싱 오류:", error);
      return null;
    }
  }
  return null;
};

const userSeq = getUserSeqFromToken(); // 로컬 스토리지에서 userSeq 가져옴

// 나의 리스트 서랍의 리스트 목록을 불러오는 함수
const fetchMyListOptions = async () => {
  try {
    if (!userSeq) {
      console.error("유효한 userSeq가 없습니다.");
      return;
    }

    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/${userSeq}`);
    const listData = response.data.data2.listSearchUserDTOs;

    // listSeq와 listTitle만 선택
    myListOptions.value = listData.map((item) => ({
      id: item.listSeq,
      name: item.listBoxList[0].listTitle
    }));
  } catch (error) {
    console.error("리스트 불러오기 실패:", error);
  }
};

// 모달을 여는 함수
const openModal = (restaurant) => {
  selectedRestaurant.value = restaurant;
  isModalOpen.value = true;
  console.log(selectedRestaurant.value);
};

// 모달을 닫는 함수
const closeModal = () => {
  isModalOpen.value = false;
  selectedRestaurant.value = null;
  selectedListSeq.value = null; // 모달을 닫을 때 선택된 리스트 ID 초기화
};

// 맛집을 나의 리스트에 추가하는 함수
const addRestaurantToList = async () => {
  try {
    if (!selectedListSeq.value) {
      console.error("리스트를 선택해야 합니다.");
      return;
    }

    const hardcodedRestaurantSeq = selectedRestaurant.value.restaurantSeq; // 선택한 맛집의 restaurantSeq를 가져옴
    const hardcodedComment = "이 맛집 정말 맛있어요!";

    const response = await axios.post("https://matzipapi.huichan.kr/back/api/v1/list/matzip/collect", {
      listSeq: selectedListSeq.value, // 선택한 리스트 ID 사용
      restaurantSeq: hardcodedRestaurantSeq, // 선택한 맛집 ID
      listMatzipComment: hardcodedComment, // 댓글
    });

    console.log("맛집 추가 성공:", response.data);
    closeModal(); // 추가 완료 후 모달 닫기
  } catch (error) {
    console.error("맛집 추가 실패:", error);
  }
};

// 컴포넌트가 로드될 때 나의 리스트 옵션 불러오기
onMounted(() => {
  fetchMyListOptions();
});
</script>

<template>
  <div class="list-detail-matzip">
    <ul>
      <li v-for="restaurant in restaurants" :key="restaurant.restaurantSeq">
        <h4>{{ restaurant.restaurantTitle }}</h4>
        <p>{{ restaurant.listMatzipComment }}</p>
        <p>주소: {{ restaurant.restaurantAddress }}</p>
        <p>전화번호: {{ restaurant.restaurantPhone }}</p>
        <p>별점: {{ restaurant.restaurantStar }}</p>
        <img src="../../assets/LikeMark.png"/>
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
            <input type="radio" v-model="selectedListSeq" :value="list.id"/>
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
  max-height: 100px; /* 최대 높이를 늘림 */
  overflow-y: auto;
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