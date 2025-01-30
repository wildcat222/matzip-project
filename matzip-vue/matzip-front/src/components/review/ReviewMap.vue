<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue'

const mapContainer = ref(null);
const modalContent = ref('');
let writeSeq = ref('');

// 음식점에 대한 리뷰 조회 모달 설정
async function showReviewModal(seq, title) {
  const exampleModal = document.getElementById('exampleModal');
  if (exampleModal) {
    // 내용을 초기화하고 모달창 보이기
    document.getElementById("exampleModalLabel").innerHTML = null;
    modalContent.value = null;
    exampleModal.style.display = 'block';

    try {
      const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/review?page=1&size=10&restaurantSeq=${seq}`);
      const reviews = response.data.reviews;
      document.getElementById("exampleModalLabel").innerHTML = title;
      writeSeq = seq;
      
      // 리뷰 데이터를 HTML 형식으로 변환
      modalContent.value = reviews.map(review => `
        <div class="review-item">
          <p>${review.reviewContent}</p>
          <small>Rating: ${review.reviewStar} / Date: ${new Date(review.reviewCreatedTime).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</small>
          <hr>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error fetching review:', error);
      modalContent.value = '<p>리뷰를 불러오는 데 실패했습니다.</p>';
    }
  }
}
window.showReviewModal = showReviewModal;

// 음식점에 대한 리뷰 작성 모달 설정
async function showReviewWriteModal() {
  const writeModal = document.getElementById('writeModal');
  // 내용을 초기화하고 모달창 보이기
  if (writeModal) {
    document.getElementById('writeForm').reset();
    writeModal.style.display = 'block';
  }
}
window.showReviewWriteModal = showReviewWriteModal;

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  }
});

onMounted(() => {
  watch(() => props.restaurants, () => {
    loadKakaoMap(mapContainer.value, props.restaurants);
  });
})

