<script setup>
import { RouterView } from 'vue-router';
import Header from "@/component/common/Header/Header.vue";

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

</style>
