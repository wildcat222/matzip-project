<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";
import { useRoute } from 'vue-router';
import ElementBox from "@/components/userprofile/ElementBox.vue";
import FollowerInfo from "@/components/userprofile/FollowerInfo.vue";





// import {useAuthStore} from "@/components/stores/auth.js";
// const authStore = useAuthStore();
// ---------------------test 를 위한 로직---------------------------------

// 임시 토큰 저장
// authStore.login(token);

// 임시 userSeq
// ------------------------------------------------------
const currentRoute = useRoute();

const userSeq = ref(null);

const userInfo = ref(null);

const activityInfo = ref(null);
const activityPoint = ref(null);
const remainingPoint = ref(null);
const promotionPoint = ref([500, 300, 200, 150, 100, 50]);

const infoUserSeq = ref(null);

const activityLevelName = ref(null);
const userNickName = ref(null);

const reviewCount = ref(null);
const followingCount = ref(null);
const followerCount = ref(null);
const influencer = ref('N');

const followerInfo = ref(false);

// 유저 프로필 정보 조회 API 호출
const fetchUserInfo = async () => {
  try {
    userSeq.value = currentRoute.params;

    const ResUserInfo = await axios
        .get(`http://localhost:8000/user/api/v1/user/${userSeq}`,{
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
        });
    userInfo.value = ResUserInfo.data['data2'];

    // 1. 프로필 조회 대상 판단 (타인, 본인)
    infoUserSeq.value = userInfo.value['userSeq'];

    // 1. 등급 포인트 계산 o
    activityInfo.value = userInfo.value['activityInfo'];
    activityPoint.value = activityInfo.value['activityPoint'];
    function remainCalc() {
      for (let i = 0; i < promotionPoint.value.length; i++) {
        if (activityPoint.value >= promotionPoint.value[i]) {
          if (i - 1 < 0) {
            remainingPoint.value = 0;
            break;
          }
          remainingPoint.value = promotionPoint.value[i - 1] - activityPoint.value;
          break;
        }
      }
      remainingPoint.value = promotionPoint.value[promotionPoint.value.length - 1] - activityPoint.value;
    }
    remainCalc();

    // 4. 등급, 닉네임 o
    activityLevelName.value = activityInfo.value['activeLevelName'];
    userNickName.value = userInfo.value['userNickname'];

    // 3. 후기 및 팔로우,잉 count o
    reviewCount.value = userInfo.value['reviewCount'];
    followingCount.value = userInfo.value['followingCount'];
    followerCount.value = userInfo.value['followerCount'];

    // 4. 인플루언서 확인 뱃지 o
    influencer.value = activityInfo.value['influencerYn'];

    // 5. 내가 작성한 후기 목록(본인, 타인)


    // 6. 내가 작성한 리스트 서랍(본인, 타인)
  } catch (error) {
    // console.log('검색 중 오류 발생:', error);
    console.log('프로필 조회 중 에러가 발생했습니다.');
  }
}

// 5. 팔로우 등록/취소 버튼 클릭 시 (이벤트)
const followChange = async () => {
  try {
    const followingUserSeq = localStorage.getItem('accessToken'); // 토큰에서 userSeq 빼오도록 수정해야함
    const followedUserSeq = currentRoute.params;

    const ResFollow = await axios
        .post('http://localhost:8000/user/api/v1/follow', {
          "followingUserSeq": followingUserSeq, // 로그인 유저
          "followedUserSeq": followedUserSeq  // 타 유저
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

    if(ResFollow.data['code'] === 200) {

    }

  } catch (error) {
    console.log('서버와의 통신이 불안정합니다.'); // 수정 예정
  }

}

function isVisibleFollowerInfo() {
  followerInfo.value = !followerInfo.value;

}






onMounted (() => {
  fetchUserInfo()
});



// 마운트 전에 로그인 한 것인지 확인 -> BeforeMount / 맨 나중에

// 1. 프로필 조회
// 타인, 본인 회원 구분을 위한 본인인지 아닌지 확인 과정 필요 -> 화면 v-if로 구성

// 2. 후기 조회
// 유저가 작성한 후기 조회(본인, 타인) api -> OnMounted -> userSeq

// 3. 리스트 서랍 조회
// 유저가 작성한 리스트 목록 조회(본인 타인) api -> OnMounted -> userSeq
// 본인 리스트 서랍 조회 -> 토큰의 userSeq / 타인 리스트 서랍 조회
// -> 본인 (리스트 수정, 삭제 api) / 타인 (리스트 신고 api)

// 4. 팔로우 등록/취소 api -> 버튼 클릭 시(이벤트)

// 신고 생성 api



</script>

<template>
  <!-- 사이드 메뉴 -->
  <div class="profile-container">
    <aside class="side-bar">
      <ElementBox id="profile-box" class="side-box">

        <section class="level">
          <span>포인트 : {{ activityPoint }}</span>
          <br>
          <span>다음 레벨까지 : {{ remainingPoint }}</span>
        </section>

        <section class="user-nickname">
          <i>{{ activityLevelName }}</i><br>
          <h4> {{ userNickName }}</h4>
          <span>{{ influencer }}</span>
        </section>

        <section class="follow-button">
          <!-- followChange 이벤트 발생시킬 버튼 -->
          <button>follow</button>
        </section>

        <section class="activity-info">
          <div>
            <div>
              <span>후기</span>
            </div>

            <div>
              <!--<span>{{ userInfo.value.listCount }}</span> -->
              <span>{{ reviewCount }}</span>
              <span>개</span>
            </div>
          </div>

          <div>
            <div>
              <span>팔로잉</span>
            </div>

            <div>
              <div @click="isVisibleFollowerInfo" class="followerBtn">
                <span>{{ followingCount }}</span>
              </div>
            </div>

          </div>
          <div>
            <div>
              <span>팔로워</span>
            </div>

            <div>
              <div @click="isVisibleFollowerInfo" class="followerBtn">
                <span>{{ followerCount }}</span>
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