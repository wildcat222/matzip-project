<script setup>
import Header from "@/component/common/Header/Header.vue";
import { RouterView } from 'vue-router';

</script>

<template>
  <header>
    <Header/>
  </header>
  <main>
    <RouterView/>
  </main>
  <footer>
  <hr>
  <h2>footer</h2>
</footer>

</template>

<style scoped>
#app {
  text-align: center;
}
</style>
