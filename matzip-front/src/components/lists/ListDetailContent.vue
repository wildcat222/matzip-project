<script setup>
  import { defineProps } from 'vue';

  // props 정의
  const props = defineProps({
    nickname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    commentCount: {
      type: Number,
      required: true,
    }
  });
</script>

<template>
  <div class = "list-detail-content">
    <div class="header">
      <img src="../../assets/ListMark.png"/>
      <h3>{{ nickname }}의 리스트</h3>
    </div>
    <h2>{{ title }}</h2>
    <p>{{ content }}</p>
    <div class="countCmt">
      <img src="../../assets/CommentMark.png"/>
      <p>{{ commentCount }}</p>
    </div>
  </div>
</template>

<style scoped>
.list-detail-content {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 20px 0;
}
h2 {
  margin-bottom: 10px;
}
h3 {
  color: #555;
}
.countCmt{
  display:flex;
}
</style>