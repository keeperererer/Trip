<template>
	<div class="login">
	    <div class="login-bg">
	      <md-field class="login-input">
	        <md-input-item
	          v-model="user.name"
	          type="name"
	          ref="name"
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
	          <!-- <svg-icon  class="svg-btn" icon-class="login-btn"/> -->
	          登录/注册
	        </span>
	      </div>
	    </div>		
	</div>
</template>
<script>
import { mapActions } from 'vuex'
import { Toast } from 'mand-mobile'	
export default {
	name: 'Login',
	data () {
		return {
			userData: null,
			user: {
				phone: '18773816666',
				name: '小吉',
				password: '12345'
			}
		}
	},
	mounted (){
		this.$http.get('/userId');
	},
	methods: {
		// upCheck () {
		// 	this.$http.get('/');
		// },
		loginOnClick () {
			this.loginAjax()
		},
		loginAjax () {
			let params = {
				userName : this.user.phone,
				password: this.user.password
			}
			this.$http.get('/user',params).then(res => {
				this.userData = res.data.data
				let tmpUser = JSON.stringify(this.userData)
				localStorage.setItem('user',tmpUser)
				this.setUser(this.userData)
				// this.allDistanceAjax()
				Toast.succeed(`欢迎回来(●'◡'●),${this.userData.name}`,1500)
				this.$router.push({path:'/trip'})
				this.allDistanceAjax()
			})
		},
		allDistanceAjax () {
			this.$http.get('/trip/allDistance',{}).then(res => {
				this.setUserData(res.data.data)
			})
		},
		...mapActions(['setUser','setUserData'])
	}
}
</script>
<style lang="scss" scoped>

</style>