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
        <p>{{ comment.userNickname }}</p>
         <p>{{ comment.listCommentContent }}</p>
        <p>업데이트: {{ comment.listCommentUpdatedTime }}</p>
        <p>좋아요수: {{ comment.likeCount }}</p>
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
}
h4 {
  margin: 0;
}
</style>