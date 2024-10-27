<template>

  <div class="post-detail">
    <div class="boardCategory">
      <h1>{{ post.boardCategoryName }}</h1>
    </div>

    <div class="ArticleContentBox">

      <div class="article_header">
        <div class="ArticleTitle">
          <h2 class="title_text">{{ post.postTitle }}</h2>
          <div class="ArticleTool">
            <div>{{ post.likeCount }}</div>
            <div v-if="isUserPostOwner" @click="toggleMenu" class="menu-toggle">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
        </div>

        <div class="WriterInfo">
          <div>
            <a
                :href="`http://localhost:5173/user/${post.postUserSeq}`"
                class="nickname"
            >
              {{ post.userNickname }}
            </a>
          </div>
          <div class="date">{{ post.postCreatedTime }}</div>
        </div>
      </div>

      <div class="article_container" style="margin: 0 20px;">
        <div class="article_container" style="display: flex; justify-content: center;">
          <div class="restaurant-info" v-if="post.restaurant"
               style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; width: 300px; margin-bottom: 30px">
            <h4 style="color: orange; font-weight: bold; text-align: center">🍖 오늘의 맛집 🍹</h4>
            <p>{{ post.restaurant.restaurantTitle }}</p>
            <p>{{ post.restaurant.restaurantAddress }}</p>
            <p>{{ post.restaurant.restaurantPhone }}</p>
          </div>
        </div>

        <div v-html="post.postContent"></div>

        <div class="tags" v-if="post.tags.length">
          <ul class="tags-list">
            <li v-for="tag in post.tags" :key="tag.postTagSeq"># {{ tag.tagName }}</li>
          </ul>
        </div>
      </div>

    </div>

    <hr class="orange-line" />

    <div class="commentBox" style="display: block">
      <h4 class="comment">댓글</h4>
        <ul class="commentList">
          <li v-if="post.comments.length === 0" class="no-comments">댓글이 없습니다.</li>
          <li class="commentItem" v-for="(comment, index) in filteredComments" :key="index">
            <strong>{{ comment.userNickname }}</strong>
            <div class="comment-content">{{ comment.postCommentContent }}</div>
            <div class="comment-time">{{ new Date(comment.postCommentCreatedTime)
                .toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false}) }}</div>
          </li>
        </ul>
    </div>

    <div class="commentWriter" style="margin-top: 10px;">
      <div class="commentBox">
        <textarea v-model="newComment" class="commentBoxText" placeholder="댓글을 남겨보세요"></textarea>
      </div>
      <div class="registerBox" style="text-align: right; margin-top: 5px;">
        <button class="button btnRegister is_active" @click="submitComment"
                style="background-color: lightgray; border: none; border-radius: 5px; padding: 10px 20px; cursor: pointer;">
          댓글 등록
        </button>
      </div>
    </div>

    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <h4>더보기</h4>
        <button @click="editPostHandler">게시글 수정</button>
        <button @click="deletePostHandler">게시글 삭제</button>
        <button @click="closeModal">닫기</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, defineEmits, computed } from "vue";
import axios from "axios";

// Props로 게시글 정보 받기
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  isUserPostOwner: {
    type: Boolean,
    required: true,
  }
});

const newComment = ref('');         // 댓글 입력값을 위한 상태
const emit = defineEmits(['comment-submitted', 'delete-post']);
const isModalVisible = ref(false);  // 모달 가시성 상태

// 모달
const toggleMenu = () => {
  isModalVisible.value = !isModalVisible.value;
};

// 모달 닫기
const closeModal = () => {
  isModalVisible.value = false;
};

// 게시글 삭제 클릭시
const deletePostHandler = () => {
  closeModal();
  emit('delete-post');
};

// 게시글 수정 클릭시
const editPostHandler = () => {
  closeModal();
  emit('edit-post');
};

// 댓글 필터링 (반환된 댓글 배열 length가 1인데 실제로는 댓글이 없는 경우를 걸러내기 위함)
const filteredComments = computed(() => {
  return (props.post.comments || []).filter(comment => comment !== null);
})

// 댓글 등록 함수
const submitComment = async () => {
  if (!newComment.value.trim()) {
    alert('댓글을 입력하세요.');
    return;
  }

  try {
    await axios.post(`https://matzipapi.huichan.kr/back/api/v1/postcomment`, {
      postSeq: props.postId,
      postCommentContent: newComment.value,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    newComment.value = '';  // 댓글 입력창 비우기
    emit('comment-submitted');
  } catch (error) {
    console.error('댓글 등록 중 오류가 발생했습니다:', error);
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 300px;
  max-width: 80%;
  height: auto;
}

.boardCategory {
  margin-top: 50px;
  background-color: #FD9976;
  color: white;
  font-style: italic;
  padding: 10px;
}

.article_header {
  display: flex;
  flex-direction: column;
  border-bottom: 3px red;
  margin-bottom: 20px;
  padding-bottom: 20px;
}

.ArticleTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.ArticleTool {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.WriterInfo {
  display: flex;
  align-items: center;
  margin-top: 5px;
}

.WriterInfo .date {
  margin-left: 15px;
}

.nickname {
  color: #000;
  cursor: pointer;
}

.ArticleContentBox .article_header {
  position: relative;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid
}

.menu-toggle {
  cursor: pointer;
  margin-left: 15px;
  margin-right: 30px;
}

.tags {
  text-align: right;
  margin-top: 10px;
}

.tags-list {
  list-style-type: none;
  padding: 0;
}

.tags-list li {
  font-size: 1.2em;
  color: navy;
}

.comment {
  margin-top: 10px;
  background-color: #FDBEA2;
  padding: 10px;
  border-radius: 5px;
}

.comment-time {
  font-weight: normal;
  color: gray;
}

.commentItem {
  margin: 5px 0;
  padding: 5px 0;
  border-top: 1px solid #ccc;
}

.commentItem:first-child {
  border-top: none; /* 첫 댓글에는 위쪽 줄 제거 */
}

.post-detail {
  margin: 20px;
}

.tags, .restaurant-info {
  margin-top: 10px;
}

.commentList {
  list-style: none;
  padding: 10px;
}

.commentItem {
  margin: 5px 0;
}

.commentWriter {
  margin-top: 20px;
}

.commentBoxText {
  width: 100%;
  height: 80px;
}

</style>
