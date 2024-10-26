<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import axios from 'axios';
import ListDetailContent from '@/components/lists/ListDetailContent.vue';
import ListDetailMatzip from '@/components/lists/ListDetailMatzip.vue';
import ListDetailCmt from '@/components/lists/ListDetailCmt.vue';

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
            <input v-model="userComment" placeholder="댓글을 입력하세요..."/>
            <button @click="addComment">댓글 등록</button> <!-- 댓글 등록 버튼 추가 -->
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
    <div class="map"></div>
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
.comment-section {
  margin-top: 20px; /* 댓글 입력 영역에 여백 추가 */
}
.map {
  background-color: #333333;
  height: 800px;
  width: 1100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -5;
}
</style>