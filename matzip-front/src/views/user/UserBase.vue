<script setup>
import { RouterView } from 'vue-router';
import Header from "@/component/common/Header/Header.vue";

</script>

<template>
  <header>
    <Header/>
  </header>
  <section>
    <RouterView/>
  </section>
</template>

<style scoped>

</style>