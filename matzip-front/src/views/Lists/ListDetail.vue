<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import axios from 'axios';
import ListDetailContent from '@/components/lists/ListDetailContent.vue';
import ListDetailMatzip from '@/components/lists/ListDetailMatzip.vue';
import ListDetailCmt from '@/components/lists/ListDetailCmt.vue';
import ListDetailMap from "@/components/lists/ListDetailMap.vue";

const route = useRoute();
const listData = ref(null);
const listSeq = Number(route.params.listSeq);
const errorMessage = ref('');
const comments = ref([]);
const selectedRestaurant = ref(null);
const userComment = ref(''); // 사용자 댓글

// 백에서 데이터 받아오는 코드
const fetchData = async () => {
  if (!listSeq) {
    errorMessage.value = '리스트 ID가 없습니다.';
    return;
  }

  try {
    const listResponse = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/listUserSeq/${listSeq}`); // 여기서 restaurantSeq 받아와야함
    if (listResponse.data && listResponse.data.data && listResponse.data.data.length > 0) {
      listData.value = listResponse.data.data[0];
      listData.value.restaurants = listData.value.restaurants || [];
    } else {
      listData.value = null;
      errorMessage.value = '리스트가 없습니다.';
    }

    const commentsResponse = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/list/${listSeq}/listCmt`);
    if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
      comments.value = commentsResponse.data;
    } else {
      comments.value = [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = error.response ? error.response.data.message : error.message;
  }
};

// 댓글 등록하는 함수
const addComment = async () => {
  if (!userComment.value) {
    errorMessage.value = '댓글 내용을 입력하세요.';
    return;
  }

  const requestBody = {
    listSeq: listSeq,
    listCommentContent: userComment.value,
  };

  try {
    // Axios에 인증 토큰 포함하기
    const accessToken = localStorage.getItem('accessToken'); // localStorage에서 토큰 가져오기
    const response = await axios.post('https://matzipapi.huichan.kr/back/api/v1/list/comment', requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // 인증 헤더 추가
      },
    });

    if (response.status === 200) {
      alert('댓글이 성공적으로 등록되었습니다.');
      userComment.value = ''; // 댓글 입력 필드 초기화
      fetchData(); // 데이터 새로고침
    }
  } catch (error) {
    console.error('Error adding comment:', error);
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
              :userSeq="listData.listUserSeq"
              :nickname="listData.userNickname"
              :title="listData.listTitle"
              :content="listData.listContent"
              :commentCount="comments.length"
          />
          <ListDetailCmt
              v-if="comments.length > 0"
              :comments="comments"
          />
          <div class="comment-section">
            <input v-model="userComment" placeholder=" 댓글을 입력하세요..."/>
            <button @click="addComment">
              <div class="Cmttext">
                 댓글 등록
              </div>
            </button> <!-- 댓글 등록 버튼 추가 -->
          </div>
        </div>
      </div>
      <div class="right-sideBox">
        <ListDetailMatzip
            v-if="listData"
            :restaurants="listData.restaurants"
            @selectRestaurant="selectedRestaurant = $event"
        />
      </div>

      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="!listData && !errorMessage">데이터를 불러오는 중입니다...</p>
    </div>
    <div class="map">
      <ListDetailMap
        v-if="listData"
        :restaurants="listData.restaurants"
      />
    </div>
  </div>
</template>

<style scoped>
.detail-content {
  justify-content: space-between;
  display: flex;
  gap: 20px;
  /* 화면 왼쪽에 위치시키기 위해 flex-direction을 column으로 설정 */
}

.left-sideBox, .right-sideBox {
  margin: 20px 0 30px 0;
  min-width: 300px; /* 최소 너비 설정 */
  max-width: 400px; /* 최대 너비 설정 (필요에 따라 조정 가능) */
  overflow: hidden; /* 넘치는 내용 숨기기 */
  text-overflow: ellipsis; /* 넘치는 내용에 대해 ... 표시 */
  white-space: nowrap; /* 텍스트가 한 줄로 표시되도록 설정 */
}

.left-sideBox{
  border: 1px solid #ddd;
  border-radius: 13px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.list-detail-content {
  background: #fff;
  padding: 0.1px 20px 0.1px 20px;
  border-radius: 13px;
  max-height: 75vh;
  overflow: auto;
}

.list-detail-matzip {
  background: #fff;
  border-radius: 13px;
}

.comment-section {
  margin: 20px 0 20px 0; /* 댓글 입력 영역에 여백 추가 */
  display: flex;
  justify-content: center;
}

.map {
  background: linear-gradient(to bottom, #f0f0f0, #ffffff); /* 그라데이션 설정 */
  height: 100%; /* 화면 전체 높이 설정 */
  width: 100%; /* 화면 전체 너비 설정 */
  position: absolute; /* 절대 위치 설정 */
  top: 0;
  left: 0;
  z-index: -1; /* 맵이 콘텐츠 뒤에 있도록 설정 */
}

input {
  border: 1px solid #FF7315;
  border-radius: 13px;
}

button {
  background-color: #FF7315;
  border: 1px solid #FF7315;
  border-radius: 13px;
}

.Cmttext {
  color: #f0f0f0;
}
</style>
