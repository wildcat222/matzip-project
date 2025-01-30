<script setup>
import LogoImage from '@/assets/matzip-logo.png';

const props = defineProps({
  size: {
    type: String,
    default: '50px', // 기본 크기 설정
  },
  color: {
    type: String,
    default: '#ff6f20', // 기본 색상
  }
});

// 이미지와 텍스트 크기를 비례적으로 설정
const logoStyle = {
  width: props.size,
  height: props.size,
};

const textStyle = {
  fontSize: `calc(${props.size} * 0.5)`, // 이미지 크기의 절반 크기로 폰트 설정
  color: props.color, // 전달받은 색상 사용
};
</script>

<template>
  <div id="web-main">
    <a id="navbar-web-name" href="http://localhost:5173/" :style="textStyle">
      <img
          id="matzip-logo"
          :src="LogoImage"
          :style="logoStyle"
          alt="Logo"
      />
      MatZip
    </a>
  </div>
</template>

<style scoped>
#web-main {
  display: flex;
  align-items: center;
  gap: 10px; /* 이미지와 텍스트 사이의 간격 */
}

#navbar-web-name {
  font-weight: bold;
  text-decoration: none; /* 밑줄 제거 */
}
</style>
