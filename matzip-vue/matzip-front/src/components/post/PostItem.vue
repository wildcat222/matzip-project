<script setup>

import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['post-click', 'nickname-click']);
const router = useRouter();

// 게시글 제목 클릭 핸들러
const goToPostDetail = () => {
  emit('post-click', props.post.postSeq); // 게시글 ID 전파
};

// 작성자 닉네임 클릭 핸들러
const goToUserDetail = () => {
  emit('nickname-click', props.post.postUserSeq);  // 작성자 닉네임 전파
};
</script>

<template>
  <tr>
    <td>{{ post.boardCategoryName }}</td>
    <td @click.stop="goToPostDetail" class="post-title">{{ post.postTitle }}</td>
    <td @click.stop="goToUserDetail" class="user-nickname">{{ post.userNickname }}</td>
    <td>{{  new Date(post.postCreatedTime)
        .toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit'}) }}
    </td>

  </tr>
</template>

<style scoped>

</style>
