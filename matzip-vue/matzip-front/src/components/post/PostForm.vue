<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import axios from "axios";

const router = useRouter();
const editor = ref(null);

const props = defineProps({
  initialData: Object,
  title: { type: String, default: '게시글 작성' },
})

const formData = ref({
  boardCategorySeq: null,
  postTitle: "",
  postContent: "",
  listSeq: null,
  restaurantSeq: null,
  tagName: "",
})

// 부모로부터 데이터를 받아온 후 에디터를 초기화하기 위한 추적변수 선언
const editorInitialized = ref(false);

watch(() => props.initialData, (newData) => {
  console.log("New Data:", newData);
  if (newData && !editorInitialized.value) {
    Object.assign(formData.value, {
      boardCategorySeq: newData.post.boardCategorySeq,
      postTitle: newData.post.postTitle,
      postContent: newData.post.postContent,
      listSeq: newData.listSeq || null,
      restaurantSeq: newData.restaurant ? newData.restaurant.restaurantSeq : null,
      tagName: Array.isArray(newData.tags) ? newData.tags.map(tag => tag.tagName).join(', ') : '',
    });

    // initialData 받아온 후 에디터 초기화 (단 한 번만)
    initializeEditor(newData.post.postContent);
    editorInitialized.value = true; // 초기화 완료 상태로 변경
  }
});

const emit = defineEmits(['submit']);

/* 게시글 제출 함수 */
const submitPost = async () => {
  const htmlContent = editor.value.getHTML();
  formData.value.postContent = htmlContent;    // 에디터 내용을 formData 에 추가

  // tags(태그)는 쉼표를 기준으로 키워드를 추출한 뒤 공백 제거하여 배열로 변환
  formData.value.tagName = formData.value.tagName.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);      // 빈 태그 제거

  // 새로운 객체를 생성하여 순환 참조를 방지
  const dataToSend = {
    ...formData.value,    // 전개 연산자를 사용하여 새로운 객체로 복사
  };

  emit("submit", dataToSend);
};

/* 게시판 카테고리 목록 */
const boards = ref([]);

const fetchBoards = async () => {
  try {
    const response = await axios.get("https://matzipapi.huichan.kr/back/api/v1/board");
    boards.value = response.data.data;
  } catch (error) {
    console.log("게시판 목록을 불러오는 중 에러가 발생했습니다: ", error);
  }
};

/* 음식점 검색, 선택 */
const searchQuery = ref("");
const filteredRestaurants = ref([]);

const searchRestaurants = async () => {
  if (!searchQuery.value) {
    filteredRestaurants.value = [];
    return;
  }
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/restaurant`, {
      params: { title: searchQuery.value } // 음식점 이름을 요청 파라미터로 추가
    });
    filteredRestaurants.value = response.data.restaurants; // 검색 결과 저장
  } catch (error) {
    console.error("음식점 검색 중 에러가 발생했습니다: ", error);
  }
};

const selectRestaurant = (restaurant) => {
  formData.value.restaurantSeq = restaurant.restaurantSeq;
  searchQuery.value = restaurant.restaurantTitle; // 선택된 음식점 이름으로 입력란 업데이트
  filteredRestaurants.value = [];                 // 검색 결과 초기화
};

/* 에디터를 초기화하는 함수 */
const initializeEditor = () => {
  console.log("초기화초기화");
  editor.value = new Editor({
    el: document.querySelector('#editor'), // 에디터를 적용할 요소 (컨테이너)
    height: '500px',                                // 에디터 영역의 높이 값 (00px || auto)
    initialEditType: 'wysiwyg',                     // 최초로 보여줄 에디터 타입 (markdown || wysiwyg)
    previewStyle: 'vertical',                       // 마크다운 프리뷰 스타일 (tab || vertical)
    initialValue: formData.value.postContent,       // 게시글 수정 시 기존에 작성된 내용 삽입
    hooks: {
      addImageBlobHook: async (blob, callback) => {
        const uploadResult = await uploadImage(blob);
        callback(`https://matzipapi.huichan.kr/back${uploadResult.url}`);
      }
    }
  });
};

/* 이미지 업로드 함수 */
const uploadImage = async (blob) => {
  const imageFormData = new FormData();
  imageFormData.append('image', blob);

  try {
    const response = await axios.post('https://matzipapi.huichan.kr/back/api/v1/posts/uploadImage', imageFormData);
    return response.data;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

onMounted(() => {
  fetchBoards();
  initializeEditor();
});

</script>

<template>
  <form @submit.prevent="submitPost" class="editor container">

    <h1>{{ title }}</h1>

    <div class="form-group">
      <label for="boardCategory" class="form-label">게시판 카테고리</label>
      <select id="boardCategory" v-model="formData.boardCategorySeq" class="form-control" required>
        <option value="" disabled>카테고리를 선택하세요</option>
        <option v-for="board in boards" :key="board.boardCategorySeq" :value="board.boardCategorySeq">
          {{ board.boardCategoryName }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="postTitle" class="form-label">게시글 제목</label>
      <input type="text" id="postTitle" v-model="formData.postTitle" class="form-control" required/>
    </div>

    <div class="form-group">
      <label for="postContent" class="form-label">게시글 내용</label>
      <div id="editor"></div> <!-- 에디터 컨테이너 -->
    </div>

    <div class="form-group">
      <label for="list" class="form-label">리스트</label>
      <input type="number" id="list" v-model="formData.listSeq" class="form-control"/>
    </div>

    <div class="form-group">
      <label for="restaurant" class="form-label">음식점</label>
      <input
          type="text"
          v-model="searchQuery"
          @input="searchRestaurants"
          class="form-control"
          placeholder="음식점을 검색하세요"
      />
      <ul v-if="filteredRestaurants.length" class="restaurant-list">
        <li
            v-for="restaurant in filteredRestaurants"
            :key="restaurant.restaurantSeq"
            @click="selectRestaurant(restaurant)"
        >
          {{ restaurant.restaurantTitle }}
        </li>
      </ul>
    </div>

    <div class="form-group">
      <label for="tag" class="form-label">태그</label>
      <input type="text" id="tag" v-model="formData.tagName" class="form-control"/>
    </div>

    <div style="text-align: right"> <!-- 오른쪽 정렬을 위한 div -->
      <button type="submit" style="margin-top: 20px">글쓰기완료</button>
    </div>
  </form>
</template>


<style scoped>
h1 {
  background-color: #FD9976;
  font-style: italic;
  padding: 10px;
}

.editor.container {
  margin: 0 auto;
  max-width: 800px;
  padding: 50px 20px;
}

.form-group label {
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-group select.form-control {
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 16 16"><path d="M1.5 5.5L8 12l6.5-6.5H1.5z"/></svg>'); /* 화살표 아이콘 추가 */
  background-repeat: no-repeat;
  background-position: right 10px center; /* 아이콘 위치 조정 */
  background-size: 10px; /* 아이콘 크기 조정 */
}

button {
  background-color: #ff6f20;
  color: white;
  padding: 5px 10px;
  width: auto;
  cursor: pointer;
}

button:hover {
  background-color: #e65c15;
}

.restaurant-list {
  list-style-type: none;
  padding: 0;
  margin-top: 5px;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto; /* 스크롤 가능 */
}

.restaurant-list li {
  padding: 10px;
  cursor: pointer; /* 포인터 커서 */
}

.restaurant-list li:hover {
  background-color: #f0f0f0;
}
</style>
