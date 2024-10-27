<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue'

const mapContainer = ref(null);

const props = defineProps({
  restaurants: {
    type: Array,
    default: () => []
  },
});

onMounted(() => {
    loadKakaoMap(mapContainer.value, props.restaurants);
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
        center: positions[0].latlng,
        level: 5, // 지도 확대 레벨
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
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>'
        await overlay.setContent(content);
        overlay.setMap(mapInstance);
      }
    })
  }
}

</script>

<template>
<div ref="mapContainer" id="reviewMap"></div>
</template>

<style scoped>
#reviewMap {
  width: 100%;
  height: 100%;
}
</style>
