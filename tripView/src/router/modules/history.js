const tripHistory = [
  {
    path: '/history',
    name: 'History',
    component: () => import('@/components/history/history'),
    meta: {
      title: '历史列表'
    },
    children: [
    	{
    		path: 'details',
    		name: 'Details',
    		component: () => import('@/components/history/historyDetails')
    	}
    ]
  }
]
export default tripHistory