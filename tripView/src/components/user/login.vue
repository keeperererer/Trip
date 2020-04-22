<template>
  <div class="login">
    <ul class="bg-bubbles">
      <li v-for="(item, index) in bubbles" :key="index"></li>
    </ul>
    <div class="login-bg">
      <div class="login-logo">
        <img src="../../assets/login-logo1.svg" alt />
      </div>
      <md-field class="login-input">
        <md-input-item
          v-model="user.name"
          type="name"
          ref="nick"
          title="昵称"
          placeholder="请输入昵称"
        ></md-input-item>
        <md-input-item
          v-model="user.phone"
          type="phone"
          ref="name"
          title="手机号"
          placeholder="请输入手机号"
        ></md-input-item>
        <md-input-item
          v-model="user.password"
          type="password"
          ref="id"
          title="密码"
          placeholder="请输入密码"
        ></md-input-item>
      </md-field>
      <div class="login-btn">
        <span @click="loginOnClick">
          登录 / 注册
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";
import { Toast } from "mand-mobile";
export default {
  name: "Login",
  data() {
    return {
      userData: null,
      user: {
        phone: "18773816666",
        name: "小吉",
        password: "12345"
      },
      bubbles: []
    };
  },
  mounted() {},
  created() {
    this.bubbles.length = 10;
  },
  methods: {
    ...mapMutations({
      SET_USER_DATA: "SET_USER_DATA"
    }),
    loginOnClick() {
      Toast.succeed(`新用户将自动注册`);
      this.loginAjax();
    },
    loginAjax() {
      let params = {
        name: this.user.name,
        userName: this.user.phone,
        passWord: this.user.password
      };
      this.$http.post("/user", params).then(res => {
        this.userData = res.data.data;
        //将js对象转换为字符串
        let tmpUser = JSON.stringify(this.userData);
        let token = res.data.token;
        // 登录信息存到本地
        localStorage.setItem("user", tmpUser);
        localStorage.setItem("tripToken", token);
        // 存到vuex
        this.setUser(this.userData);

        let goInUser = new Promise(reslove => {
          this.$http
            .get("/trip/allDistance", { userId: this.userData.id })
            .then(res => {
              let obj = res.data.data;
              this.SET_USER_DATA(obj);
              reslove();
              // this.setUserData(res.data.data)
            });
        });
        goInUser.then(_ => {
          setTimeout(() => {
            Toast.succeed(`欢迎*★,(￣▽￣)/$:*. 。，${this.user.name}`, 3000);
            this.$router.push({ path: "/trip" });
          }, 1000);
        });
      });
    },
    ...mapActions(["setUser", "setUserData"])
  }
};
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-size: 100% 100%;
  color: #062a49;
  &-input {
    margin-top: 60px;
    background-color: rgba(255, 255, 255, 0);
  }
  &-title {
    margin-top: 250px;
    text-align: center;
  }
  &-btn {
    position: relative;
    width: 700px;
    font-size: 30px;
    margin: 0 auto;
    text-align: center;
    line-height: 100px;
    background-color: #6264e2;
    height: 100px;
    border-radius: 20px;
    color: white;
  }
}
.login-logo {
  height: 100px;
  width: 150px;
  background-color: #6264e2;
  margin: 0 auto;
  border-radius: 10px;
}
.login-bg {
  margin-top: 200px;
}
// img {
//   margin: -40px 0;
// }
img {
  width: 100px;
  margin-left: 25px;
}
.bg-bubbles {
  position: absolute;
  // 使气泡背景充满整个屏幕
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  li {
    position: absolute;
    // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
    bottom: -160px;
    // 默认的气泡大小；
    width: 40px;
    height: 40px;
    // background-color: rgba(255, 255, 255, 0.15);
    background-color: #03a9f4;
    list-style: none;
    // 使用自定义动画使气泡渐现、上升和翻滚；
    animation: square 15s infinite;
    transition-timing-function: linear;
    // 分别设置每个气泡不同的位置、大小、透明度和速度，以显得有层次感；
    &:nth-child(1) {
      left: 10%;
    }
    &:nth-child(2) {
      left: 20%;
      width: 90px;
      height: 90px;
      animation-delay: 2s;
      animation-duration: 7s;
    }
    &:nth-child(3) {
      left: 25%;
      animation-delay: 4s;
    }
    &:nth-child(4) {
      left: 40%;
      width: 60px;
      height: 60px;
      animation-duration: 8s;
      background-color: #c28bd2;
    }
    &:nth-child(5) {
      left: 70%;
      background-color: #c28bd2;
    }
    &:nth-child(6) {
      left: 80%;
      width: 120px;
      height: 120px;
      animation-delay: 3s;
      background-color: #d7df89;
    }
    &:nth-child(7) {
      left: 32%;
      width: 160px;
      height: 160px;
      animation-delay: 2s;
      background-color: #c28bd2;
    }
    &:nth-child(8) {
      left: 55%;
      width: 20px;
      height: 20px;
      animation-delay: 4s;
      animation-duration: 15s;
      background-color: #d7df89;
    }
    &:nth-child(9) {
      left: 25%;
      width: 30px;
      height: 30px;
      animation-delay: 2s;
      animation-duration: 12s;
      background-color: #d7df89;
    }
    &:nth-child(10) {
      left: 85%;
      width: 160px;
      height: 160px;
      animation-delay: 5s;
    }
  }
  // 自定义 square 动画；
  @keyframes square {
    0% {
      opacity: 0.5;
      transform: translateY(0px) rotate(45deg);
    }
    25% {
      opacity: 0.75;
      transform: translateY(-400px) rotate(90deg);
    }
    50% {
      opacity: 1;
      transform: translateY(-600px) rotate(135deg);
    }
    100% {
      opacity: 0;
      transform: translateY(-1000px) rotate(180deg);
    }
  }
}
</style>
