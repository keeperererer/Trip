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
  },
  {
    path: '/trend',
    name: 'Trend',
    component: () => import('@/components/user/analysis/tripTrend'),
    meta: {
      title: '出行趋势' 
    }
  },
  {
    path: '/allTrip',
    name: 'allTrip',
    component: () => import('@/components/user/analysis/allTrip'),
    meta: {
      title: '信息总览'
    }
  },
  {
    path: '/price',
    name: 'price',
    component: () => import('@/components/user/analysis/price'),
    meta: {
      title: '交通费用'
    }
  },
  {
    path: '/tripWay',
    name: 'tripWay',
    component: () => import('@/components/user/analysis/tripWay'),
    meta: {
      title: '出行方式'
    }
  }
]
export default tripUser