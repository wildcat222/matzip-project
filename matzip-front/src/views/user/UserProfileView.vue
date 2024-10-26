<script setup>
import {ref, onMounted} from "vue";
import axios from "axios";
import {useRoute} from 'vue-router';
// import { useAuthStore } from "@/components/stores/auth.js";
import ElementBox from "@/components/userprofile/ElementBox.vue";
import UserProfile from "@/components/userprofile/UserProfile.vue";
import UserList from "@/components/userprofile/UserList.vue";




const userData = ref(null);
const currentRoute = useRoute();

onMounted(async () => {

  try {
    const infoUserSeq = currentRoute.params.userSeq;
    // 1. 회원 상세 정보 조회 api 호출
    // console.log(infoUserSeq); // 로그 확인 용
    const resUserInfo = await axios.get(`http://localhost:8000/user/api/v1/user/${infoUserSeq}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    userData.value = await resUserInfo.data.data2;
    // console.log(userData);  // 로그 확인 용


    // 2. 유저가 작성한 후기 조회(본인, 타인) api -> OnMounted -> userSeq
    // 기능이 없음.


    // 3. 특정 유저가 작성한 리스트 목록 조회 api -> null 값 반환..?
    const listBoxItems = ref(null);
    const resListItems = await axios.get(`http://localhost:8000/back/api/v1/listbox/${infoUserSeq}`, {
      "page": 1,
      "size": 10
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    listBoxItems.value = resListItems.data.data;
    // console.log(listBoxItems); // 로그 확인 용

    if (listBoxItems.value === null) {
      console.log('리스트가 존재하지 않습니다.');
    }

  } catch (error) {
    console.log("데이터 로드 실패 : " + error);
  }
});

// 4. 팔로우 등록/취소 버튼 클릭 시 (이벤트) -> 작동 확인 못함
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

// 리스트 신고 생성 api


</script>

<template>
  <!-- 사이드 메뉴 -->
  <div class="profile-container">
    <aside class="side-bar">
      <UserProfile :userData="userData" @follow-click="followChange"/>

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
      <UserList :listBoxItems="listBoxItems"/>
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

</style>