import Vue from 'Vue'
import vuex from 'vuex'

import home from '@/store/modules/home'
import trip from '@/store/modules/trip'

Vue.use(vuex)

export default new vuex.Store({
	modules: {
		home,
		trip
	}
})