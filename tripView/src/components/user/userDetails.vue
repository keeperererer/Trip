<template>
	<div class="userDetails">
		<img src="../../assets/user-top1.png" class="user-bg">
		<div class="user-top">
			<img src="../../assets/user.jpg" class="user-top-img">
			<div class="user-top-account">
				<p>昵称：吉良吉影</p>
				<p>帐号：224999999</p>
			</div>
		</div>
	</div>
</template>
<script>

</script>
<style lang="scss" scoped>
.user-bg {
	width: 100%;
	opacity: .7;
}
.user-top {
	// width: 100%;
	width: 590px;
	height: 300px;
	position: absolute;
	top: 150px;
	left: 80px;
	// overflow: hidden;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: white;
	opacity: .9;
	 box-shadow: 2px 2px 15px #b2cdda;
}
.user-top-img {
    width: 180px;
    height: 180px;
    border-radius: 140px;
    box-shadow: 0px 0px 10px #cac8c8;
    margin-right: 30px;
}
.user-top-account {
    height: 140px;
    // color: white;
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
</style>