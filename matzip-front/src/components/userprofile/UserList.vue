<script setup>
import ElementBox from "@/components/userprofile/ElementBox.vue";
import { defineProps } from "vue";
import {useAuthStore} from "@/components/stores/auth.js";
import router from "@/router/router.js";

const authStore = useAuthStore();

// props로 데이터 받기
const listBox = defineProps({
  listBoxItems: {
    type: Object,
    required: true,
  }
});

// 리스트 페이지로 이동하기
const goToListPage = (listSeq) => {
  router.push(`/list/${listSeq}`); // listSeq 값을 URL에 포함해서 이동
};

</script>

<template>
  <div>
    <span>Gugu</span>
    <span>님의 리스트</span>
  </div>
      <div>{{ listBox }}</div>
  <br>
  <div class="list-items">
    <article>

      <ElementBox class="list-item" v-for="(item, index) in listBoxItems"
                  :key="index"
                  @click="goToListPage(item.listSeq)">
        <div class="list-item-menu">
          <i class="fa-solid fa-ellipsis"></i>
        </div>

        <br>
        <div class="item-name">{{ listBox.listBoxItems.Title }}</div>
      </ElementBox>
    </article>
  </div>

</template>

<style scoped>
.list-item {
  flex-basis: 18%;
  flex-grow: 1;
  min-width: 240px;
  min-height: 280px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  text-align: left;
}

.item-name {
  font-weight: bold;
}


</style>