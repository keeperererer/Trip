<!-- <template>
  <div class="btm-nav">
    <md-tab-bar v-model="currentTab" :items="items" :has-ink="false" @change="navOnChage">
      <template slot="item" slot-scope="{ item }">
        <div class="custom-item">
          <div class="icon">
            <md-icon :name="item.icon"/>
          </div>
          <div class="text">
            <span v-text="item.label"></span>
          </div>
        </div>
      </template>
    </md-tab-bar>
  </div>
</template> -->



<template>
  <div class="btm-nav">
    <div class="barTab" v-for="(item,index) in items" :key="index" @click="navOnChange(item)">
      <svg-icon :icon-class="item.icon" class="barIcon"/>
      <span class="barName">{{item.label}}</span>
    </div>
  </div>
</template>
<script>
import { TabBar, Icon } from 'mand-mobile'

export default {
  name: 'barTab',
  components: {
    [TabBar.name]: TabBar,
    [Icon.name]: Icon
  },
  data () {
    return {
      currentTab: 1,
      items: [
        { name: 1, label: '出行', icon: 'footprint' },
        { name: 2, label: '交通', icon: 'navigation' },
        { name: 3, label: '历史', icon: 'news' },
        { name: 4, label: '我的', icon: 'coffeecup' }
      ]
    }
  },
  methods: {
    navOnChange (e) {
      switch (e.name) {
        case 1:
          this.$router.push({ path: '/trip' })
          break
        case 2:
          this.$router.push({ path: '/traffic' })
          break
        case 3:
          this.$router.push({ path: '/history' })
          break
        case 4:
          this.$router.push({ path: '/user' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btm-nav {
  width: 100%;
  height: 105px;
  position: relative;
  bottom: -92%;
  background-color: white;
}
.icon {
  text-align: center;
}
.barTab {
  width: 25%;
  height: 100px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}
.barIcon {
  position: absolute;
  font-size: 50px;
  top: 20px;
}
.barName {
  position: absolute;
  top: 67px; 
}
</style>
