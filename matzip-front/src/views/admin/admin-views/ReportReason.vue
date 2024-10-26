<template>
  <div class="col p-0 m-0">
    <div class="bg-primary-subtle ps-4">
      <span>사용자 관리 > 신고 조회</span>
    </div>
    <div class="p-3">
      <h1>신고 사유 목록</h1>
      <button @click="addReportReason">사유 추가</button>
      <table>
        <thead>
        <tr>
          <th>순서</th>
          <th>신고사유</th>
          <th>순서변경</th>
          <th>수정</th>
          <th>삭제</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(reportReason, index) in reportReasons" :key="reportReason.reasonSeq">
          <td>{{ reportReason.reasonOrder }}</td>
          <td>
            <span v-if="!reportReason.isEditing">{{ reportReason.reasonName }}</span>
            <input v-else v-model="reportReason.newReasonName" />
          </td>
          <td>
            <button @click="changeOrder(reportReason, 'up')">▲</button>
            <button @click="changeOrder(reportReason, 'down')">▼</button>
          </td>
          <td>
            <button @click="toggleEdit(reportReason)">{{ reportReason.isEditing ? '완료' : '수정' }}</button>
          </td>
          <td>
            <button @click="deleteReportReason(reportReason)">삭제</button>
          </td>
        </tr>
        <tr v-if="newReportReason.isVisible">
          <td></td>
          <td>{{ nextOrder }}</td>
          <td><input v-model="newReportReason.name" /></td>
          <td></td>
          <td>
            <button @click="saveNewReportReason">완료</button>
          </td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const reportReasons = ref([]);
const selectAll = ref(false);
const newReportReason = ref({ isVisible: false, name: '' });
const nextOrder = ref(1); // 다음 순서 번호

// 컴포넌트가 mounted될 때 데이터 불러오기
onMounted(async () => {
  await fetchReportReasons();
});

// API 호출 함수
const fetchReportReasons = async () => {
  try {
    const response = await axios.get('https://matzipapi.huichan.kr/back/api/v1/report/reason', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    reportReasons.value = response.data.map(reason => ({
      ...reason,
      isEditing: false,
      newReasonName: reason.reasonName // 새로운 이름을 저장할 필드 추가
    }));
    updateNextOrder(); // 다음 순서 업데이트
  } catch (error) {
    console.error('신고 사유 목록을 불러오는 중 오류 발생:', error);
  }
};

const updateNextOrder = () => {
  nextOrder.value = reportReasons.value.length > 0 ? Math.max(...reportReasons.value.map(r => r.reasonOrder)) + 1 : 1; // 다음 순서 업데이트
};

const toggleSelectAll = () => {
  reportReasons.value.forEach(reason => {
    reason.selected = selectAll.value;
  });
};

const addReportReason = () => {
  newReportReason.value = { isVisible: true, name: '' }; // 입력 필드 보이기
};

const changeOrder = async (reason, direction) => {
  const index = reportReasons.value.indexOf(reason);

  if (direction === 'up' && index > 0) {
    const temp = reportReasons.value[index - 1];
    reportReasons.value[index - 1] = reason;
    reportReasons.value[index] = temp;

    // 순서 업데이트
    reason.reasonOrder -= 1; // 현재 항목의 순서 업데이트
    temp.reasonOrder += 1; // 위로 이동한 항목의 순서 업데이트
  } else if (direction === 'down' && index < reportReasons.value.length - 1) {
    const temp = reportReasons.value[index + 1];
    reportReasons.value[index + 1] = reason;
    reportReasons.value[index] = temp;

    // 순서 업데이트
    reason.reasonOrder += 1; // 현재 항목의 순서 업데이트
    temp.reasonOrder -= 1; // 아래로 이동한 항목의 순서 업데이트
  }

  // 순서 변경 시 서버에 PUT 요청
  try {
    await axios.put(`https://matzipapi.huichan.kr/back/api/v1/report/reason/${reason.reasonSeq}/order`, {
      reasonOrder: reason.reasonOrder // 새로운 순서를 요청 본문에 담아 전송
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    console.log('순서가 변경되었습니다:', reason.reasonOrder);
  } catch (error) {
    console.error('순서 변경 중 오류 발생:', error);
  }
};

const toggleEdit = async (reason) => {
  if (reason.isEditing) {
    try {
      const response = await axios.put(`https://matzipapi.huichan.kr/back/api/v1/report/reason/${reason.reasonSeq}/name`, {
        reasonName: reason.newReasonName // 수정할 이름을 요청 본문에 담아 전송
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
        }
      });

      console.log('수정된 신고 사유:', response.data);
      reason.reasonName = reason.newReasonName; // 기존 이름 업데이트
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
    }
  }
  reason.isEditing = !reason.isEditing; // 수정 모드 토글
};

const deleteReportReason = async (reason) => {
  const index = reportReasons.value.indexOf(reason);
  try {
    await axios.delete(`https://matzipapi.huichan.kr/back/api/v1/report/reason/${reason.reasonSeq}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
      }
    });
    reportReasons.value.splice(index, 1); // 클라이언트에서 삭제
    console.log('신고 사유가 삭제되었습니다.');
    updateNextOrder(); // 다음 순서 업데이트
  } catch (error) {
    console.error('삭제 중 오류 발생:', error);
  }
};

const deleteSelected = async () => {
  const selectedReasons = reportReasons.value.filter(reason => reason.selected);
  for (const reason of selectedReasons) {
    await deleteReportReason(reason); // 각 선택된 신고 사유 삭제
  }
};

const saveNewReportReason = async () => {
  try {
    const response = await axios.post('https://matzipapi.huichan.kr/back/api/v1/report/reason', {
      reasonName: newReportReason.value.name,
      reasonOrder: nextOrder.value // 새로운 순서 설정
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}` // 인증 헤더 추가
      }
    });

    // 새로운 신고 사유를 reportReasons에 추가
    const newReason = {
      ...response.data,
      isEditing: false,
      newReasonName: response.data.reasonName // 새로운 이름 저장
    };

    reportReasons.value.push(newReason); // UI에 추가
    newReportReason.value.isVisible = false; // 입력 필드 숨기기
    updateNextOrder(); // 다음 순서 업데이트
    console.log('신고 사유가 추가되었습니다.');
  } catch (error) {
    console.error('신고 사유 추가 중 오류 발생:', error);
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}
</style>
