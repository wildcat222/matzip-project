<script setup>

import PostItem from "@/components/post/PostItem.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  }
});

const router = useRouter();

// 게시글 상세 페이지로 이동하는 함수
const goToPostDetail = (postSeq) => {
  router.push(`/user/post/${postSeq}`); // 게시글 ID로 상세 페이지로 이동
};

// 사용자 페이지로 이동하는 함수
const goToUserDetail = (userSeq) => {
  router.push(`/user/${userSeq}`); // 사용자 닉네임으로 사용자 페이지로 이동
};

</script>

<template>
  <div class="container">
    <div class="item">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">게시판 카테고리</th>
            <th scope="col">게시글 제목</th>
            <th scope="col">작성자</th>
            <th scope="col">작성 일자</th>
          </tr>
        </thead>
        <tbody>
          <PostItem
              v-for="post in posts"
              :key="post.postSeq"
              :post="post"
              @post-click="goToPostDetail"
              @nickname-click="goToUserDetail"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  display : flex;
  flex-direction: column;
}
</style>
