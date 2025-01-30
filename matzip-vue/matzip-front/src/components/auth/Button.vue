<!-- Button.vue -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'custom', // 기본 스타일을 커스텀으로 설정
  },
  type: {
    type: String,
    default: 'button',
  },
  size: {
    type: String,
    default: 'medium', // 'small', 'medium', 'large'
  },
  color: {
    type: String,
    default: '#ff6f20',
  },
  width: {
    type: String,
    default: 'auto',
  },
  height: {
    type: String,
    default: '40px',
  },
});

const emit = defineEmits(['click']);
const handleClick = () => {
  emit('click');
};

// 버튼 클래스 설정
const buttonClass = computed(() => {
  const baseClass = `btn btn-${props.variant}`; // 부트스트랩의 기본 스타일 적용
  const sizeClass = {
    small: 'btn-sm',
    medium: '',
    large: 'btn-lg',
  }[props.size];

  // 'custom'일 경우, 부트스트랩 스타일 대신 사용자 정의 스타일 적용
  return props.variant === 'custom' ? 'btn-custom' : [baseClass, sizeClass].filter(Boolean).join(' ');
});
</script>

<template>
  <button
      :class="buttonClass"
      :type="type"
      :style="{
      backgroundColor: props.variant === 'custom' ? color : '',
      borderColor: props.variant === 'custom' ? color : '',
      width,
      height
    }"
      @click="handleClick"
  >
    {{ label }}
  </button>
</template>

<style scoped>
.btn-custom {
  background-color: #ff6f20; /* 버튼색 기본 주황색 */
  color: #ffffff; /* 텍스트 흰색 */
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem; /* 기본 여백 */
}

.btn-custom:hover {
  opacity: 0.9; /* 호버 시 살짝 어두워지는 효과 */
  background-color: #e65a00; /* 호버 시 색상 변화 */
}
</style>
