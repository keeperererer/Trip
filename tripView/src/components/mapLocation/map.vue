<template>
  <div class="map">
    <div id="map"></div>
    <!-- 天气提醒 -->
    <div class="weather">{{ weatherText }}</div>
    <!-- 定位位置 -->
    <div class="address">
      <svg-icon icon-class="位置 " />
      {{ mapAddress }}
    </div>
    <!-- 关键字搜索 -->
    <div class="searchKey">
      <table>
        <tr>
          <td>
            <label>关键字搜索：</label>
          </td>
        </tr>
        <tr>
          <td>
            <input id="tipinput" />
          </td>
        </tr>
      </table>
    </div>
    <!-- 定位按钮 -->
    <div id="buttonDom" class="buttonDom" @click="loactionOnClick">
      <svg-icon icon-class="圆圈 " />
    </div>
    <!-- 开始出行 -->
    <div class="map-start" @click="startGoOnClick" style="z-index: 10009">
      {{ startBtn }}
    </div>
    <!-- 弹出层-->
    <transition name="fadeStart">
      <div
        v-if="startShow"
        style="z-index:10008"
        class="strat-go"
        :id="isStartGo ? 'stratGo' : ''"
      >
        <div class="strat-go-top">
          <p>
            <span>{{ distance === 0 ? "0.00" : distance }}</span> 公里
          </p>
        </div>
        <div class="strat-go-detail">
          <p>
            <span>{{ timerNow }}</span>
            <br />
            <span>总计时间</span>
          </p>
          <p>
            <span>{{ speedNow }}</span>
            <br />
            <span>平均配速(km/h)</span>
          </p>
          <p>
            <span>{{ kcalNow }}</span>
            <br />
            <span>消耗能量(k)</span>
          </p>
        </div>
        <p v-if="isStartGo" class="strat-go-markText">备注：{{ markText }}</p>
        <md-field v-show="!isStartGo" class="strat-go-mark">
          <md-input-item
            v-model="markText"
            title="备注"
            placeholder="输入此次行程备注，不超过40字"
            :maxlength="40"
          ></md-input-item>
        </md-field>
      </div>
    </transition>
  </div>
