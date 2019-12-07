const tripRoutes = [
  {
    path: '/trip',
    name: 'Trip',
    component: () => import('@/components/trip/trip'),
    meta: {
      title: '出行'
    },
    children: [{
      path: 'map',
      name: 'Map',
      component: () => import('@/components/mapLocation/map'),
      meta: {
        title: '地图'
      }
    }]
  },
  {
    path: '/traffic',
    name: 'Traffic',
    component: () => import('@/components/traffic/traffic'),
    meta: {
      title: '交通'
    }
  }
]
export default tripRoutes
