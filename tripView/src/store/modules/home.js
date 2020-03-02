import * as types from '../mutations-types'

export default {
  state: {
    id: '900909090',
    weatherArr: []
  },
  getters: {
    id: state => state.id,
    weatherArr: state => state.weatherArr
  },
  mutations: {
    [ types.SET_ID ] (state, data) {
      state.id = data
    },
    [ types.SET_WEATHER_ARR ] (state, data) {
      state.weatherArr = data
    }
  },
  actions: {
    setId (store, data) {
      store.commit(types.SET_ID, data)
    }
  }

}
