import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: {
      username: 'unknown',
      nickname: '未登录'
    },
    routes: [],
    others: []
  },
  mutations: {
    token(state, token) {
      state.token = token
    },
    login(state, user) {
      state.user = user
    },
    logout(state) {
      state.token = null
      state.user = {
        username: 'unknown',
        nickname: '未登录'
      }
      state.routes = []
    },
    initMenu(state, data) {
      state.routes = data
    },
    setOthers(state, data) {
      state.others = data
    }
  },
  actions: {
  },
  modules: {
  }
})
