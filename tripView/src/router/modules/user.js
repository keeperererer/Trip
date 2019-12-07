const tripUser = [
  {
  	path: '/user',
  	name: 'User',
  	component: () => import('@/components/user/user'),
  	meta: {
  		title: '我的'
  	}
  },{
  	path: '/userDetails',
  	name: 'UserDetails',
  	component: () => import('@/components/user/userDetails'),
  	meta: {
  		title: '我的信息'
  	}
  },{
  	path: '/login',
  	name: 'Login',
  	component: () => import('@/components/user/login'),
  	meta: {
  		title: '登录'
  	}
  }
]
export default tripUser