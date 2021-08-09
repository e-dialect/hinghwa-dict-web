import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      id: 0,
      username: 'username',
      nickname: 'nickname',
      email: 'pxm@edialect.top',
      avatar: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
      is_admin: false
    }
  },
  getters: {
    loginStatus (state) {
      return state.id > 0
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
