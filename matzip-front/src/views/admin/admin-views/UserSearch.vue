<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import SelectComponent from '../../../components/admin/admin-views/user-search/SelectComponent.vue';


const orderBy = ref('');
const selectedOption = ref('');
const influencerYn = ref('');
const searchWord = ref('');

const orderByOptions = [
  {value: 'regDateDesc', text: '가입일 최신순'},
  {value: 'regDateAsc', text: '가입일 오래된순'},
  {value: 'gradeDesc', text: '등급 포인트 높은 순'},
  {value: 'gradeAsc', text: '등급 포인트 낮은 순'},
  {value: 'nicknameDesc', text: '닉네임 내림차순'},
  {value: 'nicknameAsc', text: '닉네임 오름차순'}
]

const searchOptions = [
  {value: 'nickname', text: '닉네임'},
  {value: 'email', text: '이메일'},
];

const influencerOptions = [
  {value: 'Y', text: '인기회원'},
  {value: 'N', text: '일반'}
];

// const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI0IiwiYXV0aCI6WyJ1c2VyIl0sImV4cCI6MTcyOTcxMjkzM30._iSX40z6dq2hya_nGnVFp03sjQPuk_Gf8ALVFgn_w2S2sjbpqXM3US3tBlpy5gZ4ZCsWBrr7dgsni2Q8l2SjuA';
// authStore.login(token);

const search = async () => {
  const searchParams = {
    searchType: selectedOption.value,
    influencerYn: influencerYn.value,
    searchWord: searchWord.value,
    orderBy: orderBy.value
  };

  let endPoint = '';

  if (searchParams.searchType !== '') {
    endPoint += `?searchType=${searchParams.searchType}`;
  }

  if (searchParams.influencerYn !== '') {
    if (endPoint.length > 0) endPoint += '&';
    else {
      endPoint += '?';
    }
    endPoint += `influencerYn=${searchParams.influencerYn}`;
  }

  if (searchParams.searchWord !== '') {
    if (endPoint.length > 0) endPoint += '&';
    else {
      endPoint += '?';
    }
    endPoint += `searchWord=${searchParams.searchWord}`;
  }

  if (searchParams.orderBy !== '') {
    if (endPoint.length > 0) endPoint += '&';
    else {
      endPoint += '?';
    }
    endPoint += `orderBy=${searchParams.orderBy}`;
  }


  try {
    const response = await axios.get(`http://localhost:8000/user/api/v1/users${endPoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
    );
    console.log('검색 결과:', response.data);
    console.log(endPoint);
    console.log(localStorage.getItem('accessToken'));

    // 검색 결과 처리
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    console.log(localStorage.getItem('accessToken'));

  }


};

</script>
<template>

  <div class="col p-0 m-0">
    <div class="bg-primary-subtle ps-4">
      <span>사용자 관리 > 회원 조회</span>
    </div>
    <div class="container my-4">
      <h1 class="mb-4">회원 조회</h1>

      <div class="row mb-3">
        <div class="col-2">
          <SelectComponent
              label="검색조건"
              id="nickname"
              :options="searchOptions"
              placeholder="검색 조건"
              v-model="selectedOption"
          />
        </div>
        <div class="col-md-5">
          <label for="searchInput" class="form-label">검색</label>
          <input type="text" class="form-control" id="searchInput" v-model="searchWord" placeholder="검색어 입력">
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-secondary" @click="search">검색</button>
        </div>
      </div>


      <div class="row mb-3">
        <SelectComponent
            label="인기회원"
            id="influencerYn"
            :options="influencerOptions"
            placeholder="인기회원 선택..."
            v-model="influencerYn"
        />
        <SelectComponent
            label="정렬"
            id="orderBy"
            :options="orderByOptions"
            placeholder=""
            v-model="orderBy"
        />
      </div>

    </div>

    <div class="row">
      <div class="col">
        <h5>선택된 값들:</h5>
        <p>검색 조건 : {{ selectedOption }}</p>
        <p>인기회원: {{ influencerYn }}</p>
        <p>검색어: {{ searchWord }}</p>
      </div>
    </div>
  </div>


</template>

<style scoped>

</style>