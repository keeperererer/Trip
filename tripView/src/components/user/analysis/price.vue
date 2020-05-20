<template>
  <div class="trend">
    <div class="trend-title">
      <h2>交通费用</h2>
    </div>
    <lineChart ref="echart" class="trend-echart"></lineChart>
  </div>
</template>
<script>
import lineChart from "./lineChart1";
import { Toast } from "mand-mobile";
export default {
  name: "Trend",
  components: {
    lineChart
  },
  data() {
    return {
      chart: null,
      xAxisData: ["公交/地铁", "出租车", "单车/电车"],
      Data: null,
      data1: {
        seriesData: [
          {
            type: "line",
            data: [0, 0, 0]
          }
        ]
      },
      allData: null
    };
  },
  mounted() {
    Toast.loading("数据分析中...");
    this.fetchData();
  },
  methods: {
    updatefetchData() {
      let sum = 0;
      let sum1 = 0;
      let sum2 = 0;
      let sum3 = 0;
      let tmpItem = {
        "公交/地铁": {
          data: {}
        },
        出租车: {
          data: {}
        },
        "单车/电车": {
          data: {}
        }
      };
      for (let item in tmpItem) {
        tmpItem[item] = 0;
        console.log("item", item + "" + tmpItem[item]);
        if (this.allData) {
          this.allData.forEach(index => {
            console.log("index", index);
            if (item == index.tripType) {
              console.log(item + "" + index.tripType);
              tmpItem[item] = index.price;
            }
          });
        }
      }
      console.log("allData", this.allData);
      console.log("tmpItem", tmpItem);
      this.Data = {
        seriesData: [
          {
            type: "line",
            data: [
              parseInt(tmpItem["公交/地铁"]),
              parseInt(tmpItem["出租车"]),
              parseInt(tmpItem["单车/电车"])
            ]
          }
        ]
      };
      console.log("Data", this.Data);
      this.$refs.echart.echartsUpdata(this.Data, this.xAxisData);
    },
    /** ajax */
    // 请求最近一周数据
    fetchData() {
      this.$http.get("/user/price", {}).then(res => {
        this.allData = res.data.data;
        this.$refs.echart.echartsUpdata(this.data1, this.xAxisData);
        Toast.hide();
        this.updatefetchData();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.trend {
  width: 100%;
  height: 100%;
  padding: 30px 30px;
  box-sizing: border-box;
  &-title {
    h2 {
      font-size: 40px;
      text-align: center;
    }
  }
}
.trend-echart {
  width: 100%;
  height: 60%;
}
</style>
