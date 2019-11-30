<template>
  <div id="app">
    <div class="box">
      <transition name="fademap">
        <router-view/>
      </transition>
    </div>
    <trip-nav></trip-nav>
  </div>
</template>

<script>
import TripNav from './components/bottomNav/nav'
export default {
  name: 'Trip',
  components:{
    TripNav
  }
}
</script>

<style>
@import "style/reset.css";
.box {
  width: 100%;
  height: calc(100vh-100px);
  overflow: auto;
  position: relative;
  color: #555555;
  font-size: 24px;
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