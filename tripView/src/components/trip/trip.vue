<template>
  <div class="trip">
    <div v-show="$route.name !== 'Map'" class="trip-box">
      <img class="trip-bg" src="../../assets/trip-bg.jpg" alt>
      <div class="trip-con">
        <md-tabs v-model="TripWay">
          <md-tab-pane name="徒步" label="徒步"></md-tab-pane>
          <md-tab-pane name="跑步" label="跑步"></md-tab-pane>
          <md-tab-pane name="骑行" label="骑行"></md-tab-pane>
          <md-tab-pane name="自驾" label="自驾"></md-tab-pane>
        </md-tabs>
        <div class="trip-border">
          <p>累计{{TripWay}}</p>
          <strong>{{distance}}</strong>
          <p>公里</p>
        </div>
        <div class="trip-start" @click="tripStart">开始{{TripWay}}</div>
      </div>
    </div>
    <transition name="fademap">
      <div class="trip-map" v-if="$route.name === 'Map'">
        <router-view/>
      </div>
    </transition>
    <trip-nav></trip-nav>
  </div>
</template>
<script>
import { mapGetters,mapMutations } from 'vuex'
import TripNav from '@/components/bottomNav/nav'
export default {
  name: 'trip',
  components:{
    TripNav
  },
  data () {
    return {
      TripWay: '徒步', // 出行方式
      distance: '0.0',
      wayData: {
        p1: '徒步',
        p2: '跑步',
        p3: '骑行',
        p4: '自驾'
      }
    }
  },
  // created(){
  //   console.log(this.userDistance.allWalk)
  // },
  computed: {
    allDistanceData () {
      return this.userDistance
    },
    ...mapGetters(['userDistance'])
  },
  watch: {
    '$route' (to) {
      this.updataDistance(this.TripWay)
    },
    TripWay: {
      handler (val) {
        this.updataDistance(val)
      },
      immediate: true
    }
  },
   methods: {
    ...mapMutations({
      setWeatherArr:'SET_WEATHER_ARR'
    }),
    updataDistance (val) {
      switch (val) {
        case '徒步':
          this.distance = this.allDistanceData.allWalk
          break
        case '跑步':
          this.distance = this.allDistanceData.allRun
          break
        case '骑行':
          this.distance = this.allDistanceData.allCycle
          break
        case '自驾':
          this.distance = this.allDistanceData.allDrive
          break
      }
    },
    tripStart () {
      // console.log('天气11')
      // let params = {
      //   city: 110101,
      //   key: c20caaeac66c17928f1da30a415a29cd,
      // }
      this.$http.get('https://restapi.amap.com/v3/weather/weatherInfo?city=430103&key=c20caaeac66c17928f1da30a415a29cd',{}).then(res => {
        let weatherArr = res.data.lives
        this.setWeatherArr(weatherArr)

      })
      // console.log('天气22')
      this.$router.push({ name: 'Map', params: { tripType: this.TripWay } })
    }
   }
}
</script>
<style lang="scss" scoped>
.trip {
  width: 100%;
  height: 100%;
  position: relative;
  // overflow: hidden;
}
.trip-bg {
  width: 100%;
  height: calc(100vh-100px);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.5;
}
.trip-con {
  width: 100%;
  height: calc(100vh-100px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.trip-border {
  width: 450px;
  height: 450px;
  border-radius: 450px;
  margin: 100px auto;
  // border: 8px dashed #ffffff;
  border: 8px solid #8bade6;
  // border: 12px solid pink;
  box-shadow: 2px 2px 2px 2px pink;
  // border-bottom: none;
}
p:nth-child(1) {
  text-align: center;
  margin-top: 80px;
  color: #4e4956;
  font-size: 33px;
  letter-spacing: 2px;
}
strong {
  display: block;
  text-align: center;
  margin-top: 35px;
  // color: #ffffff;
  color: #6971f0;
  font-size: 130px;
}
p:nth-child(3) {
  text-align: center;
  margin-top: 35px;
  font-size: 28px;
}

.trip-start {
  width: 500px;
  height: 90px;
  border-radius: 90px;
  margin: auto;
  background-image: linear-gradient(270deg, #6264e2 0%, #7a7bf1 100%);
  text-align: center;
  line-height: 90px;
  color: #ffffff;
  font-size: 33px;
  letter-spacing: 2px;
}
.trip-map {
  widows: 100%;
  height: 100%;
}

.fademap-enter {
  opacity: 0;
}
.fademap-enter-active {
  transition: all 0.3s;
}
.fademap-leave-to {
  opacity: 0;
}
.fademap-leave-active {
  transition: all 0.3s;
}
</style>
<style lang="scss">
.md-tab-bar {
  background-color: transparent;
}
</style>
