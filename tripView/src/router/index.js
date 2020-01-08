// import Vue from 'vue'
// import Router from 'vue-router'
// import Trip from '@/components/trip/trip'

// Vue.use(Router)
// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Trip',
//       // component: Trip,
//       // redirect: '/trip'
//     }
//   ]
// })
import Vue from 'vue'
import Router from 'vue-router'
import { Toast } from 'mand-mobile'
// import Test from './modules/test'
import Trip from './modules/trip'
import User from './modules/user'
import History from './modules/history'

Vue.use(Router)

const commonRoutes = [
  // { path: '/404', component: () => import('components/RouterError/404') },
  // { path: '/401', component: () => import('components/RouterError/401') },
  // { path: '*', redirect: '/404' },
  {
    path: '/',
    redirect: '/trip'
  }
]


/** 分模块的路由，合并传入Router */
let router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: commonRoutes.concat(Trip, User, History)
})

router.beforeEach((to,form,next)=>{
  if(to.name != 'UserDetails'){
    let live2D = document.getElementById('live2d-widget')
    if(live2D){
      live2D.style.display = 'none'
      next()
    }else{
      next()
    }
  }else{
    next()
  }
  
})
// 导航守卫，非登录状态先登录
// router.beforeEach((to, from, next) => {
//   let tmp = localStorage.getItem('user')
//   if (!tmp && to.name !== 'Login') {
//     Toast.succeed('您需要先登录哦！', 1500)
//     next({ path: '/login' })
//     return
//   }
//   next()
// })
export default router