const loadKakaoMap = (container, restaurants) => {
  // 카카오맵 API 호출
  const script = document.createElement('script')
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=84fdfd9786843d213058a53098583c8b&libraries=services&autoload=false`
  document.head.appendChild(script)

  // 지도 그리기
  script.onload = () => {
    window.kakao.maps.load(async () => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const positions = [];
      const promises = [];

      // 부모에서 넘겨받은 음식점 정보의 주소에서 좌표를 얻은 다음 제목과 좌표를 positions에 저장
      for (let i = 0; i < restaurants.length; i++) {
        const promise = new Promise((resolve) => {
          geocoder.addressSearch(restaurants[i].restaurantAddress, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              positions.push({
                content: restaurants[i].restaurantTitle,
                latlng: new window.kakao.maps.LatLng(result[0].road_address.y, result[0].road_address.x)
              });
            }
            resolve();
          });
        });
        promises.push(promise);
      }

      // 전체 요청이 완료된 후 진행
      await Promise.all(promises);
      
      const options = {
        center: new window.kakao.maps.LatLng(37.533998823982, 127.005997148647),
        level: 3, // 지도 확대 레벨
        maxLevel: 5, // 지도 축소 제한 레벨
      }

      // 지도 생성
      const mapInstance = new window.kakao.maps.Map(container, options)

      // 마커 생성
      for (var i = 0; i < positions.length; i++) {
        displayMarker(i)
      }

      // 마커 생성 함수
      async function displayMarker(i) {
        // 마커 생성
        var marker = new window.kakao.maps.Marker({
          map: mapInstance,
          position: positions[i].latlng
        });

        // 마커 클릭 시 보일 오버레이 생성
        var overlay = new window.kakao.maps.CustomOverlay({
          position: positions[i].latlng
        });

        // 임시 랜덤 이미지 생성
        const randomImage = await axios.get("https://picsum.photos/256/256.webp");

        // 음식점 이름으로 마커 - 음식점 매칭
        let overlayRestaurant = null;
        for (let j = 0; j < positions.length; j++) {
          if (positions[i].content === restaurants[j].restaurantTitle) {
            overlayRestaurant = restaurants[j];
            break;
          }
        }

        // 오버레이 커스터마이징
        var content = '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + 
              positions[i].content + 
            '            <div class="close" title="닫기"></div>' + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="' + randomImage.request.responseURL + '" width="73" height="70">' +
            '           </div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">' + overlayRestaurant.restaurantAddress + '</div>' + 
            '                <div class="jibun ellipsis">' + overlayRestaurant.restaurantPhone + '</div>' + 
            `                <button id="modalBtn" type="button" class="btn btn-secondary btn-sm float-right" onclick="showReviewModal(` + overlayRestaurant.restaurantSeq + `, '` + overlayRestaurant.restaurantTitle + `')" style="float: right; margin-right: 10px;">Review</button>` + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>'
        await overlay.setContent(content);

        // 오버레이 보이기 - 마우스 좌클릭
        kakao.maps.event.addListener(marker, 'click', function() {
          overlay.setMap(mapInstance); });

        // 오버레이 숨기기 - 마우스 우클릭
        kakao.maps.event.addListener(marker, 'rightclick', function() {
          overlay.setMap(null); });
      }
    })
  }
}

const formData = ref({
  "restaurantSeq": 0,
  "reviewContent": "string",
  "reviewStar": 0,
  "reviewImages": null
})

// 파일 저장
const handleFileChange = (e) => {
  formData.value.reviewImages = e.target.files;
};

// 작성된 리뷰 전송
const submitForm = async () => {
  const reviewImages = formData.value.reviewImages;
  const reviewContent = formData.value.reviewContent;
  const formDataToSend = new FormData();
  formDataToSend.append("reviewRequest", new Blob([JSON.stringify({
    "restaurantSeq": writeSeq,
    "reviewContent": reviewContent,
    "reviewStar": 0
  })], { type: 'application/json' }));

  if (reviewImages) {
    for (let i = 0; i < reviewImages.length; i++) {
      formDataToSend.append("reviewImages", reviewImages[i]);
    }
  }
  
  try {
    await axios.post("https://matzipapi.huichan.kr/back/api/v1/review", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
    });
    alert("리뷰 작성 성공!");
    document.getElementById('writeModal').style.display = 'none';
  } catch (error) {
    alert("리뷰 작성 실패!");
    document.getElementById('writeModal').style.display = 'none';
  }
};

</script>

<template>
<div ref="mapContainer" id="reviewMap"></div>
<div class="modal" id="exampleModal" style="">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">모달 제목</h5>
        <button type="button" class="btn close" data-dismiss="modal" aria-label="Close" onclick="document.getElementById('exampleModal').style.display = 'none';">
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div class="modal-body" v-html="modalContent">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="showReviewWriteModal()">리뷰 작성</button>
      </div>
    </div>
</div>

<div class="modal" id="writeModal" style="display: none;">
    <div class="modal-content">
      <form @submit.prevent="submitForm" id="writeForm">
        <div class="modal-header">
          <h5 class="modal-title" id="writeModalLabel">리뷰 작성</h5>
          <button type="button" class="btn close" data-dismiss="modal" aria-label="Close" onclick="document.getElementById('writeModal').style.display = 'none';">
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div style="justify-content: center; margin-top: 10px; margin-bottom: 10px">
          <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupFile01">Image</label>
            <input type="file" class="form-control" id="inputGroupFile01" @change="handleFileChange" multiple accept="image/*">
          </div>
          <b-form-textarea id="reviewContent" v-model="formData.reviewContent" class="form-control"></b-form-textarea>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-secondary">저장</button>
        </div>
      </form>
    </div>
</div>

</template>

<style scoped>

#reviewMap {
  width: 100%;
  height: 70vh;
  border: 1px solid;
  border-radius: 20px;
}

#exampleModal {
  z-index: 5;
  position: fixed;
  display: none;
  width: 50%;
  height: 50vh;
  margin: 0 auto;
  margin-top: auto;
  margin-bottom: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

#writeModal {
  z-index: 10;
  position: fixed;
  max-width: 1000px;
  height: 70vh;
  margin: 0 auto;
  margin-top: auto;
  margin-bottom: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
}

.close:after {
  display: inline-block;
  content: "\00d7";
  font-size: 15pt;
}

.input-group {
  margin: 0 auto;
  max-width: 900px;
}

#reviewContent {
  margin: 0 auto;
  max-width: 900px;
  height: 45vh;
  resize: none;
}

</style>
