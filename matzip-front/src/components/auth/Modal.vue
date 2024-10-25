<script setup>
const emit = defineEmits(['close']);

function close() {
  console.log('모달 닫기 실행');
  emit('close');
}
</script>

<template>
  <div class="modal" @click.self="close">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.modal {
  z-index: 9999; /* 모달의 z-index 값을 높게 설정 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 90%;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}
</style>
