<script setup>
import { reactive } from 'vue';

// 검색 상태 관리
const state = reactive({
  searchCondition: 'postTitle', // 기본 검색 조건
  postTitle: '',
  userNickname: ''
});

const emit = defineEmits(['search']);

// 부모 컴포넌트로 검색 이벤트 전달
const emitSearch = () => {
  emit('search', {
    postTitle: state.searchCondition === "postTitle" && state.postTitle ? state.postTitle : null, // 입력 안되면 null
    userNickname: state.searchCondition === "userNickname" && state.userNickname ? state.userNickname : null
  });
};
</script>

<template>
  <div class="search-container">
    <div class="search-bar">
      <select v-model="state.searchCondition">
        <option value="postTitle">게시글</option>
        <option value="userNickname">작성자</option>
      </select>

      <div class="input-container">
        <input
            v-if="state.searchCondition === 'postTitle'"
            type="text"
            v-model="state.postTitle"
            placeholder="게시글 제목을 입력하세요"
        />

        <input
            v-if="state.searchCondition === 'userNickname'"
            type="text"
            v-model="state.userNickname"
            placeholder="닉네임을 입력하세요"
        />

        <button class="search-button" @click="emitSearch">
          🔍
        </button>

      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  margin-top: 50px;
}

.search-bar {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden; /* 자식 요소가 넘치지 않도록 */
  max-width: 450px;
  width: 100%;
}

select {
  border: none;
  padding: 10px 25px;
  font-size: 16px;
}

.input-container {
  display: flex;
  align-items: center;
  border-left: 1px solid #ccc;
  flex-grow: 1; /* 입력 필드가 가능한 만큼 길어짐 */
}

input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  font-size: 16px;
}

input:focus {
  outline: none; /* 포커스 시 기본 테두리 제거 */
}

.search-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px;
  font-size: 18px;
}

.search-button:hover {
  color: #ff6f20;
}

</style>
