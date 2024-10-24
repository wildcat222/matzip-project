<template class="main-template">
  <div class="main-container">

    <h1 class="space-text">Space</h1>
<!--     맵 & 인기태그-->
    <div class="main-map">
      <current-map />
      <hot-tag :tags="tags" />
    </div>
<!--  인기 리스트  -->
    <div class="main-list">
      <hot-list :items="hotListItem" />
    </div>
<!--  게시판  -->
    <div class="main-post">
      <home-post :boards="boards" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import HotTag from '@/components/main/HotTag.vue';
import CurrentMap from '@/components/main/CurrentMap.vue';
import HotList from '@/components/main/HotList.vue';
import HomePost from '@/components/main/HomePost.vue';

// 인기 태그 배열 선언
const tags = ref([]);
const errorMessage = ref(null);
// 인기 리스트 배열 선언
const hotListItem = ref([]);
게시판 배열 선언
const boards = ref([]);


// 인기 태그 마운트 될때 데이터 가져오기
onMounted(async () =>{
  try{
    // 인기 태그 가져오기
    const tagResponse = await axios.get('http://localhost:8000/back/api/v1/posts/top-10-tags');
    if(tagResponse.data && tagResponse.data.data2 && tagResponse.data.data2.tags){
      tags.value = tagResponse.data.data2.tags;
    }else{
      tags.value = []; // 데이터 없을때 빈 배열 나오게 설정
      errorMessage.value= '태그가 없습니다.'
    }

    // 인기 리스트 가져오기
    const listResponse = await axios.get('http://localhost:8000/back/api/v1/listBox/top')
    if(listResponse.data && listResponse.data.data){
      hotListItem.value = listResponse.data.data;

    }else{
      hotListItem.value = [];
      errorMessage.value='리스트가 없습니다.'
      console.log(hotListItem.value);
    }


    // 게시판 데이터 가져오기
      const page=1;
      const size=2;
      const boardSeq=1; // 초기값 설정, 나중에 증가 가

      const postResponse = await axios.get('http://localhost:8000/back/api/v1/boards/${boardSeq}/posts',{
        params: { page, size }
      });

      boards.value = postResponse.data.map(post => ({
        name: post.boardCategoryName,
        recentPosts: post.postTitle
      }));
      console.log(listResponse)
  } catch(error){
    console.error('데이터 가져오기 실패:', error);
    errorMessage.value = error.response ? error.response.data.message : error.message; // 에러메세지 저장
  }
});


</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column; /* 수직 정렬을 위해 열 방향으로 설정 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  height: 100vh; /* 화면 전체 높이를 사용 */
}

.main-map {
  display: flex;
}

.space-text {
  /* 원하는 스타일 추가 */
}

h1{
  text-align: left;
}
</style>