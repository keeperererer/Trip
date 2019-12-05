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
  }
]
export default tripUser