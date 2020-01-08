<template>
	<div class="login">
	    <div class="login-bg">
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
	},
	methods: {
		loginOnClick () {
			this.loginAjax()
		},
	    loginAjax () {
	      let params = {
	        userName: this.user.phone,
	        passWord: this.user.password
	      }
	      this.$http.post('/user', params).then(res => {
	        this.userData = res.data.data
	        //将js对象转换为字符串
	        let tmpUser = JSON.stringify(this.userData)
	        // 登录信息存到本地
	        localStorage.setItem('user', tmpUser)
	        // 存到vuex
	        this.setUser(this.userData)
	        this.allDistanceAjax()
	        Toast.succeed(`欢迎*★,(￣▽￣)/$:*. 。，${this.userData.name}`, 1500)
	        this.$router.push({ path: '/trip' })
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