<script setup>
import { defineProps } from "vue";

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  },
});
</script>

<template>
  <div class="list-detail-cmt">
    <h3>댓글</h3>
    <ul>
      <li v-for="(comment, index) in comments" :key="index">
        <p class="name">{{ comment.userNickname }}</p>
        <p class="time">{{ comment.listCommentUpdatedTime }}</p>
        <p class="content">{{ comment.listCommentContent }}</p>
        <div class="like-section">
          <p class="like">Like: {{ comment.likeCount }}</p>
        </div>
      </li>
    </ul>
    <p v-if="comments.length === 0">등록된 댓글이 없습니다.</p>
  </div>
</template>

<style scoped>
.list-detail-cmt {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 13px;
}

h3 {
  margin-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 13px;
  position: relative; /* 자식 요소에 대해 절대 위치를 사용하기 위해 relative 설정 */
  display: flex; /* flexbox 사용 */
  flex-direction: column; /* 세로 방향으로 배치 */
}

h4 {
  margin: 0;
}

.name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.time {
  font-size: 12px;
}

/* 내용이 박스를 넘어가지 않도록 설정 */
.content {
  margin: 5px 0;
  overflow-wrap: break-word; /* 단어가 박스를 넘어가지 않도록 줄 바꿈 설정 */
  white-space: normal; /* 공백을 허용하고 줄 바꿈 설정 */
  flex-grow: 1; /* 남은 공간을 차지하도록 설정 */
}

/* 좋아요 정보 오른쪽 하단에 위치하도록 설정 */
.like-section {
  margin-top: 10px; /* 위쪽 여백 추가 */
}

.like {
  font-size: 14px; /* 좋아요 텍스트 크기 조정 */
}

</style>
