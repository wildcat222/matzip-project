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
  console.log(`ReviewMap.vue가 마운트되었어요.`);
  watch(() => props.restaurants, () => {
    loadKakaoMap(mapContainer.value, props.restaurants);
  });
  
  console.log(`ReviewMap.vue에서 맵을 불러왔어요.`);
  // const geocoder = new window.kakao.maps.services.Geocoder();
  // for (let i = 0; i < restaurants.length; i++) {
  // console.log(restaurants[i]);
// }
})

const loadKakaoMap = (container, restaurants) => {
  console.log(`ReviewMap.vue에서 지도를 그리기 시작했어요.`);
  const script = document.createElement('script')
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=84fdfd9786843d213058a53098583c8b&libraries=services&autoload=false`
  document.head.appendChild(script)

  script.onload = () => {
    window.kakao.maps.load( async () => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const positions = [];
      let test = await new Promise(() => {
        for (let i = 0; i < restaurants.length; i++) {
          geocoder.addressSearch(restaurants[i].restaurantAddress, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            console.log(`성공`);
            positions.push({
            content: restaurants[i].restaurantTitle,
            latlng: new window.kakao.maps.LatLng(result['0'].road_address.y, result['0'].road_address.x)
            })
          }
          
        })
        
      }
      });

      // let result = await test;
      console.log(result);
      
      
      const options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도 중심 좌표
        level: 3, // 지도 확대 레벨
        maxLevel: 5, // 지도 축소 제한 레벨
      }

      const mapInstance = new window.kakao.maps.Map(container, options) // 지도 생성
      console.log(`ReviewMap.vue에서 지도를 다 그렸어요.`);


    })
  }
}


</script>

<template>
<div ref="mapContainer" style="width: 100%; height: 70vh"></div>
<span>하하하 {{ props.restaurants }}</span>
  
</template>

<style scoped>

</style>