<script setup>
import { RouterView } from 'vue-router';
import Header from "@/component/common/Header/Header.vue";

</script>

<template>
  <header>
    <Header/>
  </header>
  <section class="flex-shrink-0">
    <div class="container">
      <RouterView/>
    </div>
  </section>
</template>

<style scoped>

</style>