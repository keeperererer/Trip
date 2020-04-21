<template>
  <div class="user">
    <!-- <img src="" alt=""> -->
    <div class="user-bg"></div>
    <div class="user-content">
      <div class="user-title">
        <img :src="avatar" @click="toDetailOnClick('userDetails')" />
        <div class="user-title-account">
          <p>昵称：{{ userData.name }}</p>
          <p>帐号：{{ userData.userName }}</p>
        </div>
      </div>
      <div class="user-tool">
        <p @click="toDetailOnClick('allTrip')">
          <svg-icon icon-class="xiangguanfenxi " class="tool-svg" />
          <span>信息总览</span>
        </p>
        <p @click="toDetailOnClick('trend')">
          <svg-icon icon-class="合成分析 " class="tool-svg" />
          <span>出行趋势</span>
        </p>
        <p @click="toDetailOnClick('tripWay')">
          <svg-icon icon-class="fenxi1 " class="tool-svg" />
          <span>出行方式</span>
        </p>
        <p @click="toDetailOnClick('price')">
          <svg-icon icon-class="fenxi2 " class="tool-svg" />
          <span>交通费用</span>
        </p>
      </div>
      <div class="user-more">
        <span class="more-bg"></span>
        <p>
          <svg-icon icon-class="call" class="more-svg" />
          <span>联系我们</span>
        </p>
        <span class="more-bg"></span>
        <p>
          <svg-icon icon-class="call" class="more-svg" />
          <span>加入我们</span>
        </p>
        <span class="more-bg"></span>
        <p>
          <svg-icon icon-class="call" class="more-svg" />
          <span>给点建议</span>
        </p>
      </div>
    </div>
    <trip-nav class="tripNav"></trip-nav>
  </div>
</template>

<script>
import TripNav from "@/components/bottomNav/nav";
import { mapGetters } from "vuex";
export default {
  name: "User",
  components: {
    TripNav
  },
  data() {
    return {
      avatar: "",
      userData: {
        name: null,
        userName: null
      }
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {
    this.userData = this.user;
    this.getAvatar();
  },
  methods: {
    getAvatar() {
      let that = this;
      this.$http
        .get("/user/getAvatar", { userId: that.user.userId })
        .then(res => {
          // console.log(res.data.data[0].avatar);
          that.avatar = res.data.data[0].avatar;
          // console.log(that.avatar);
        });
    },
    toDetailOnClick(item) {
      this.$router.push({ path: `/${item}` });
    }
  }
};
</script>
<style lang="scss" scoped>
.user {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  &-bg {
    width: 100%;
    height: 30%;
    background-image: linear-gradient(0deg, #c2e9fb 0%, #a1c4fd 100%);
    border-radius: 0 0 200px 200px;
  }
  &-title {
    width: 100%;
    height: 150px;
    position: absolute;
    top: 80px;
    left: 80px;
    display: flex;
    justify-content: start;
  }
  img {
    width: 140px;
    height: 140px;
    border-radius: 140px;
    box-shadow: 0px 0px 10px #cac8c8;
    margin-right: 30px;
  }
  &-title-account {
    height: 140px;
    color: white;
    p:nth-child(1) {
      // font-weight: bold;
      font-size: 30px;
      margin-top: 20px;
    }
    p:nth-child(2) {
      font-size: 25px;
      margin-top: 15px;
    }
  }
  &-tool {
    height: 500px;
    width: 100%;
    position: absolute;
    top: 280px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    p {
      background-color: white;
      width: 300px;
      height: 200px;
      border-radius: 20px;
      margin-left: 20px;
      margin-right: 20px;
      box-shadow: 2px 2px 15px #b2cdda;
      display: flex;
      justify-content: center;
      align-items: center;
      .tool-svg {
        padding-right: 50px;
        font-size: 60px;
        color: pink;
      }
      span {
        font-size: 25px;
      }
    }
  }
  &-more {
    width: 100%;
    height: 300px;
    position: absolute;
    top: 780px;
    left: 60px;
    .more-bg {
      width: 50px;
      height: 50px;
      background-color: #6d1bff;
      border-radius: 50px;
      display: inline-block;
      opacity: 0.2;
      position: absolute;
    }
    p {
      height: 90px;
      margin-bottom: 10px;
      .more-svg {
        padding-right: 30px;
        font-size: 30px;
        padding-left: 8px;
        padding-top: 5px;
      }
    }
  }
}
.tripNav {
  bottom: -824px !important;
}
</style>
