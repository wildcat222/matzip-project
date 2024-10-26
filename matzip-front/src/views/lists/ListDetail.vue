<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import axios from 'axios'; // axios 임포트
// 컴포넌트 추가
import ListDetailContent from '@/components/lists/ListDetailContent.vue';
import ListDetailMatzip from '@/components/lists/ListDetailMatzip.vue';
import ListDetailCmt from '@/components/lists/ListDetailCmt.vue';

const route = useRoute(); // 현재 라우트 정보 가져오는 코드
const listData = ref(null); // 리스트 데이터를 저장할 변수
const listSeq = Number(route.params.listSeq); // url에서 listSeq 가져오기 (long 타입으로 변환)
const errorMessage = ref(''); // 에러코드 저장할 변수
const comments = ref([]); // 댓글 저장할 변수
const selectedRestaurant = ref(null); // 선택된 맛집 저장할 변수
const userComment = ref(''); // 사용자가 입력할 댓글

/* 백에서 데이터 받아오는 코드 */
const fetchData = async () => {
  if (!listSeq) {
    errorMessage.value = '리스트 ID가 없습니다.';
    return;
  }

  try {
    // 리스트 가져오기
    const listResponse = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/listUserSeq/${listSeq}`);
    if (listResponse.data && listResponse.data.data && listResponse.data.data.length > 0) {
      listData.value = listResponse.data.data[0];
      listData.value.restaurants = listData.value.restaurants || []; // 기본값 설정 코드

    } else {
      listData.value = null; // 데이터 없을 때 null 설정
      errorMessage.value = '리스트가 없습니다.'; // 메시지 설정
    }
    // 댓글 가져오기
    const commentsResponse = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/list/${listSeq}/listCmt`);
    if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
      comments.value = commentsResponse.data; // 댓글 데이터 저장
      console.log(comments.value)
    } else {
      comments.value = []; // 댓글 데이터가 없을 경우 빈 배열
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = error.response ? error.response.data.message : error.message;
  }
};

// 선택된 맛집을 내 리스트에 추가하는 함수
const addRestaurantToMyList = async () => {
  if (!selectedRestaurant.value) {
    errorMessage.value = '저장할 맛집을 선택해 주세요.';
    return;
  }

  const restaurantId = Number(selectedRestaurant.value); // restaurantSeq를 숫자로 변환
  console.log(restaurantId)
  if (isNaN(restaurantId)) {
    errorMessage.value = '유효한 맛집 ID를 선택해 주세요.';
    return;
  }

  try {
    // 요청 본문 준비
    const requestBody = {
      listSeq: listSeq, // 내 리스트의 Seq (long 타입)

      listMatzipComment:  '맛집 저장 완료', // 사용자가 입력한 댓글 내용
    };

    console.log('Sending data:', requestBody); // 요청 데이터 로그

    const response = await axios.post('https://matzipapi.huichan.kr/back/api/v1/list/matzip/collect', requestBody);

    if (response.status === 200) {
      alert('맛집이 성공적으로 저장되었습니다.');
      selectedRestaurant.value = null; // 저장 후 선택 초기화
      userComment.value = ''; // 댓글 초기화
      fetchData(); // 데이터 새로고침
    }
  } catch (error) {
    console.error('Error saving restaurant:', error);
    errorMessage.value = error.response ? error.response.data.message : error.message;
  }
};

// 마운팅 될 때 데이터 가져오기
onMounted(fetchData);
</script>

<template>
  <div class="app">
    <div class="detail-content">
      <div class="left-sideBox">
        <div class="list-detail-content">
          <ListDetailContent
              v-if="listData"
              :nickname="listData.userNickname"
              :title="listData.listTitle"
              :content="listData.listContent"
              :commentCount="comments.length"
          />

          <ListDetailCmt
              v-if="comments.length > 0"
              :comments="comments"
          />
        </div>
      </div>
      <div class="right-sideBox">
        <ListDetailMatzip
            v-if="listData"
            :restaurants="listData.restaurants"
            @selectRestaurant="selectedRestaurant = $event"
        />
        <input v-model="userComment" placeholder="댓글을 입력하세요..."/> <!-- 댓글 입력 필드 추가 -->
        <button @click="addRestaurantToMyList">저장하기</button>
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="!listData && !errorMessage">데이터를 불러오는 중입니다...</p>
    </div>
    <div class="map">
  </div>

  </div>
</template>

<style scoped>
.app {
  display: flex;
}

.detail-content {
  display: flex;
  gap: 20px;
}

.list-detail-content{
  background-color: #ffffff;
}

.list-detail-matzip{
  background-color: #ffffff;
}

.right-sideBox {
  margin: 20px 0 0 0;
}

.left-sideBox {

}

.map{
  background-color: #333333; /* 지도 색상 */
  height: 800px;
  width: 1100px;
  position: absolute; /* 절대 위치로 설정 */
  top: 0; /* 상단에 위치 */
  left: 0; /* 좌측에 위치 */
  z-index: -5; /* 내용보다 아래에 위치하도록 z-index 설정 */
}
</style>
