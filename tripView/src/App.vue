<template>
  <div id="app">
    <div class="box">
      <transition name="fademap">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Trip",
  mounted() {
    // 验证本地是否已经登录过
    let tmpUser = localStorage.getItem("user");
    if (tmpUser && tmpUser != null && tmpUser != undefined) {
      this.setUser(JSON.parse(tmpUser));
      // 请求用户里程数据
      this.allDistanceAjax();
    } else {
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    allDistanceAjax() {
      this.$http.get("/trip/allDistance", {}).then(res => {
        this.setUserData(res.data.data);
      });
    },
    ...mapActions(["setUser", "setUserData"])
  }
};
</script>

<style>
@import "style/reset.css";
.box {
  width: 100%;
  height: 100vh;
  overflow: auto;
  position: relative;
  color: #555555;
  font-size: 24px;
  /* overflow-x: hidden; */
}
.text-container {
  background: #fff;
}
.fademap-enter {
  opacity: 0;
}
.fademap-enter-active {
  transition: all 0.2s;
}
</style>
