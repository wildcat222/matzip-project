<script setup>
import { ref, reactive, onMounted } from "vue";
import PostList from "@/components/post/PostList.vue"
import PagingBar from "@/components/post/PagingBar.vue";
import SearchBar from "@/components/post/SearchBar.vue";
import BoardCategoryList from "@/components/post/BoardCategoryList.vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// 상태 관리를 위한 반응형 객체 생성
const state = reactive({
  posts: [],
  boards: [],
  currentPage: 1,
  totalPages: 1,
  totalPosts: 0,
  postTitle: '',
  userNickname: ''
});

// 게시판 카테고리 조회 API 호출
const fetchBoards = async () => {
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/board`);
    state.boards = response.data.data;  // 게시판 데이터 저장
  } catch (error) {
    console.log('게시판 목록을 불러오는 중 에러가 발생했습니다: ', error);
  }
};

// 게시판 별 게시글 목록 조회 API 호출
const fetchPostsByBoard = async (boardSeq) => {
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/boards/${boardSeq}/posts`);
    state.posts = response.data.data2.posts;
    state.currentPage = response.data.data2.currentPage;
    state.totalPages = response.data.data2.totalPages;
    state.totapPosts = response.data.data2.totapPosts;
  } catch (error) {
    console.error('게시글 목록을 불러오는 중 에러가 발생했습니다: ', error);
  }
};

// 검색 조건이 변경될 때마다 API 호출 함수
const fetchPosts = async (page = 1) => {
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/posts`, {
      params: {
        page,
        postTitle: state.postTitle || null,
        userNickname: state.userNickname || null
      }
    });
    console.log(response);
    state.posts = response.data.data2.posts;
    state.currentPage = response.data.data2.currentPage;
    state.totalPages = response.data.data2.totalPages;
    state.totalPosts = response.data.data2.totalPosts;
    console.log(state);
  } catch (error) {
    console.error('게시글 목록을 불러오는 중 에러가 발생했습니다: ', error);
  }
};

// 검색 조건이 변경될 때마다 API 호출
const onSearch = (searchParams) => {
  state.postTitle = searchParams.postTitle;
  state.userNickname = searchParams.userNickname;
  fetchPosts(1);  // 페이지를 1로 초기화하고 다시 호출
};

// 상품 등록 페이지 route
const goToPostCreate = () => {
  router.push(`/user/post/create`);
};

// 컴포넌트 마운트 시 제품 목록 로드
onMounted(() =>{
  fetchBoards(); // 게시판 카테고리 조회
  fetchPosts();  // 게시글 목록 조회
});
</script>

<template>
  <div style="margin-top: 50px" >
    <SearchBar @search="onSearch"  style="margin-bottom: 30px"/>
    <BoardCategoryList :boards="state.boards" @board-click="fetchPostsByBoard"/>
    <div class="button-container" style="margin-top: 20px; margin-bottom: 30px">
      <button @click="goToPostCreate">✏️ ️ 새 글을 작성해보세요</button>
    </div>
    <PostList :posts="state.posts" />
    <PagingBar
        :currentPage="state.currentPage"
        :totalPages="state.totalPages"
        :totalPosts="state.totalPosts"
        @page-changed="fetchPosts"
    />
  </div>
</template>

<style scoped>

.button-container {
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  margin-bottom: 10px; /* 아래쪽 여백 */
}

button {
  flex-grow: 1; /* 버튼이 가능한 만큼 길어짐 */
  padding: 10px; /* 버튼 안쪽 여백 */
  background-color: #ff6f20;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 13px; /* 모서리 둥글게 */
}

button:hover {
  background-color: #e65c15; /* 호버 시 색상 변경 */
}

div {
  text-align: center;
  margin-bottom: 10px;
}
</style>
