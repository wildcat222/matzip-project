<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router';
import ElementBox from "@/components/userprofile/ElementBox.vue";
import FollowerInfo from "@/components/userprofile/FollowerInfo.vue";

const followerInfo = ref(false);
const isVisibleFollowerInfo = () => {
  followerInfo.value = !followerInfo.value;
}

const route = useRoute();
const userInfo = ref(null);

// 유저 저 프로필 정보 조회 API 호출
// const fetchUserInfo = async () => {
//   try {
//     const response = await axios.get();
//     userInfo.value = response.data;
//   } catch (error) {
//     console.log('프로필 조회 중 에러가 발생했습니다.');
//   }
// }

</script>

<template>
  <!-- 사이드 메뉴 -->
  <div class="profile-container">
    <aside class="side-bar">
      <ElementBox id="profile-box" class="side-box">
        <section class="level">
          <span>포인트 : 430</span>
          <br>
          <span>다음 레벨까지 : 70</span>
        </section>

        <section class="user-nickname">
          <h3> (등급)Gugu</h3>
        </section>

        <section class="follow-button">
          <button>follow</button>
        </section>

        <section class="activity-info">
          <div>
            <div>
              <span>후기</span>
            </div>

            <div>
              <!--<span>{{ userInfo.value.listCount }}</span> -->
              <span>123</span>
              <span>개</span>
            </div>
          </div>

          <div>
            <div>
              <span>팔로잉</span>
            </div>

            <div>
              <div @click="isVisibleFollowerInfo" class="followerBtn">
                <!-- {{ userInfo.value.folloingCount }} -->
                <span>123</span>
              </div>
            </div>

          </div>
          <div>
            <div>
              <span>팔로워</span>
            </div>

            <div>
              <div @click="isVisibleFollowerInfo" class="followerBtn">
                123
                <!-- {{ userInfo.value.followerCount }} -->
              </div>
            </div>
          </div>

            <FollowerInfo v-if="followerInfo" id="followerInfoBox"/>


        </section>

        <section class="user-menu">
            <i class="fa-solid fa-ellipsis"></i>
        </section>
      </ElementBox>


      <br>
      <ElementBox id="cert-info-box" class="side-box">
        <h3>Gugu님의 인증 정보</h3>
        <br>
        <span>이메일 인증</span>
      </ElementBox>

    </aside>

    <!-- 회원 소개 및 리뷰 -->
    <section class="user-review">
      <div>
        <h2>Gugu 님의 프로필</h2>
      </div>

      <hr>

      <div>
        <span>Gugu</span>
        <span>님의 후기</span>
      </div>
      <br>
      <br>
      <br>

      <div>
        <article>
          <ElementBox>
            <span>리뷰 내용</span>
            <br>
            <div>
              <span>Gugu</span>
              <span>2024년 10월 24일</span>
              <i class="fa-solid fa-heart"></i>
              <span>10</span>
            </div>

          </ElementBox>
        </article>
      </div>

      <br>
      <hr>
    </section>



    <!-- 회원 리스트 -->
    <section class="user-list">

      <div>
        <span>Gugu</span>
        <span>님의 리스트</span>
      </div>

      <br>

      <article>
        <ElementBox class="list">
          <i class="fa-solid fa-ellipsis"></i>
          <br>
          <span>리스트 제목</span>
        </ElementBox>
      </article>
    </section>

  </div>
</template>

<style scoped>
.profile-container {
  margin-left: 30px;
  display: grid;
  grid-template-columns: 280px 1fr 1fr;
  grid-template-rows: 400px 400px;
  gap: 10px;
}

.side-bar {
  grid-area: 1/1/3/2;
}

.side-box {
  margin-left: 5px;
}

.user-review {
  grid-area: 1/2/2/4;
}

.user-list {
  grid-area: 2/2/3/4;
}

#profile-box {
  display: grid;
  grid-template-columns: 180px 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.level {
  grid-area: 1/1/2/2;
}

.user-nickname {
  grid-area: 2/1/3/2;
}

.follow-button {
  grid-area: 3/1/4/2;
}

.activity-info {
  grid-area: 1/2/4/3;
}

.user-menu {
  grid-area: 1/3/4/4;
}

.list {
  width: 170px;
  height: 170px;
}

.followerBtn {
  cursor: pointer;
}

#followerInfoBox {
  position: absolute;
  top: 110px;
  left: 320px;
  z-index: 10;
}

</style>