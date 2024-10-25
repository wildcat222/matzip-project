<script setup>

</script>

<template>
  <div class="element-container">
    <slot></slot>
  </div>
</template>

<style scoped>
.element-container{
  width: 270px;
  height: 190px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 13px;
  box-shadow: 3px 3px 7px 2px rgba(0, 0, 0, 0.2);
}

</style>