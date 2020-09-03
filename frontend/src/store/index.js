import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: 0,
    username:'',
    token: ''
  },
  mutations: {
    SAVE_USER(state, user) {
      state.userId = user.userId,
      state.username = user.username,
      state.token = user.token
    }
  },
  actions: {
  },
  modules: {
  }
})