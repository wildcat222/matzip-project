<script setup>

</script>

<template>
  <div class="follower-info-container">
    <section id="follower" class="follow">
      <a href="">팔로워</a>
    </section>

    <section id="following" class="follow">
      <a href="">팔로잉</a>
    </section>

    <section id="follow-list">
      <ul>
        <li>(등급i)user01(인기뱃지)<i class="fa-solid fa-ellipsis"></i></li>
        <li>(등급i)user02(인기뱃지)<i class="fa-solid fa-ellipsis"></i></li>
        <li>(등급i)user03(인기뱃지)<i class="fa-solid fa-ellipsis"></i></li>
        <li>(등급i)user04(인기뱃지)<i class="fa-solid fa-ellipsis"></i></li>
        <li>(등급i)user05(인기뱃지)<i class="fa-solid fa-ellipsis"></i></li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.follower-info-container{
  width: 350px;
  height: 500px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 9fr;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 13px;
  box-shadow: 3px 3px 7px 2px rgba(0, 0, 0, 0.2);
}

.follower-info-container>section {
  border: black 1px solid;
}

.follow {
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}

#follow-list {
  grid-area: 2/1/3/3;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
}
</style>