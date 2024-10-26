<script setup>
import { ref, onMounted } from 'vue'

const mapContainer = ref(null);

onMounted(() => {
  loadKakaoMap(mapContainer.value);
});

const loadKakaoMap = (container) => {
  // 카카오맵 API 호출
  const script = document.createElement('script')
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=84fdfd9786843d213058a53098583c8b&libraries=services&autoload=false`
  document.head.appendChild(script)

  // 지도 그리기
  script.onload = () => {
    window.kakao.maps.load(() => {
      const options = {
        center: new window.kakao.maps.LatLng(37.497210619489614, 126.92761120382163),
        level: 4,
        draggable: false, // 이동 금지
        zoomable: false   // 확대/축소 금지
      }

      const mapInstance = new window.kakao.maps.Map(container, options);
    });
  }
}

// 화면 이동
function panTo() {
    var moveLatLon = new kakao.maps.LatLng(37.49892132201782, 126.92933414403475);
    mapContainer.panTo(moveLatLon);            
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