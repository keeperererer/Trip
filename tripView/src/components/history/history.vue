<template>
  <div class="history">
  	<div v-if="$route.name === 'History'" class="his-all"> 
  		<p class="his-top">出行记录</p>
	    <md-scroll-view
	      ref="scrollView"
	      :scrolling-x="false"
	      @end-reached="$_onEndReached"
	    >
	      <div
	        v-for="i in list"
	        :key="i"
	        class="scroll-view-list"
	      >
	        <div class="scroll-view-item"> 
				<span>出租车</span>
				<span>长沙理工大学 -- 五一广场五一广场五一广场五一广场五一广场</span>
				<span>12km</span>
				<span>2019/12/01</span>
	        </div>
	      </div>
	      <md-scroll-view-more
	        slot="more"
	        :is-finished="isFinished"
	      >
	      </md-scroll-view-more>
	    </md-scroll-view>
	</div>
  </div>
</template>

<script>
import {ScrollView, ScrollViewMore} from 'mand-mobile'

export default {
  name: 'scroll-view-demo-2',
  components: {
    [ScrollView.name]: ScrollView,
    [ScrollViewMore.name]: ScrollViewMore,
  },
  data() {
    return {
      list: 14,
      isFinished: false,
    }
  },
  methods: {
    $_onEndReached() {
      if (this.isFinished) {
        return
      }
      // async data
      setTimeout(() => {
        this.list += 5
        if (this.list >= 20) {
          this.isFinished = true
        }
        this.$refs.scrollView.finishLoadMore()
      }, 1000)
    },
  },
}

</script>

<style lang="scss" scoped>
.history {
	width: 100%;
	height:100%;
	
}
.his-top {
	box-sizing: border-box;
	width: 100%;
	height: 100px;
	background-color: #26539e;
	font-size: 30px;
	color: #fff;
	line-height: 100px;
	padding: 0 50px;
}
.scroll-view-item {
	height: 140px;
	margin: 10px 50px;
	line-height: 140px;
	// background-color: pink;
	border-bottom: 1px solid #ccc;
	display: flex;
	// flex-wrap: wrap;
	overflow: hidden;
	span {
		font-size: 30px;
	}
	span:nth-child(1){
		font-weight: 600;
		color: #3f51b5;
		float: left;

	}
	span:nth-child(2){
		margin: 0 20px;
		width: 400px;
		font-weight: 100;
		font-size: 25px;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	    color: #9e9e9ea6;

	}
	span:nth-child(3){
		float: right;
		color: #716b6b;
	}
	span:nth-child(4){
		position: absolute;
		top: 40px;
		font-size: 12px;
		color: #9e9e9ea6;
	}
}
</style>