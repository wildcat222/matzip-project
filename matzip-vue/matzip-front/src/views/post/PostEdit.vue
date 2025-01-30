<script setup>
import PostForm from "@/components/post/Postform.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const postData = ref(null);
const postId = ref(null);

const fetchPostData = async (postId) => {
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/posts/${postId}`);
    postData.value = response.data.data2;
  } catch (error) {
    console.error("게시글 정보를 불러오는 중 오류 발생: ", error);
  }
}

const handlePostEdit = async (formData) => {
  try {
    await axios.put(`https://matzipapi.huichan.kr/back/api/v1/posts/${postId.value}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,   // localStorage에서 토큰 읽기
        "Content-Type": "application/json",
      },
    });
    alert('게시글이 정상적으로 수정되었습니다.');
    router.push("/user/post")
  } catch (error) {
    console.error("게시글 수정 중 오류 발생: ", error);
    alert('게시글 수정에 실패했습니다.');
  }
}

// 페이지가 마운트될 때 게시글 데이터 가져오기
onMounted(() => {
  postId.value = Number(router.currentRoute.value.params.id);
  fetchPostData(postId.value);
})
</script>

<template>
  <div>
    <PostForm
        title="게시글 수정" @submit="handlePostEdit" :initialData="postData"
    />
  </div>
</template>
