<template>
  <div class="allTrip">
    <h2>出行总里程</h2>
    <div id="main" class="echarts-canvas"></div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import echarts from "echarts";
export default {
  data() {
    return {
      chart: null,
      distanceArr: []
    };
  },
  computed: {
    ...mapGetters(["user", "userDistance"])
  },
  mounted() {
    // this.initChart()
    this.userData = this.user;
    delete this.userDistance.userId;
    this.distanceArr = Object.values(this.userDistance);
    // console.log(this.distanceArr)
    this.$nextTick(() => {
      this.initChart(this.distanceArr);
    });
  },
  methods: {
    initChart(data, text) {
      this.chart = echarts.init(document.getElementById("main"));
      this.chart.setOption({
        tooltip: {},
        toolbox: {
          feature: {
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        title: {
          text: text,
          top: "5%"
        },
        xAxis: {
          data: ["徒步", "跑步", "骑行", "自驾", "公交", "出租"]
        },
        yAxis: {
          name: "公里"
        },
        series: [
          {
            name: "总里程",
            type: "bar",
            itemStyle: {
              color: "#f37570"
            },
            grid: {
              left: "2%",
              right: "4%",
              bottom: "0%",
              top: "0%",
              containLabel: true
            },
            data: data
          }
        ]
      });
    },
    /** public */
    // 对外接口，先销毁，再重建
    echartsUpdata(data) {
      this.eachartDestroy();
      this.initChart(data);
    },
    destroyed() {
      this.eachartDestroy();
    },
    // 销毁echart
    eachartDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.allTrip {
  width: 100%;
  height: 100%;
  padding: 30px 30px;
  box-sizing: border-box;
  overflow: hidden;
}
// img {
//   position: absolute;
//   // z-index: -1;
//   height: 100%;
// }
h2 {
  font-size: 40px;
  text-align: center;
}
.echarts-canvas {
  width: 100%;
  height: 60%;
}
</style>
