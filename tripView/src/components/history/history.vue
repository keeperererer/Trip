<template>
  <div class="history">
    <div v-if="$route.name === 'History'">
      <div class="history-title" style="z-index:200">
        出行记录
      </div>
      <md-field>
        <md-cell-item @click="historyDetailsOnClick(item)" v-for="(item,index) in historyList" :key="index" :title="item.tripType" :brief="item.startPlace?`${item.startPlace}—${item.endPlace}`:`${item.distance}公里`" :addon="item.date" arrow/>
      </md-field>
    </div>
    <div v-show="$route.name === 'Details'" class="trip-map">
      <router-view/> 
    </div>
    <trip-nav class="tripNav"></trip-nav>
  </div>
</template>
<script>
import TripNav from '@/components/bottomNav/nav'
export default {
  name: 'History',
  components:{
    TripNav
  },
  data () {
    return {
      historyList: []
    }
  },
  mounted () {
    this.historyListOnPatch()
  },
  methods: {
    /** action */
    historyDetailsOnClick (item) {
      // this.$router.push({ path: '/history/details', query: item })
      this.$router.push({ name: 'Details', params: item })
    },
    /** ajax */
    historyListOnPatch () {
      let that = this
      this.$http.get('/trip/historyList', {}).then(res => {
        that.historyList = res.data.data
        that.historyList.forEach((item) => {
          item.date = item.date.slice(0, 10)
          item.time = item.time.slice(0,5)
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.history {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  &-title {
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
    height: 100px;
    background-color: #6264e2;
    box-shadow: 2px 2px 2px 2px pink;
    font-size: 30px;
    color: #fff;
    line-height: 100px;
    padding: 0 50px;
    .title-svg {
      margin-left: 10px;
    }
  }
}
.box {
  height: 90px !important;
}
.trip-map {
  width: 100%;
  height: 100%;
}
.tripNav {
  bottom: 0px !important;
  position: fixed !important;
}
</style>
<style lang="scss">
.history {
  .md-field {
    padding: 0px 5.33vw;
    margin: 0 0 100px 0;
  }
}
</style>