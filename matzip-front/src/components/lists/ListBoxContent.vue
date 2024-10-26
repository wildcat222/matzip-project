<template class="container">
  <div class="list-detail-matzip">
    <h4 class="nickname">
      <div class="nickname-text">
        {{ lists.length > 0 ? lists[0]?.userNickname : '등록된 리스트가 없습니다.' }}님의 리스트
      </div>
      <div class="back-button-container">
        <button class="back-button" @click="goBack"><</button>
      </div>
    </h4>

    <ul v-if="lists && lists.length > 0">
      <li v-for="(list, index) in lists" :key="index" class="list-item">
        <router-link :to="`/user/list/detail/${list.listSeq}`" class="list-title-link">
          <div class="list-title">{{ list.listTitle || '제목 없음' }}</div>
        </router-link>
        <p class="list-content">{{ list.listContent || '내용 없음' }}</p>
      </li>
    </ul>
    <p v-else></p>

    <!-- 리스트 만들기 버튼 -->
    <div v-if="isOwner">
      <button class="create-list-button" @click="showModal = true">리스트 만들기</button>
    </div>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>리스트 만들기</h3>
        <input v-model="newListTitle" id="listTitle" name="listTitle" placeholder="리스트 제목" class="modal-input" />
        <textarea v-model="newListContent" id="listContent" name="listContent" placeholder="리스트 내용" class="modal-textarea"></textarea>
        <button class="modal-submit" @click="createList">생성</button>
        <button class="modal-close" @click="closeModal">닫기</button>
      </div>
    </div>

    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios'; // axios import 추가

const props = defineProps({
  lists: {
    type: Array,
    default: () => []
  },
});

// 뒤로가기 함수
const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.go(-1);
};

const token = localStorage.getItem('accessToken');
const parsedToken = token ? JSON.parse(atob(token.split('.')[1])) : {};
const userSeqFromToken = parsedToken.sub;
const listUserSeqFromUrl = route.params.listUserSeq;

// 소유자 확인
const isOwner = computed(() => listUserSeqFromUrl === userSeqFromToken);
const showModal = ref(false);
const newListTitle = ref('');
const newListContent = ref('');
const successMessage = ref('');

const closeModal = () => {
  showModal.value = false;
  newListTitle.value = ''; // 폼 리셋
  newListContent.value = ''; // 폼 리셋
};

const createList = async () => {
  try {
    const response = await axios.post('https://matzipapi.huichan.kr/back/api/v1/list', {
      listTitle: newListTitle.value,
      listContent: newListContent.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      successMessage.value = '성공적으로 리스트가 생성되었습니다.';
    }
  } catch (error) {
    console.error('리스트 생성 중 오류:', error);
    successMessage.value = '리스트 생성 중 오류가 발생했습니다.';
  } finally {
    closeModal(); // 모달 닫기 및 폼 리셋
  }
};

</script>

<style scoped>
/* CSS 내용은 기존 코드 그대로 유지 */
.container {

}

.list-detail-matzip {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin: 16px;
  max-width: 600px;
  margin-left: 0;
  margin-right: auto;
}

.nickname {
  display: flex;
  justify-content: space-between;
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.nickname-text {
  padding: 25px 0 0 0;
  font-size: 32px;
  font-weight: bold;
}

.list-item {
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
}

.list-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.list-title-link {
  text-decoration: none;
  color: inherit;
}

.list-content {
  font-size: 1rem;
  color: #555;
}

.back-button-container {
  margin: 20px;
}

.back-button {
  background-color: #FF7315;
  color: white;
  font-weight: bold;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #e65c13;
}

.back-button:active {
  border: 2px solid #FF7315;
  color: black;
  background-color: white;
}

.create-list-button {
  background-color: #FF7315;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
}

.create-list-button:hover {
  background-color: #e65c13;
  transform: scale(1.05);
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  z-index: 1000; /* 모달의 z-index 추가 */
  position: relative; /* position relative 추가 */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}


.modal-input,
.modal-textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-textarea {
  min-height: 100px;
}

.modal-submit {
  background-color: #FF7315;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
}

.modal-close {
  background-color: #ccc;
  color: black;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
}
</style>
