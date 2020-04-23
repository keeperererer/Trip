<template>
  <div
    class="md-example-child md-example-child-result-page md-example-child-result-page-0"
  >
    <md-result-page type="lost"> </md-result-page>
    <div @click="back" class="back">返回主页</div>
  </div>
</template>

<script>
import { ResultPage } from "mand-mobile";

export default {
  name: "result-page-demo",
  /* DELETE */
  title: "404",
  /* DELETE */
  components: {
    [ResultPage.name]: ResultPage
  },
  methods: {
    back() {
      this.$router.push({ path: "/" });
    }
  }
};
</script>

<style lang="scss" scoped>
.md-example-child-result-page-0 {
  background: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: -100px;
}
.back {
  font-size: 30px;
  margin-top: 10px;
  color: #666;
}
</style>
