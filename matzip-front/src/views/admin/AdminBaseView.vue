<script setup>

import AdminHeader from "@/components/admin/common/AdminHeader.vue";
import AdminCommonNav from "@/components/admin/common/AdminCommonNav.vue";
</script>

<template>
  <header>
    <AdminHeader/>
  </header>
  <div class="row">
      <AdminCommonNav/>
      <RouterView/>
  </div>

</template>

<style scoped>


</style>