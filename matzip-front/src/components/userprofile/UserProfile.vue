<script setup>
import ElementBox from "@/components/userprofile/ElementBox.vue";
import FollowerInfo from "@/components/userprofile/FollowerInfo.vue";
import { defineProps } from 'vue';

c

</script>

<template>
  <ElementBox id="profile-box" class="side-box">

    <section class="level">
      <span>포인트 : {{ activityPoint }}</span>
      <br>
      <span>다음 레벨까지 : {{ remainingPoint }}</span>
    </section>

    <section class="user-nickname">
      <i>{{ activityLevelName }}</i><br>

      <h4> {{ userNickName }}</h4>

      <div v-if="isInfluencer" id="influencer-icon">
        <i class="fa-solid fa-heart-circle-check"/>
      </div>

    </section>

    <section class="follow-button">
      <!-- followChange 이벤트 발생시킬 버튼 -->
      <button @click="handleFollowChange">follow</button>
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