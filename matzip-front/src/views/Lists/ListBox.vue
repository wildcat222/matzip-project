<template>
  <div>
    <ListBoxContent :lists="lists" />
    <p v-if="lists.length === 0"></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ListBoxContent from '@/components/lists/ListBoxContent.vue';
import axios from 'axios';

const route = useRoute();
const currentUserSeq = ref(null);
const listUserSeq = ref(null);
const isCurrentUser = ref(false);
const lists = ref([]);

// 페이지 로드 시 localStorage에서 토큰을 읽어와 사용자 정보를 초기화
onMounted(() => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT 토큰의 페이로드 추출
    currentUserSeq.value = payload.sub; // 사용자 ID 저장
  }

  listUserSeq.value = route.params.listUserSeq;


  if (!listUserSeq.value || isNaN(listUserSeq.value)) {
    console.error('Invalid listUserSeq');
    return;
  }

  isCurrentUser.value = (listUserSeq.value.toString() === currentUserSeq.value.toString());

  if (isCurrentUser.value) {
    fetchMyList(1, 10);
  } else {
    fetchOtherList(listUserSeq.value, 1, 10);
  }
});

const fetchMyList = async (page, size) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/listUserSeq`, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 Authorization 추가
      },
      params: {
        page,
        size
      }
    });

    if (response.data && response.data.data2) {
      // 여러 리스트 항목을 가져오기
      lists.value = response.data.data2.listSearchUserDTOs.flatMap(dto =>
          dto.listBoxList.map(item => ({
            userNickname: dto.userNickname,
            listSeq: dto.listSeq || '', // listSeq 추가
            listTitle: item.listTitle || '',
            listContent: item.listContent || '',
            listLevel: item.listLevel || 0
          }))

      );
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching my list:', error.message);
    lists.value = [];
  }
};

const fetchOtherList = async (listUserSeq, page, size) => {
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/listbox/${listUserSeq}`, {
      params: {
        listUserSeq,
        page,
        size
      }
    });

    if (response.data && response.data.data2) {
      // 여러 리스트 항목을 가져오기
      lists.value = response.data.data2.listSearchUserDTOs.flatMap(dto =>
          dto.listBoxList.map(item => ({
            userNickname: dto.userNickname,
            listSeq: dto.listSeq || '',  // 여기에 listSeq가 포함되어야 함
            listTitle: item.listTitle || '',
            listContent: item.listContent || ''
          }))
      );
    } else {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching other list:', error.message);
    lists.value = [];
  }
};


</script>

<style scoped>
/* 스타일 생략 */
</style>
