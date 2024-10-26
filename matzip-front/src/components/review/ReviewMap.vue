<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue'

const mapContainer = ref(null)
const modalContent = ref('');

// 음식점에 대한 리뷰 조회 모달 설정
async function showReviewModal(seq, title) {
  const exampleModal = document.getElementById('exampleModal');
  if (exampleModal) {
    exampleModal.style.display = 'block';
  }
  try {
    const response = await axios.get(`https://matzipapi.huichan.kr/back/api/v1/review?page=1&size=10&restaurantSeq=${seq}`);
    const reviews = response.data.reviews;
    document.getElementById("exampleModalLabel").innerHTML = title;
    
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
window.showReviewModal = showReviewModal;

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
      
      console.log(positions);

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
          position: marker.getPosition()
        });

        // 임시 랜덤 이미지 생성
        const randomImage = await axios.get("https://picsum.photos/256/256.webp");

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
            '                <div class="ellipsis">' + restaurants[i].restaurantAddress + '</div>' + 
            '                <div class="jibun ellipsis">' + restaurants[i].restaurantPhone + '</div>' + 
            `                <button id="modalBtn" type="button" class="btn btn-secondary btn-sm float-right" onclick="showReviewModal(` + restaurants[i].restaurantSeq + `, '` + restaurants[i].restaurantTitle + `')">Review</button>` + 
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



</script>

<template>
<div ref="mapContainer" style="width: 100%; height: 70vh"></div>
<div class="modal" id="exampleModal" style="">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">모달 제목</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="document.getElementById('exampleModal').style.display = 'none';">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" v-html="modalContent">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
        <button type="button" class="btn btn-primary">저장</button>
      </div>
    </div>
</div>

</template>

<style scoped>
.modal {
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
.modal-header {
  display: flex;
  justify-content: space-between;
}
</style>
