<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";
import {useRoute} from 'vue-router';
// import { useAuthStore } from "@/components/stores/auth.js";
import ElementBox from "@/components/userprofile/ElementBox.vue";
import UserProfile from "@/components/userprofile/UserProfile.vue";




const userData = ref(null);
const currentRoute = useRoute();

onMounted(async () => {

  try {
    // 1. 회원 상세 정보 조회 api 호출
    const infoUserSeq = currentRoute.params.userSeq;
    // console.log(infoUserSeq); // 로그 확인 용
    const response = await axios.get(`http://localhost:8000/user/api/v1/user/${infoUserSeq}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    userData.value = await response.data.data2;
    // console.log(userData);  // 로그 확인 용




    // 5. 유저가 작성한 후기 조회(본인, 타인) api -> OnMounted -> userSeq

    // 6. 유저가 작성한 리스트 목록 조회(본인 타인) api -> OnMounted -> userSeq




  } catch (error) {
    console.log("에러 발생: " + error);
  }
});

// 5. 팔로우 등록/취소 버튼 클릭 시 (이벤트) -> 작동 확인 못함
const followActive = ref(false);
const followChange = async () => {
  try {
    const followingUserSeq = localStorage.getItem('userSeq');
    const followedUserSeq = currentRoute.params;

    const response = await axios
        .post('http://localhost:8000/user/api/v1/follow', {
          "followingUserSeq": followingUserSeq, // 로그인 유저
          "followedUserSeq": followedUserSeq  // 타 유저
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

    if(response.data.code === 200) {
      followActive.value = !followActive;
    }

  } catch (error) {
    console.log('서버와의 통신이 불안정합니다.' + error); // 수정 예정
  }
}



// 5. 내가 작성한 후기 목록(본인, 타인)

// 6. 내가 작성한 리스트 서랍(본인, 타인)


// 1. 프로필 조회
// 타인, 본인 회원 구분을 위한 본인인지 아닌지 확인 과정 필요 -> 화면 v-if로 구성

// 2. 팔로우 등록/취소 api -> 버튼 클릭 시(이벤트)

// 3. 후기 조회

// 4. 리스트 서랍 조회
// 본인 리스트 서랍 조회 -> 토큰의 userSeq / 타인 리스트 서랍 조회
// -> 본인 (리스트 수정, 삭제 api) / 타인 (리스트 신고 api)

// 신고 생성 api


</script>

<template>
  <!-- 사이드 메뉴 -->
  <div class="profile-container">
    <aside class="side-bar">
<!--      <div>{{userData}}</div>-->
      <UserProfile :userData="userData" @follow-click="followChange"/>

      <!--      <ElementBox id="profile-box" class="side-box">-->

      <!--        <section class="level">-->
      <!--          <span>포인트 : {{ activityPoint }}</span>-->
      <!--          <br>-->
      <!--          <span>다음 레벨까지 : {{ remainingPoint }}</span>-->
      <!--        </section>-->

      <!--        <section class="user-nickname">-->
      <!--          <i>{{ activityLevelName }}</i><br>-->

      <!--          <h4> {{ userNickName }}</h4>-->

      <!--          <div v-if="isInfluencer" id="influencer-icon">-->
      <!--            <i class="fa-solid fa-heart-circle-check"/>-->
      <!--          </div>-->

      <!--        </section>-->

      <!--        <section class="follow-button">-->
      <!--          &lt;!&ndash; followChange 이벤트 발생시킬 버튼 &ndash;&gt;-->
      <!--          <button @click="handleFollowChange">follow</button>-->
      <!--        </section>-->

      <!--        <section class="activity-info">-->
      <!--          <div>-->
      <!--            <div>-->
      <!--              <span>후기</span>-->
      <!--            </div>-->

      <!--            <div>-->
      <!--              &lt;!&ndash;<span>{{ userInfo.value.listCount }}</span> &ndash;&gt;-->
      <!--              <span>{{ reviewCount }}</span>-->
      <!--              <span>개</span>-->
      <!--            </div>-->
      <!--          </div>-->

      <!--          <div>-->
      <!--            <div>-->
      <!--              <span>팔로잉</span>-->
      <!--            </div>-->

      <!--            <div>-->
      <!--              <div @click="isVisibleFollowerInfo" class="followerBtn">-->
      <!--                <span>{{ followingCount }}</span>-->
      <!--              </div>-->
      <!--            </div>-->

      <!--          </div>-->
      <!--          <div>-->
      <!--            <div>-->
      <!--              <span>팔로워</span>-->
      <!--            </div>-->

      <!--            <div>-->
      <!--              <div @click="isVisibleFollowerInfo" class="followerBtn">-->
      <!--                <span>{{ followerCount }}</span>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->

      <!--            <FollowerInfo v-if="followerInfo" id="followerInfoBox"/>-->


      <!--        </section>-->

      <!--        <section class="user-menu">-->
      <!--            <i class="fa-solid fa-ellipsis"></i>-->
      <!--        </section>-->
      <!--      </ElementBox>-->


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
  margin-top: 30px;
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