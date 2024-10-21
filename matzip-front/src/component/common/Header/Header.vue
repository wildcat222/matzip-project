<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import PostMenu from "@/component/common/Header/element/PostMenu.vue";
import ListMenu from "@/component/common/Header/element/ListMenu.vue";
import UserMenu from "@/component/common/Header/element/UserMenu.vue";

const activeMenu = ref(null);

function toggleMenu(component) {
  activeMenu.value = activeMenu.value === component ? null : component;
}

function handleClickOutside(event) {
  const dropdowns = document.querySelectorAll('.dropdown');
  const activeMenu = document.querySelector('.dropdown.active');
  const isClickInsideDropdown = Array.from(dropdowns).some(dropdown =>
      dropdown.contains(event.target)
  );

  if (!isClickInsideDropdown) {
    activeMenu.value = null; // 드롭다운 외부 클릭 시 숨김
  }
}

function handleMenuItemClick() {
  activeMenu.value = null; // 메뉴 항목 클릭 시 드롭다운 숨김
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside); // 외부 클릭 리스너 추가
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside); // 컴포넌트 언마운트 시 리스너 제거
});

</script>

<template>
  <nav id="matzip-header" class="navbar">
    <!-- 아이콘 및 WebName -->
    <div id="web-main">
      <img id="matzip-logo" src="@/asserts/matzip-img.png"/>
      <a id="navbar-web-name" href="http://localhost:5173/">
        MatZip
      </a>
    </div>


    <div id="menu-catalog">
      <!-- 메뉴 리스트 -->
      <!-- <ul id="menu" class="menu-items">
        <li id="mune-post" @click="toggleMenu('post')">
          Post
          <PostMenu v-if="activeMenu === 'post'" class="dropdown post-menu" @click="handleMenuItemClick"/>
        </li>
        <li id="menu-list" @click="toggleMenu('list')">
          <span>List</span>
          <ListMenu v-if="activeMenu === 'list'" class="dropdown list-menu" @click="handleMenuItemClick"/>
        </li>
        <li id="menu-place">
          <a href="#">Place</a></li>
      </ul> -->

      <ul id="menu" class="menu-items">

        <li class="menu-item">
          <b-dropdown id="dropdown-menu" variant="light" offset="25" text="Post" class="m-2" no-caret="">
            <b-dropdown-item>
              <a href="">1번 게시판</a>
            </b-dropdown-item>
            <b-dropdown-item>
              <a href="">2번 게시판</a>
            </b-dropdown-item>
            <b-dropdown-item>
              <a href="">3번 게시판</a>
            </b-dropdown-item>
          </b-dropdown>
        </li>

        <li class="menu-item">
          <b-dropdown id="dropdown-menu" variant="light" offset="25" text="List" class="m-2" no-caret="">
            <b-dropdown-item>
              <a href="">전체 리스트</a>
            </b-dropdown-item>
            <b-dropdown-item>
              <a href="">나의 리스트</a>
            </b-dropdown-item>
          </b-dropdown>
        </li>

        <li class="menu-item">
          <b-dropdown id="dropdown-menu" variant="light" offset="25" text="Place" class="m-2" no-caret="">
            <b-dropdown-item>
              <a href="">프로필</a>
            </b-dropdown-item>
            <b-dropdown-item>
              <a href="">마이페이지</a>
            </b-dropdown-item>
          </b-dropdown>
        </li>

      </ul>


    </div>


    <!-- 인기 태그 노출 -->
    <div id="best-tag">1. 인기 태그</div>

    <!-- UserIcom -->
    <!-- <div>
      <i id="menu-user" class="fa-regular fa-user fa-xl" style="color: #ff6f20;" @click="toggleMenu('user')">
        <UserMenu v-if="activeMenu === 'user'" class="dropdown user-menu" @click="handleMenuItemClick"/>
      </i>
    </div> -->

    <b-dropdown text="" variant="link" no-caret="">
      <template>
        <b-icon icon="person"></b-icon>
      </template>
      <b-dropdown-item>액션 1</b-dropdown-item>
      <b-dropdown-item>액션 2</b-dropdown-item>
    </b-dropdown>

  </nav>
</template>

<style scoped>

a {
  text-decoration: none;
  color: black;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  border-bottom: 2px solid #ff6f20;
  background-color: #f8f9fa;   /* 배경색 (선택) */
}

#web-main {
  display: flex;
  align-items: center;
  justify-content: center;
}

#matzip-logo {
  width: 50px;
  height: 50px;
}

#navbar-web-name {
  font-size: 25px;
  font-weight: bold;
  color: #ff6f20;
}


#menu-catalog {
  margin-left: 30px;
}

.menu-items {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  align-items: center;
}

.menu-items > li {
  font-size: 20px;
  cursor: pointer;

}

#best-tag {
  display: flex;
  margin-left: auto;
  color: grey;
}

#menu-user {
  margin-left: 70px;
  margin-right: 20px;
  cursor: pointer;
}

#dropdown-menu {
  color: #ff6f20;
}

.button-content:hover {
  color: #ff6f20;
}



</style>