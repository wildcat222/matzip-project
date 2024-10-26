<template class="container">
  <div class="list-detail-matzip">
    <h4 class="nickname">
      <div class="nickname-text">
        {{ lists.length > 0 ? lists[0]?.userNickname + '님의 리스트' : '등록된 리스트가 없습니다.' }}
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
      <!-- 소유자가 아닐 경우 리스트 만들기 버튼을 보여주지 않음 -->
      <!-- 모달 열기 버튼 -->
      <div v-if="isOwner">
        <button class="create-list-button" @click="showModal = true">리스트 만들기</button>
      </div>
    </ul>
    <p v-else></p>


    <!-- 리스트 만들기 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">리스트 만들기</h3>
        </div>
        <div class="modal-body">
          <input v-model="newListTitle" id="listTitle" name="listTitle" placeholder="리스트 제목" class="modal-input" />
          <textarea v-model="newListContent" id="listContent" name="listContent" placeholder="리스트 내용" class="modal-textarea"></textarea>
        </div>
        <div class="modal-footer">
          <button class="modal-submit" @click="createList">생성</button>
          <button class="modal-close" @click="closeModal">닫기</button>
        </div>
      </div>
    </div>

    <!-- 성공 메시지 팝업 -->
    <div v-if="successMessageVisible" class="popup-overlay">
      <div class="popup">
        <p>{{ successMessage }}</p>
        <button class="popup-close" @click="successMessageVisible = false">닫기</button>
      </div>
    </div>

    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

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
const successMessageVisible = ref(false);

// 모달 닫기 및 폼 리셋
const closeModal = () => {
  showModal.value = false;
  newListTitle.value = '';
  newListContent.value = '';
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
      successMessageVisible.value = true; // 팝업 창 보이도록 설정
    }
  } catch (error) {
    console.error('리스트 생성 중 오류:', error);
    successMessage.value = '리스트 생성 중 오류가 발생했습니다.';
  } finally {
    closeModal();
  }
};
</script>

<style scoped>
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
  display: block; /* 모달이 항상 보이도록 설정 */
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  height: 420px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.modal-overlay {
  display: block; /* 오버레이도 항상 보이도록 설정 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal-title {
  font-weight: bold; /* 모달 헤더 글씨 볼드 처리 */
}

.modal-body {
  display: flex;
  flex-direction: column;
}

.modal-input {
  width: 100%; /* 인풋 가로 맞추기 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

.modal-textarea {
  width: 100%; /* 텍스트 에어리어 가로 맞추기 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  height: 120px; /* 리스트 내용 입력창 높이 조정 */
}

.modal-footer {
  display: flex;
  justify-content: space-between;
}

.modal-submit {
  background-color: #FF7315; /* 생성 버튼 배경색 */
  color: white; /* 생성 버튼 글씨 색 */
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-close {
  background-color: white; /* 닫기 버튼 배경색 */
  color: #FF7315; /* 닫기 버튼 글씨 색 */
  padding: 10px 15px;
  border: 2px solid #FF7315; /* 닫기 버튼 보더 색 */
  border-radius: 5px;
  cursor: pointer;
}

/* 팝업 스타일 */
.popup-overlay {
  display: block; /* 팝업 오버레이 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
}

.popup-close {
  background-color: #FF7315; /* 팝업 닫기 버튼 배경색 */
  color: white; /* 팝업 닫기 버튼 글씨 색 */
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
