const tripRoutes = [
  {
    path: '/trip',
    name: 'Trip',
    component: () => import('@/components/trip/trip'),
    meta: {
      title: '出行'
    }
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
