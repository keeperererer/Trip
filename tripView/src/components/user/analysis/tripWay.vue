<template>
  <div class="echart">
    <h2>出行方式</h2>
    <div id="main" class="echart-con"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import echarts from 'echarts'
export default {
  name: 'LineChart',
  data () {
    return {
      chart: null,
    }
  },
  mounted () {
    // console.log(this.userDistance)
    let tmpDistance = Object.assign({}, this.userDistance)
    delete tmpDistance.userId
    this.$nextTick(() => {
      this.echartsUpdata(tmpDistance)
    })
    // this.$nextTick(() => {
    //   this.initChart(
    //     Object.values(tmpDistance)
    //   )
    // })
  },
  computed: {
    ...mapGetters(['user', 'userDistance'])
  },
  methods: {
    initChart (data) {
      this.chart = echarts.init(document.getElementById('main'))
      this.chart.setOption({
        // title: {
        //   text: '出行方式分布图',
        //   x: 'center'
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        toolbox: {
          feature: {
            saveAsImage: { show: true }
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['步行', '跑步', '单车/电车', '自驾/出租', '公交/地铁']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: data.allWalk, name: '步行' },
              { value: data.allRun, name: '跑步' },
              { value: data.allCycle, name: '单车/电车' },
              { value: parseInt(data.allDrive) + parseInt(data.allTaxi), name: '自驾/出租' },
              { value: data.allBus, name: '公交/地铁' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    /** public */
    // 对外接口，先销毁，再重建
    echartsUpdata (data) {
      this.eachartDestroy()
      this.initChart(data)
    },
    destroyed () {
      this.eachartDestroy()
    },
    // 销毁echart
    eachartDestroy () {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    }
  }
}
</script>

<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 550px;
  &-con {
    width: 100%;
    height: 550px;
  }
}
.echart {
  width: 100%;
  height: 100%;
  padding: 30px 30px;
  box-sizing: border-box;
}
h2 {
  font-size: 40px;
  text-align: center;
}
.echart-con {
  width: 100%;
  height: 60%;
}
</style>
