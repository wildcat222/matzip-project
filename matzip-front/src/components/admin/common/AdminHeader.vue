<script setup>

</script>

<template>
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col-auto row align-items-center">
          <img class="col-auto" src="../../../assets/matzip-logo.png" alt="Logo" style="width: 120px; height: 100px" />
          <h1 class="h4  col-auto" style="font-size: 30px">MatZip</h1>
        </div>
        <h1 class="h4 col-auto me-2" style="font-size: 35px">관리자 페이지</h1>
        <img class="fixed-icon" src="../../../assets/person.png" alt="회원" style="width: 50px; height: 50px"/>
      </div>
    </div>

    <nav class="navbar navbar-light bg-light p-0">

    </nav>
</template>


<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.fixed-icon {
  position: fixed; /* 고정 위치 */
  top: 20px; /* 상단에서의 거리 */
  right: 20px; /* 오른쪽에서의 거리 */
  padding: 10px; /* 패딩 */
  border-radius: 5px; /* 모서리 둥글게 */
  color: blue; /* 아이콘 색상 */
}
</style>