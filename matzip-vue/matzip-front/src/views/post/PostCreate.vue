<script setup>
import PostForm from "@/components/post/PostForm.vue"
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

/* 게시글 제출 함수 */
const handlePostCreate = async (dataToSend) => {
  // 게시글 데이터를 서버에 전송하는 코드
  try {
    await axios.post('https://matzipapi.huichan.kr/back/api/v1/posts', dataToSend,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,   // localStorage에서 토큰 읽기
        "Content-Type": "application/json",
      },
    });
    alert('게시글이 정상적으로 등록되었습니다.');
    router.push('/user/post'); // 게시글 목록 페이지로 리다이렉트
  } catch (error) {
    console.error('Post submission failed:', error);
    alert('게시글 등록에 실패했습니다.');
  }
};

</script>

<template>
  <div>
    <PostForm title="게시글 작성" @submit="handlePostCreate"/>
  </div>
</template>

