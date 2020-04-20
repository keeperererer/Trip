<template>
  <div class="userDetails">
    <img src="../../assets/any2.png" class="user-bg">
    <div class="user-bg1"></div>
    <div class="user-top">
      <img src="../../assets/user.jpg" class="user-top-img" />
      <div class="user-top-account">
        <p>昵称：{{ userData.name }}</p>
        <p>帐号：{{ userData.userName }}</p>
      </div>
      <span class="user-out" @click="loginOut">退出登录</span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { Toast } from "mand-mobile";
export default {
  name: "userDetails",
  data() {
    return {
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
  },
  created() {
    setTimeout(() => {
      window.L2Dwidget.init({
        pluginRootPath: "static/live2dw/",
        pluginJsPath: "lib/",
        pluginModelPath: "live2d-widget-model-koharu/assets/",
        tagMode: false,
        debug: false,
        model: {
          jsonPath:
            "../static/live2dw/live2d-widget-model-koharu/assets/koharu.model.json",
          scale: 1
        },
        display: {
          position: "left",
          width: 120,
          height: 240,
          hOffset: 50,
          vOffset: -50
        },
        mobile: { show: true },
        log: false
      });
    }, 1000);
  },
  methods: {
    loginOut() {
      localStorage.removeItem("user");
      this.setUser(null);
      Toast.succeed(`ฅ登录状态已清除,欢迎下次使用ฅ`, 3000);
      this.$router.push({ path: "/login" });
    },
    ...mapActions(["setUser"])
  }
};
</script>
<style lang="scss" scoped>
.userDetails {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #5d5c5c;
}
.user-bg {
  width: 100%;
  height: 100%;
  opacity: 0.7;
}
.user-bg1 {
  width: 100%;
}
.user-top {
  width: 100%;
  position: absolute;
  top: 100px;
  left: 35%;
}
.user-top-img {
  border-radius: 140px;
}
.user-top-account {
  height: 140px;
  width: 300px;
  p:nth-child(1) {
    font-size: 30px;
    margin-top: 50px;
    border-bottom: 1px #ccc solid;
  }
  p:nth-child(2) {
    font-size: 25px;
    margin-top: 20px;
    border-bottom: 1px #ccc solid;
  }
}
.user-out {
  color: #1a161a;
  position: absolute;
  text-decoration: underline;
}
</style>
