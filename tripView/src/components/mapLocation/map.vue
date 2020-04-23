<template>
  <div class="map">
    <div id="map"></div>
    <!-- 天气提醒 -->
    <div class="weather">{{ weatherText }}</div>
    <!-- 定位按钮 -->
    <div id="buttonDom" class="buttonDom" @click="loactionOnClick"></div>
    <div class="map-start" @click="startGoOnClick" style="z-index: 10009">
      {{ startBtn }}
    </div>
    <!-- 地址 -->
    <md-popup style="z-index:10000" v-model="addressPopupShow" position="top">
      <div class="popupText">
        <md-field>
          <!-- <md-cell-item title="定位方式" addon="html5"/> -->
          <md-cell-item title="当前地址">
            <p slot="children" style="color:#858B9C;">{{ mapAddress }}</p>
          </md-cell-item>
        </md-field>
      </div>
    </md-popup>
    <!-- 开始跑步-->
    <transition name="fadeStart">
      <div
        v-if="stratShow"
        style="z-index:10008"
        class="strat-go"
        :id="isStratGo ? 'stratGo' : ''"
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
        <p v-if="isStratGo" class="strat-go-markText">备注：{{ markText }}</p>
        <md-field v-show="!isStratGo" class="strat-go-mark">
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
      marriage: "normal", // 地图主题背景
      startBtn: "开始",
      map: null, // 当前地图实例
      watchID: null, // 实时监听定位经纬度
      mapData: {}, // 定位后所在地理信息
      mapAddress: "地点未知，请尝试重新定位或刷新页面",
      addressPopupShow: false,
      mapPopupShow: false,
      stratShow: false, // 是否开始跑步
      isStratGo: false, // 已经结束跑步
      timerObj: null, // 定时器实例
      timer: [0, 0, 0], // 时间计时器的时分秒
      timeAll: 0,
      markText: "", // 备注
      geolocationData: [], // 开始定位后设备移动收集的所有经纬坐标
      distance: 0, // 当前移动公里数
      tripType: "徒步", // 出行方式
      loactionFail: true, // 定位成功失败
      weatherText: "出行务必要注意安全(●^◡^●)"
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
    // 消耗卡路里
    kcalNow() {
      return (this.distance * 95.2).toFixed(1);
    },
    ...mapGetters(["weatherArr"])
  },
  watch: {
    marriage(newval) {
      this.map.setMapStyle(`amap://styles/${newval}`);
    }
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
    /** action */
    // 点击定位功能
    loactionOnClick() {
      Toast.loading("定位中...");
    },
    // 点击位置按钮
    popupShowOnClick() {
      this.addressPopupShow = true;
    },
    // 点击地图按钮
    mapPopupShowOnClick() {
      this.mapPopupShow = true;
    },
    // 点击开始
    startGoOnClick() {
      if (!this.loactionFail) {
        Toast.failed("定位失败，请检查权限或尝试刷新");
        return;
      }
      if (this.startBtn === "开始") {
        this.addressPopupShow = false;
        this.mapPopupShow = false;
        this.stratShow = true;
        this.watchMap();
        this.startBtn = "结束";
        this.timeSwitch();
      } else if (this.startBtn === "结束") {
        clearInterval(this.timerObj);
        this.isStratGo = true;
        // this.stratShow = false
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
    /** private */
    // h5实时定位，记录每条定位，绘制轨迹图
    watchMap() {
      // console.log('开始实时定位========')
      let that = this;
      this.watchID = navigator.geolocation.watchPosition(
        function(position) {
          let gps = [position.coords.longitude, position.coords.latitude];
          // console.log('实时定位中---')
          // console.log(gps)
          let p1 =
            that.geolocationData.length > 0
              ? that.geolocationData[that.geolocationData.length - 1].toString()
              : "";
          let p2 = gps.toString();
          if (p1 === p2) {
            // console.log('定位距离过近')
          } else {
            // 存放轨迹经纬度坐标，经纬度坐标转换
            window.AMap.convertFrom(gps, "gps", function(status, result) {
              if (result.info === "ok") {
                let tmpGps = [result.locations[0].Q, result.locations[0].P];
                // console.log(tmpGps)
                that.geolocationData.push(tmpGps);
                that.mapLoactionDistance(that.geolocationData);
              } else {
                // console.log('轨迹路径经纬度转换失败！！')
              }
            });
            // that.geolocationData.push(gps)
            // that.mapLoactionDistance(that.geolocationData)
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
        resizeEnable: true, // 是否监控地图容器尺寸变化
        // mapStyle: 'amap://styles/light', // 设置地图的显示样式
        zoom: 11, // 初始化地图层级
        // viewMode: '3D', // 地图模式
        // pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        center: [126.56092959999998, 43.920187299999995] // 初始地图中心点
      });
      var trafficLayer = new window.AMap.TileLayer.Traffic({
        zIndex: 10
      });
      trafficLayer.setMap(this.map);
      this.map.plugin(["AMap.Geolocation", "AMap.ControlBar"], function() {
        var geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：5s
          buttonPosition: "LT", // 定位按钮的停靠位置
          buttonDom: buttonDom,
          buttonOffset: new window.AMap.Pixel(100, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
        });
        // 定位插件----
        that.map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status, result) {
          // Toast.hide()
        });
        window.AMap.event.addListener(
          geolocation,
          "complete",
          that.localOnComplete
        ); // 返回定位信息
        window.AMap.event.addListener(geolocation, "error", that.localOnError); // 返回定位出错信息
        // 罗盘插件-----
        // that.map.addControl(new window.AMap.ControlBar())
      });
      this.map.on("complete", function() {
        // 地图图块加载完成后触发
        // console.log('地图加载完成')
      });
    },
    // 移动轨迹图
    mapPath() {
      let that = this;
      let lineArr = this.geolocationData.slice();
      let marker = new window.AMap.Marker({
        map: that.map,
        position: lineArr[0],
        icon: "https://i.loli.net/2020/04/21 /s9EP8CQFrdDThHS.png",
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
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 // 线宽
        // strokeStyle: "solid"  //线样式
      });
      let passedPolyline = new window.AMap.Polyline({
        map: that.map,
        // path: lineArr,
        strokeColor: "red", // 线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 // 线宽
        // strokeStyle: "solid"  //线样式
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
      // console.log('手动定位成功')
      // console.log(e)
      this.mapData = e.addressComponent;
      this.mapAddress = e.formattedAddress;
      Toast.hide();
    },
    // 手动定位失败
    localOnError(e) {
      this.loactionFail = false;
      // console.log('手动定位出错')
      // console.log(e)
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
      // console.log(params)
      this.$http.get("/trip/addTrip", params).then(res => {
        // console.log(res)
        if (res.data.code === 200) {
          Toast.succeed("本次出行记录已上传");
          this.setUserData(res.data.data);
        } else {
          Toast.failed("记录上传出错");
        }
      });
    },
    toastWeather() {
      // let weatherText = this.weatherText
      // console.log(this.weatherArr)
      if (this.weatherArr.length > 0) {
        let weather = this.weatherArr[0];
        // console.log(weather)
        this.weatherText = weather.weather;
        // console.log(this.weatherText)
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
  .map-tool {
    width: 580px;
    height: 70px;
    position: fixed;
    top: 220px;
    left: calc(50%-280px);
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0px 0px 20px #afaeae;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      width: 100%;
      text-align: center;
      color: #4b4949;
      font-size: 26px;
      span {
        margin-left: 10px;
      }
    }
    p:nth-child(1) {
      border-right: 1px solid rgb(182, 180, 180);
    }
    p:nth-child(2) {
      border-right: 1px solid rgb(182, 180, 180);
    }
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
.buttonDom {
  width: 176px;
  height: 70px;
  position: fixed;
  top: 200px;
  left: 480px;
  background: transparent;
}
.popupText {
  // width: 00px;
  min-height: 200px;
  background: #ffffff;
  padding: 20px;
  font-size: 25px;
  box-sizing: border-box;
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
