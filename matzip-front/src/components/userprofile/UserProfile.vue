<script setup>
import ElementBox from "@/components/userprofile/ElementBox.vue";
import FollowerInfo from "@/components/userprofile/FollowerInfo.vue";
import {computed, ref} from 'vue';
import {defineProps} from 'vue';
import {useAuthStore} from "@/components/stores/auth.js";
import followerInfo from "@/components/userprofile/FollowerInfo.vue";

const authStore = useAuthStore();

// view 로 부터 정보 받아옴
const userInfo = defineProps({
  userData: {
    type: Object,
    required: true,
  },
});

// 1. 프로필 조회 대상 판단 (본인, 타인)

// Props 로 전달받은 데이터에서 속성 값 추출
const infoUserSeq = computed(() => {
  return userInfo.userData ? userInfo.userData.userSeq : null;
});

// true 일 경우 본인 프로필
const isMyProfile = ref(false);
// 현재 authStore 가 계속 null?
if (authStore.userSeq === infoUserSeq.value) {
  isMyProfile.value = !isMyProfile.value;
}

// 회원 닉네임
const userNickName = computed(() => {
  return userInfo.userData ? userInfo.userData.userNickname : null;
});

// 데이터 확인용 코드
const activityInfo = computed(() => {
  return userInfo.userData ? userInfo.userData.activityInfo : null;
});

// 활동 포인트
const activityPoint = computed(() => {
  return userInfo.userData ? userInfo.userData.activityInfo.activityPoint : null;
});

// 등급 포인트 계산
const promotionPoint = ref([500, 300, 200, 150, 100, 50]);
const remainingPoint = ref(null);

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
remainCalc()

// 등급 이름
const activeLevelName = computed(() => {
  return userInfo.userData ? userInfo.userData.activityInfo.activeLevelName : null;
});

// 인기 회원 확인
const influencerYn = computed(() => {
  return userInfo.userData ? userInfo.userData.activityInfo.influencerYn : null;
});

const isInfluencer = ref(false);
if (influencerYn.value === 'Y') {
  isInfluencer.value = !isInfluencer;
}

// 리뷰, 팔로잉, 팔로워 Count
const reviewCount =  computed(() => {
  return userInfo.userData ? userInfo.userData.reviewCount : null;
});

const followingCount =  computed(() => {
  return userInfo.userData ? userInfo.userData.followingCount : null;
});

const followerCount =  computed(() => {
  return userInfo.userData ? userInfo.userData.followerCount : null;
});

// 팔로우 버튼 클릭 시 이벤트 발생 -> 부모 컴포넌트로 이벤트 전달
const emit = defineEmits();

const followClick = () => {
  emit('follow-click'); // 부모에게 이벤트 전달
};

// 팔로잉, 팔로워 목록 호출하는 기능 -> 팔로워 팔로잉 목록 조회 api
const loadFollow = ref(null);
function toggleFollowerInfo(leadFollow) {
  if (loadFollow.value === 'follower') {

  } else if (leadFollow.value === 'following') {

  }

}



</script>


<template>

  <div>{{  }}</div>
  <ElementBox id="profile-box" class="side-box">

    <section class="level">
      <span>포인트 : {{ activityPoint }}</span>
      <br>
      <span>다음 레벨까지 : {{ remainingPoint }}</span>
    </section>

    <section class="user-nickname">
      <i>{{ activeLevelName }}</i><br>

      <div>{{ userNickName }}</div>

      <!-- 아이콘 미정 -->
      <div v-if="!isInfluencer" id="influencer-icon">
        <i class="fa-solid fa-heart-circle-check"/>
      </div>

    </section>

    <section class="follow-button">
      <!-- followChange 이벤트 발생시킬 버튼 -->
      <button v-if="!isMyProfile" @click="followClick">follow</button>
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
      <i v-if="isMyProfile" class="fa-solid fa-ellipsis"></i>
    </section>
  </ElementBox>
</template>

<style scoped>
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

.user-nickname >>> {
  display: flex;
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
</style>