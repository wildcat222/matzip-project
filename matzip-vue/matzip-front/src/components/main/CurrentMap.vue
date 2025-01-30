<script setup>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue'

const mapContainer = ref(null);
const positions = [];
let mapInstance = null;

const props = defineProps({
  restaurants: {
    type: Array,
    required: true
  }
});

onMounted(() => {
  watch(() => props.restaurants, () => {
    loadKakaoMap(mapContainer.value, props.restaurants).then(() => {
      startChangingMarkers();
    });
  });
});



const loadKakaoMap = (container, restaurants) => {
  return new Promise((resolve) => {
    // 카카오맵 API 호출
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=84fdfd9786843d213058a53098583c8b&libraries=services&autoload=false`
    document.head.appendChild(script)

    // 지도 그리기
    script.onload = () => {
      window.kakao.maps.load(async () => {
        const geocoder = new window.kakao.maps.services.Geocoder();
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
          center: positions[0].latlng,
          level: 2, // 지도 확대 레벨
          maxLevel: 5, // 지도 축소 제한 레벨
          draggable: false,
          zoomable: false
        }

        // 지도 생성
        mapInstance = new window.kakao.maps.Map(container, options)

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

          resolve();
        }
      })
    }
  })
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const startChangingMarkers = async () => {
  while(true) {
    const next = Math.floor(Math.random() * (props.restaurants.length))
    if (positions[next] === undefined) {
      continue;
    } else {
      mapInstance.panTo(positions[next].latlng)
      await sleep(5000);
    }
  }
}

</script>

<template>
  <div ref="mapContainer"></div>
</template>

<style scoped>
div {
  width: 100%;
  height: 500px;
  margin-right: 20px;
  margin-left: 20px;
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}
</style>