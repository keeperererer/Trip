<template>
  <div class="test">
    <div id="container"></div>
  </div>
</template>
<script>
import MapLoader from '@/assets/js/AMap.js'
export default {
  name: 'test',
  data () {
    return {
      map: null
    }
  },
  mounted () {
    let that = this
    MapLoader().then(AMap => {
      console.log('地图加载成功')
      that.map = new AMap.Map('container', {
        center: [117.000923, 36.675807],
        zoom: 11
      })
    }, e => {
      console.log('地图加载失败' ,e)
    })
  }
}
</script>
<style>
#container {
  width: 100%;
  height: 500px;
}
</style>