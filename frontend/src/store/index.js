import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: 0,
    username:'',
    token: '',
    isAdmin: 0
  },
  mutations: {
    SAVE_USER(state, user) {
      state.userId = user.userId,
      state.username = user.username,
      state.token = user.token,
      state.isAdmin = user.isAdmin
    }
  },
  actions: {
  },
  modules: {
  }
})