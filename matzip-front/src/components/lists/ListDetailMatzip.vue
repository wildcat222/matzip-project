<script setup>
import { defineProps } from "vue";

// props 정의
const props = defineProps({
  restaurants: { // 이름을 'restaurants'로 변경
    type: Array,
    default: () => [] // 기본값 설정
  },
});
</script>

<template>
  <div class="list-detail-matzip">
    <ul>
      <li v-for="restaurant in restaurants" :key="restaurant.restaurantTitle">
        <h4>{{ restaurant.restaurantTitle }}</h4>
        <p>{{ restaurant.listMatzipComment }}</p>
        <p>주소: {{ restaurant.restaurantAddress }}</p>
        <p>전화번호: {{ restaurant.restaurantPhone }}</p>
        <p>별점: {{ restaurant.restaurantStar }}</p>
        <img src="../../assets/LikeMark.png"/>
        <p>{{ restaurant.likeCount }}</p>
      </li>
    </ul>
    <p v-if="restaurants.length === 0">등록된 맛집이 없습니다.</p>
  </div>
</template>

<style scoped>
.list-detail-matzip {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
  border: 1px solid #eee;
  border-radius: 5px;
}
h4 {
  margin: 0;
}
</style>
