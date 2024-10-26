<script setup>

</script>

<template>
  <div id="ListMenu" class="ListMenu">
    <ul>
      <li>
        <a href="#">전체 리스트</a>
      </li>
      <li>
        <a href="#">나의 리스트</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.ListMenu {
  top: 45px; /* 위치 지정 */
  background-color: rgba(255, 255, 255, 1);
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 1);
  position: absolute; /* 부모 요소에 대해 절대 위치로 설정 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 13px;
}

a {
  text-decoration: none; /* 링크 밑줄 제거 */
  font-size: 20px;
}

ul {
  padding: 0px;
}

li {
  display: flex;
  list-style-type: none; /* 기본 리스트 스타일 제거 */
}
</style>