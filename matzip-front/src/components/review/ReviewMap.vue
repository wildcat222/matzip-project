<script setup>
import { ref, onMounted, watch } from 'vue'

const mapContainer = ref(null)


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
  const script = document.createElement('script')
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=84fdfd9786843d213058a53098583c8b&libraries=services&autoload=false`
  document.head.appendChild(script)

  script.onload = () => {
    window.kakao.maps.load(async () => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const positions = [];
      const promises = [];

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
        displayMarker(positions[i])
      }

      function displayMarker(data) {
        var marker = new window.kakao.maps.Marker({
          map: mapInstance,
          position: data.latlng
        });

        var overlay = new window.kakao.maps.CustomOverlay({
          // yAnchor: 3,
          position: marker.getPosition()
        });

        // var content = document.createElement('div');
        // content.innerHTML = data.content;
        // content.style.cssText = 'background: white; border: 1px solid black';

        // var closeBtn = document.createElement('button');
        // closeBtn.innerHTML = 'exit';
        // closeBtn.onclick = function () {
        //   overlay.setMap(null);
        // };
        // content.appendChild(closeBtn);
        var content = '<div class="wrap">' + 
            '    <div class="info">' + 
            '        <div class="title">' + 
              data.content + 
            '            <div class="close" onclick="closeOverlay()" title="닫기"></div>' + 
            '        </div>' + 
            '        <div class="body">' + 
            '            <div class="img">' +
            '                <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumnail.png" width="73" height="70">' +
            '           </div>' + 
            '            <div class="desc">' + 
            '                <div class="ellipsis">제주특별자치도 제주시 첨단로 242</div>' + 
            '                <div class="jibun ellipsis">(우) 63309 (지번) 영평동 2181</div>' + 
            '                <div><a href="https://www.kakaocorp.com/main" target="_blank" class="link">홈페이지</a></div>' + 
            '            </div>' + 
            '        </div>' + 
            '    </div>' +    
            '</div>'
        overlay.setContent(content);

        kakao.maps.event.addListener(marker, 'click', function() {
          overlay.setMap(mapInstance);
        });
      }
    })
  }
}

</script>

<template>
<div ref="mapContainer" style="width: 100%; height: 70vh"></div>
  
</template>

<style scoped>

</style>