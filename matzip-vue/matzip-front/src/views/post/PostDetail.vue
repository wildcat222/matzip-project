<script setup>
import { reactive, onMounted, nextTick, computed } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import PostDetail from "@/components/post/PostDetail.vue";

// 상태 관리
const route = useRoute();
const router = useRouter();
const post = reactive({
  boardCategoryName: '',
  postUserSeq: null,
  userNickname: '',
  postCreatedTime: null,
  likeCount: 0,
  postTitle: '',
  postContent: '',
  restaurant: {},
  tags: [],
  comments: [],
});

// 게시글 ID(Seq) 가져오기
const postId = route.params.id;

const getUserSeqFromToken = () => {
  const token = localStorage.getItem('accessToken');

  if(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('payload 확인 : ', payload); // payload 전체 출력
    console.log('userSeq 확인: ', payload.sub);
    return payload.sub;
  }
  console.log('userSeq 확인 : ', token);
  return null;
};

// API 호출 함수
const fetchPostDetail = async () => {
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/posts/${postId}`);
    const data = response.data.data2; // 응답에서 data2를 가져옴
    console.log(data);
    post.boardCategoryName = data.post.boardCategoryName;
    post.postTitle = data.post.postTitle;
    post.postUserSeq = data.post.postUserSeq;
    post.userNickname = data.post.userNickname;
    post.postCreatedTime = new Date(data.post.postCreatedTime)
        .toLocaleString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
    post.likeCount = data.post.likeCount;
    post.postContent = data.post.postContent;
    post.restaurant = data.restaurant;
    post.tags = data.tags;
    post.comments = data.comments || [];  // 댓글 배열이 없을 경우 빈 배열로 초기화

    // 이미지 크기 조정 로직
    await nextTick(); //DOM 업데이트 후 실행
    const images = document.querySelectorAll('.article_container img');
    images.forEach((img) => {
      img.style.width = '400px';
      img.style.height = '400px';
      img.style.objectFit = 'cover';
    });

  } catch (error) {
    console.error('게시글 정보를 불러오는 중 에러가 발생했습니다: ', error);
  }
};

const userSeq = getUserSeqFromToken();
const isUserPostOwner = computed(() => Number(userSeq) === Number(post.postUserSeq));

// 게시글 수정 페이지로 이동
const editPost = () => {
  router.push(`/user/post/${postId}/edit`);
}

// 게시글 삭제
const deletePost = async () => {
  if (confirm('정말로 게시글을 삭제하시겠습니까?')) {
    try {
      await axios.delete(`https://matzipapi.huichan.kr/back/api/v1/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      alert('게시글이 삭제되었습니다.');
      router.push('/user/post');
    } catch (error) {
      console.error('게시글 삭제 중 오류가 발생했습니다.', "error");
      alert('게시글 삭제에 실패했습니다.');
    }
  }
}

// 게시글 신고
const reportPost = async () => {
  try {
    await axios.post(`https://matzipapi.huichan.kr/back/api/v1/post/${postId}/report`), {
        reportContent: 'string',
        reportReason: []    // 신고 사유 고유번호
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    };
    alert('신고가 완료되었습니다.');
  } catch (error) {
    console.error('신고 중 오류가 발생했습니다.', error);
    alert('신고에 실패했습니다.');
  }
};

// 페이지가 로드될 때 API 호출
onMounted(async () => {
  await fetchPostDetail(); // 데이터 로드 후 대기
  console.log('게시글작성자인지확인: ', post.postUserSeq, isUserPostOwner.value); // 계산된 값 출력
  const images = document.querySelectorAll('.article_container img');
  console.log('Images:', images); // 이미지 확인
});
</script>

<template>
  <div>
    <PostDetail
        :post="post"
        :postId="postId"
        :isUserPostOwner="isUserPostOwner"
        @comment-submitted="fetchPostDetail"
        @delete-post="deletePost"
        @edit-post="editPost"
    />
  </div>

</template>

