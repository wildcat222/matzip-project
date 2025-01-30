<script setup>

import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';

// 현재 수정 중인 항목의 seq 값
const editingSeq = ref(null);

// 수정 중인 항목의 폼 데이터
const editForm = ref({
  activeLevelName: '',
  activeLevelStandard: '',
});

// 수정 버튼 클릭 시 실행되는 함수
const editLevel = (activeLevel) => {
  editingSeq.value = activeLevel.activeLevelSeq;
  editForm.value = { ...activeLevel }; // 선택한 항목의 데이터를 폼에 복사
};

// 수정된 데이터를 저장하는 함수
const saveEdit = (seq) => {
  const index = tableData.value.findIndex((item) => item.activeLevelSeq === seq);
  if (index !== -1) {
    tableData.value[index] = { ...editForm.value, activeLevelSeq: seq }; // 수정된 데이터 저장
  }
  editingSeq.value = null; // 수정 상태 해제
};

// 수정 취소
const cancelEdit = () => {
  editingSeq.value = null;
};

// props 정의
const props = defineProps({
  tableData: {
    type: Array,
    required: true,
    default: () => []
  }
});

// emit 정의 (부모 컴포넌트로 이벤트 전달)
const emit = defineEmits(['edit']);



</script>

<template>
  <table class="table table-bordered custom-table">
    <thead>
    <tr>
      <th>활동 레벨</th>
      <th>포인트 기준</th>
      <th>관리</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="activeLevel in tableData" :key="activeLevel.activeLevelSeq">
      <td>
        <!-- 수정 상태에 따라 텍스트 또는 입력 폼 표시 -->
        <span v-if="editingSeq !== activeLevel.activeLevelSeq">{{ activeLevel.activeLevelName }}</span>
        <input v-else v-model="editForm.activeLevelName" />
      </td>
      <td>
        <span v-if="editingSeq !== activeLevel.activeLevelSeq">{{ activeLevel.activeLevelStandard }}</span>
        <input v-else v-model="editForm.activeLevelStandard" />
      </td>
      <td>
        <button class="btn btn-link" v-if="editingSeq !== activeLevel.activeLevelSeq" @click="editLevel(activeLevel)">
          정보 수정
        </button>
        <button class="btn btn-link" v-else @click="saveEdit(activeLevel.activeLevelSeq)">저장</button>
        <button class="btn btn-link" v-if="editingSeq === activeLevel.activeLevelSeq" @click="cancelEdit">취소</button>
      </td>
    </tr>
    </tbody>
  </table>
</template>



<style scoped>

</style>