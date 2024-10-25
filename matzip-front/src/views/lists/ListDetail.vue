<script setup>
import {ref, onMounted} from "vue";
import {useRoute} from 'vue-router';
import axios from 'axios'; // axios 임포트

//컴포넌트 추가
import ListDetailContent from '@/components/lists/ListDetailContent.vue';
import ListDetailMatzip from '@/components/lists/ListDetailMatzip.vue';
import ListDetailCmt from '@/components/lists/ListDetailCmt.vue';

const route = useRoute(); // 현재 라우트 정보 가져오는 코드
const listData = ref(null); // 리스트 데이터를 저장할 변수
const listSeq = route.params.listSeq; // url에서 listSeq 가져오기
const errorMessage = ref(''); // 에러코드 저장할 변수
const comments = ref([]); // 댓글 저장할 변수

/* 백에서 데이터 받아오는 코드 */
const fetchData = async () => {
  if (!listSeq) {
    errorMessage.value = '리스트 ID가 없습니다.';
    console.log('listSeq:', listSeq);
    return;
  }

  try {
    // 리스트 가져오기
    const listResponse = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/listUserSeq/${listSeq}`); // API URL 입력

    if (listResponse.data && listResponse.data.data && listResponse.data.data.length > 0) {
      listData.value = listResponse.data.data[0];
      listData.value.restaurants = listData.value.restaurants || []; // 기본값 설정 코드

    } else {
      listData.value = null; // 데이터 없을 때 null 설정
      errorMessage.value = '리스트가 없습니다.'; // 메시지 설정
    }

    //댓글 가져오기
    const commentsResponse = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/list/${listSeq}/listCmt`);
      console.log('댓글 데이터:', commentsResponse.data);
    if(commentsResponse.data && Array.isArray(commentsResponse.data)){
      comments.value = commentsResponse.data; // 댓글 데이터 저장
      console.log(comments.value);
    }else{
      comments.value = []; // 댓글 데이터가 없을 경우 빈 배열
    }


  } catch (error) {
    console.error('Error fetching data:', error);
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
        <ListDetailContent
            v-if="listData"
            :nickname="listData.userNickname"
            :title="listData.listTitle"
            :content="listData.listContent"
        />
        <ListDetailCmt
            v-if="comments.length > 0"
            :comments="comments"
        />
      </div>
      <div class="right-sideBox">
        <ListDetailMatzip
            v-if="listData"
            :restaurants="listData.restaurants"
        />
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="!listData && !errorMessage">데이터를 불러오는 중입니다...</p>
    </div>
  </div>
</template>


<style scoped>
.app {
  display: flex;
}
.detail-content{
  display:flex;
  gap: 20px;
}

.right-sideBox{
  margin: 20px 0 0 0;
}
</style>
