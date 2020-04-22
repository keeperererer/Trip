<template>
  <div class="userDetails">
    <img src="../../assets/any3.png" class="user-bg" />
    <div class="user-bg1"></div>
    <div class="user-top">
      <div class="loadAvatar" data-text="上传头像" @click="loadAvatar">
        <input type="file" accept="image/*" class="loadInput" />
        <img :src="avatar" class="user-top-img" />
      </div>
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
      avatar: "",
      userData: {
        userId: null,
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
    console.log(this.userData);
    this.getAvatar();
    // this.loadAvatar();
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
    loadAvatar() {
      let that = this;
      const input = document.querySelector("input[type=file]");
      const img = document.querySelector(".user-top-img");
      input.addEventListener("change", ev => {
        // console.dir(input);
        const file = input.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        console.log(fileReader.readyState);
        fileReader.onload = () => {
          // img.src = fileReader.result;
          // console.log(fileReader.result);
          this.$http
            .post("/user/upAvatar", {
              userId: that.userData.userId,
              avatar: fileReader.result
            })
            .then(res => {
              console.log(res);
              if (res.data == "success") {
                that.avatar = fileReader.result;
              }
            });
        };
      });
      this.getAvatar();
    },
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
  position: fixed;
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
  // width: 100%;
  position: absolute;
  top: 100px;
  left: 35%;
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
.loadAvatar {
  // width: 80px;
  // height: 80px;
  margin-bottom: 10px;
  margin-top: 85px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  // left: -240px;
  &::before {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    content: attr(data-text);
    // transform: translateY(-100%);
    color: whitesmoke;
    font-size: 0.8rem;
  }
  .user-top-img {
    width: 250px;
    border-radius: 140px;
  }
}
.loadInput {
  position: absolute;
  cursor: pointer;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  width: 3.5rem;
  clear: both;
  display: block;
  margin: auto;
}
</style>