</template>
<script>
import { Toast } from "mand-mobile";
import { setInterval, clearInterval } from "timers";
import { getTime } from "@/utils/validate.js";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "mapLocation",
  data() {
    return {
      marriage: "fresh", // 地图主题背景
      startBtn: "开始",
      map: null, // 当前地图实例
      watchID: null, // 实时监听定位经纬度
      mapData: {}, // 定位后所在地理信息
      startShow: false, // 是否开始出行
      isStartGo: false, // 已经结束出行
      timerObj: null, // 定时器实例
      timer: [0, 0, 0], // 时间计时器的时分秒
      timeAll: 0,
      markText: "", // 备注
      geolocationData: [], // 开始定位后设备移动收集的所有经纬坐标
      distance: 0, // 当前移动公里数
      tripType: "徒步", // 出行方式
      loactionFail: true, // 定位成功失败
      weatherText: "出行务必要注意安全(●^◡^●)",
      mapAddress: ""
    };
  },
  computed: {
    // 时分秒，计时器
    timerNow() {
      let tmpArr = [];
      this.timer.forEach((item, index) => {
        if (item < 10) {
          tmpArr[index] = `0${item}`;
        } else {
          tmpArr[index] = item;
        }
      });
      if (tmpArr[0] === "00") {
        return `${tmpArr[1]}:${tmpArr[2]}`;
      }
      return `${tmpArr[0]}:${tmpArr[1]}:${tmpArr[2]}`;
    },
    // 计算配速
    speedNow() {
      let tmpTimer = this.timeAll / 3600;
      let speed = (this.distance / tmpTimer).toFixed(2);
      if (isNaN(speed) || speed > 1000000) {
        speed = 0;
      }
      return `${speed}`;
    },
    // 消耗卡  路里
    kcalNow() {
      return (this.distance * 95.2).toFixed(1);
    },
    ...mapGetters(["weatherArr"])
  },
  mounted() {
    this.tripType = this.$route.params.tripType;
    if (!this.tripType) {
      this.$router.push({ path: "/trip" });
    } else {
      this.createTrip();
      this.toastWeather();
      this.ToastHide();
    }
  },
  methods: {
    // 点击定位功能
    loactionOnClick() {
      Toast.loading("定位中...");
    },
    // 点击开始
    startGoOnClick() {
      if (!this.loactionFail) {
        Toast.failed("定位失败，请检查权限或尝试刷新");
        return;
      }
      if (this.startBtn === "开始") {
        this.startShow = true;
        this.watchMap();
        this.startBtn = "结束";
        this.timeSwitch();
      } else if (this.startBtn === "结束") {
        clearInterval(this.timerObj);
        this.isStartGo = true;
        this.locationOnDelete(); // 停止定位
        this.mapPath(); // 绘制轨迹
        this.startBtn = "退出";
        // 存入后台
        if (this.distance === 0) {
          Toast.failed("当前移动距离为0，数据不被上传");
          return;
        }
        this.saveTripDataAjax();
      } else {
        this.map.destroy(); // 销毁地图
        this.timer = [0, 0, 0];
        this.timeAll = 0;
        this.distance = 0;
        this.geolocationData = [];
        this.startBtn = "开始";
        this.$router.push({ path: "/trip" });
      }
    },
    // h5实时定位，记录每条定位，绘制轨迹图
    watchMap() {
      let that = this;
      this.watchID = navigator.geolocation.watchPosition(
        function(position) {
          let gps = [position.coords.longitude, position.coords.latitude];
          let p1 =
            that.geolocationData.length > 0
              ? that.geolocationData[that.geolocationData.length - 1].toString()
              : "";
          let p2 = gps.toString();
          if (p1 !== p2) {
            // 存放轨迹经纬度坐标，经纬度坐标转换
            window.AMap.convertFrom(gps, "gps", function(status, result) {
              if (result.info === "ok") {
                let tmpGps = [result.locations[0].Q, result.locations[0].P];
                that.geolocationData.push(tmpGps);
                that.mapLoactionDistance(that.geolocationData);
              }
            });
          }
        },
        function() {
          Toast.failed("实时定位出错，请尝试刷新");
          that.mapOnDelete();
        }
      );
    },
    // 创建地图实例
    createTrip() {
      Toast.loading("加载中...");
      let that = this;
      let buttonDom = document.getElementById("buttonDom");
      this.map = new window.AMap.Map("map", {
        resizeEnable: true,
        zoom: 11, // 初始化地图层级
        center: [126.56092959999998, 43.920187299999995], // 初始地图中心点
        //地图主题
        mapStyle: `amap://styles/${this.marriage}`
      });
      //实时路况
      var trafficLayer = new window.AMap.TileLayer.Traffic({
        zIndex: 10
      });
      trafficLayer.setMap(this.map);
      //关键字搜索
      var autoOptions = {
        input: "tipinput"
      };
      this.map.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], function() {
        var auto = new window.AMap.Autocomplete(autoOptions);
        var placeSearch = new window.AMap.PlaceSearch({
          map: that.map
        });
        //注册监听，当选中某条记录时会触发
        window.AMap.event.addListener(auto, "select", select);
        function select(e) {
          console.log(e);
          placeSearch.setCity(e.poi.adcode);
          placeSearch.search(e.poi.name);
        }
      });
      //关键字搜索结束
      this.map.plugin(["AMap.Geolocation", "AMap.ControlBar"], function() {
        var geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: "RB", // 定位按钮的停靠位置
          buttonDom: buttonDom,
          buttonOffset: new window.AMap.Pixel(100, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        });
        // 定位插件
        that.map.addControl(geolocation);
        window.AMap.event.addListener(
          geolocation,
          "complete",
          that.localOnComplete
        ); // 返回定位信息
        window.AMap.event.addListener(geolocation, "error", that.localOnError); // 返回定位出错信息
      });
    },
    // 移动轨迹图
    mapPath() {
      let that = this;
      let lineArr = this.geolocationData.slice();
      let marker = new window.AMap.Marker({
        map: that.map,
        position: lineArr[0],
        // icon: "https://webapi.amap.com/images/car.png",
        offset: new window.AMap.Pixel(-26, -13),
        autoRotation: true,
        angle: -90
      });
      // 绘制轨迹
      let polyline = new window.AMap.Polyline({
        map: that.map,
        path: lineArr,
        showDir: true,
        strokeColor: "#28F", // 线颜色
        strokeWeight: 6 // 线宽
      });
      let passedPolyline = new window.AMap.Polyline({
        map: that.map,
        strokeColor: "#6264e2", // 线颜色
        strokeWeight: 6 // 线宽
      });
      marker.on("moving", function(e) {
        passedPolyline.setPath(e.passedPath);
      });
      that.map.setFitView();
      marker.moveAlong(lineArr, 200);
    },
    // 经纬度路程与公里数换算,保留两位小数
    mapLoactionDistance(loactionArr) {
      let tmpArr = [];
      loactionArr.forEach(item => {
        let tmpItem = new window.AMap.LngLat(item[0], item[1]);
        tmpArr.push(tmpItem);
      });
      this.distance = (
        window.AMap.GeometryUtil.distanceOfLine(tmpArr) / 1000
      ).toFixed(2);
      // console.log(this.distance + '公里')
    },
    // 监听手动定位成功
    localOnComplete(e) {
      this.loactionFail = true;
      // console.log(e);
      this.mapData = e.addressComponent;
      this.mapAddress = e.formattedAddress;
      Toast.hide();
    },
    // 手动定位失败
    localOnError(e) {
      this.loactionFail = false;
      Toast.hide();
      Toast.failed("定位失败请检查权限或尝试刷新");
    },
    // 停止实时定位
    locationOnDelete() {
      let that = this;
      navigator.geolocation.clearWatch(that.watchID);
      // console.log('停止实时定位')
    },
    // 时间计时器
    timeSwitch() {
      let that = this;
      this.timerObj = setInterval(function() {
        that.timeAll += 1;
        if (that.timer[1] === 59) {
          that.timer[1] = 0;
          that.$set(that.timer, 0, that.timer[0] + 1);
        } else if (that.timer[2] === 59) {
          that.timer[2] = 0;
          that.$set(that.timer, 1, that.timer[1] + 1);
        } else {
          that.$set(that.timer, 2, that.timer[2] + 1);
        }
      }, 1000);
    },
    // 定时取消Toast
    ToastHide() {
      setTimeout(() => {
        Toast.hide();
      }, 10000);
    },
    /** ajax */
    saveTripDataAjax() {
      let params = {
        type: "trip",
        tripType: `${this.tripType}出行`,
        distance: this.distance,
        date: getTime().date2,
        time: this.timerNow,
        trajectory: JSON.stringify(this.geolocationData),
        Calorie: this.kcalNow,
        speed: this.speedNow,
        mark: this.markText || "未备注"
      };
      this.$http.get("/trip/addTrip", params).then(res => {
        if (res.data.code === 200) {
          Toast.succeed("本次出行记录已上传");
          this.setUserData(res.data.data);
        } else {
          Toast.failed("记录上传出错");
        }
      });
    },
    toastWeather() {
      if (this.weatherArr.length > 0) {
        let weather = this.weatherArr[0];
        this.weatherText = weather.weather;
        if (this.weatherText.indexOf("雨") != -1) {
          this.weatherText = `现在正在下${this.weatherText},出行要记得带伞噢！`;
        } else if (this.weatherText.indexOf("霾") != -1) {
          this.weatherText = `今天有${this.weatherText},出行要记得戴口罩噢！`;
        } else if (this.weatherText.indexOf("雪") != -1) {
          this.weatherText = `现在有${this.weatherText},请注意保暖噢！`;
        }
      }
    },
    ...mapActions(["setUserData"])
  }
};
</script>
<style lang="scss" scoped>
.map {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  .map-title {
    position: absolute;
    top: 5px;
    left: 0;
  }
  .map-start {
    width: 200px;
    height: 200px;
    border-radius: 200px;
    background: #6264e2;
    position: fixed;
    bottom: 140px;
    left: calc(50%-100px);
    text-align: center;
    line-height: 200px;
    color: #ffffff;
    font-weight: bold;
    font-size: 40px;
    box-shadow: 0px 8px 30px #afaeae;
  }
  .strat-go {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ffffffd2;
    z-index: 10000;
    &-top {
      width: 100%;
      height: 40%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #555555;
      font-size: 35px;
      vertical-align: bottom;
      font-style: oblique;
      span {
        font-size: 200px;
        font-weight: bold;
      }
    }
    &-detail {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #555555;
      font-style: oblique;
      height: 70px;
      p {
        width: 100%;
        text-align: center;
        span:nth-child(1) {
          font-size: 50px;
          font-weight: bold;
        }
        span:nth-child(3) {
          font-size: 24px;
          font-style: initial;
        }
      }
    }
    &-mark {
      margin-top: 70px;
    }
    &-markText {
      padding: 20px;
      font-size: 24px;
    }
  }
}
#stratGo {
  transition: all 0.4s;
  height: 35%;
  background: #ffffff;
  box-shadow: 0 4px 50px #afaeae;
  .strat-go-top {
    margin-top: 6%;
    font-size: 30px;
    span {
      font-size: 150px;
    }
  }
  .strat-go-detail {
    margin-top: 7%;
    p {
      width: 100%;
      text-align: center;
      span:nth-child(1) {
        font-size: 30px;
        font-weight: bold;
      }
      span:nth-child(3) {
        font-size: 24px;
        font-style: initial;
      }
    }
  }
}
#map {
  width: 100%;
  height: calc(100%+50px);
  box-sizing: border-box;
}
.fadeStart-enter {
  transform: translateY(-100%);
}
.fadeStart-enter-to {
  transform: translateY(0);
}
.fadeStart-enter-active {
  transition: all 0.4s;
}
.weather {
  position: fixed;
  top: 0;
  text-align: center;
  width: 100%;
  color: white;
  background-color: #6264e2;
  height: 100px;
  line-height: 100px;
}
.address {
  position: fixed;
  top: 100px;
  text-align: center;
  width: 100%;
  color: #6264e2;
  height: 100px;
  line-height: 100px;
}
.searchKey {
  position: fixed;
  top: 200px;
  box-shadow: 0px 8px 30px #afaeae;
  background-color: white;
  font-size: 28px;
}
#tipinput {
  width: 220px;
  margin: 10px 5px;
  border: 1px solid #ccc;
}
.buttonDom {
  position: fixed;
  bottom: 10px;
  right: 20px;
  text-align: center;
  // width: 100%;
  color: #666;
  background-color: white;
  border: 3px solid #ccc;
  font-size: 48px;
  height: 50px;
  width: 50px;
  line-height: 50px;
}
</style>
<style lang="scss">
.strat-go {
  .md-field {
    background: transparent;
  }
  .md-field-item-content:before {
    background: #4b4949;
  }
  .md-field-item.is-solid .md-field-item-title {
    width: 10vw;
  }
}
</style>
