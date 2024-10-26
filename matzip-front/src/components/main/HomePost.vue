<template>
  <div class="home-post-container">
    <div class="board-list">
      <div class="board-item" v-for="(board, index) in boards" :key="index">
        <h3 class="board-name" @click="onBoardClick(board.name)">{{ board.name }}</h3>
        <div class="divider"></div> <!-- 주황색 줄 추가 -->
        <ul class="recent-posts">
          <li v-for="(post, postIndex) in board.recentPosts" :key="postIndex" class="post-item" @click="onPostClick(post.title)">
            - {{ post.title }} by {{ post.userNickname }} <!-- 게시물 제목과 작성자 표시 -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue';

// props로 데이터 받기
const props = defineProps({
  boards: {
    type: Array,
    required: true
  }
});

// 클릭 이벤트 핸들러
const onBoardClick = (name) => {
  console.log(`게시판 ${name} 클릭!`); // 테스트용 코드 지우고 다른 기능 넣을 예정
};

const onPostClick = (post) => {
  console.log(`게시물 ${post.title} 클릭!`); // 테스트용 코드 지우고 다른 기능 넣을 예정
};
</script>

<style scoped>
.home-post-container {
  margin-top: 100px;
  padding: 20px;
}

.board-list {
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  gap: 130px; /* 각 게시판 사이의 간격을 130px로 설정 */
}

.board-item {
  flex: 1 1 calc(50% - 65px); /* 두 개씩 한 줄에 배치되도록 설정 (130px 간격을 고려) */
  max-width: calc(50% - 65px); /* 최대 너비 설정 (130px 간격을 고려) */
  padding: 30px; /* 패딩을 늘려 아이템 크기를 키움 */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  margin: 0; /* 기존의 margin을 제거 */
}

.board-name {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px; /* 줄과의 간격을 조정 */
  cursor: pointer;
}

.divider {
  height: 2px; /* 줄의 두께 */
  background-color: #FF7315; /* 주황색 */
  margin: 10px 0; /* 줄과 위아래 요소 간의 간격 */
}

.recent-posts {
  list-style: none;
  padding: 0;
}

.recent-posts li {
  margin-bottom: 5px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  display: flex; /* 수평으로 배치 */
  justify-content: space-between; /* 양쪽 끝으로 배치 */
}
</style>
