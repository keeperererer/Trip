<template>
	<div class="user">
		<!-- <img src="" alt=""> -->
		<div class="user-bg"></div>
		<div class="user-content">
			<div class="user-title">
				<img src="../../assets/user.jpg" @click="toDetailOnClick('userDetails')">
				<div class="user-title-account">
					<p>昵称：小吉</p>
					<p>帐号：18773816666</p>
				</div>
			</div>
			<div class="user-tool">
				<p>
					<svg-icon icon-class="xiangguanfenxi " class = "tool-svg"/>
					<span>信息总览</span>
				</p>
				<p>
					<svg-icon icon-class="合成分析 " class = "tool-svg"/>
					<span>出行与交通</span>
				</p>
				<p>
					<svg-icon icon-class="xiangguanfenxi " class = "tool-svg"/>
					<span>信息总览</span>
				</p>
				<p>
					<svg-icon icon-class="xiangguanfenxi " class = "tool-svg"/> 
					<span>信息总览</span>
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
					<span>联系我们</span>
				</p>
				<span class="more-bg"></span>
				<p>
					<svg-icon icon-class="call" class="more-svg" />
					<span>联系我们</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'User',
  data () {
    return {
      userData: null,
      headImg: '../../assets/img/head.jpeg'
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted () {
    this.userData = this.user
  },
  methods: {
    toDetailOnClick (item) {
      this.$router.push({ path: `/${item}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.user {
	width: 100%;
	height: 100%;
	position: relative;
	overflow: hidden;
	&-bg {
		width:100%;
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
	          font-size: 20px;
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
    		width:300px;
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
				color: skyblue;
			}
			span {
				font-size: 20px;
			}
    	}
    }
    &-more {
		width: 100%;
		height: 300px;
		position: absolute;
		top: 780px;
		left: 60px;
		.more-bg{
				width: 50px;
				height: 50px;
				background-color: #2196f3;
				border-radius: 50px;
				display: inline-block;
				opacity: .2;
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
</style> 