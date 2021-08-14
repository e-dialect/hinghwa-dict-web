import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)
const defaultUser = {
  id: 0,
  username: 'username',
  nickname: 'nickname',
  email: 'pxm@edialect.top',
  avatar: 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
  is_admin: false
}
export default new Vuex.Store({
  state: {
    tab: [],
    drawerVisibility: false,
    drawerLoading: false,
    user: Object.create(defaultUser),
    publish_articles: [],
    like_articles: []
  },
  getters: {
    /**
     * 登录状态
     * @param state
     * @returns {boolean} 是否已经登录
     */
    loginStatus (state) {
      return state.user.id > 0
    },

    // getter区
    tab (state) {
      return state.tab
    },
    drawerVisibility (state) {
      return state.drawerVisibility
    },
    drawerLoading (state) {
      return state.drawerLoading
    },
    user (state) {
      return state.user
    },
    publish_articles (state) {
      return state.publish_articles
    },
    like_articles (state) {
      return state.like_articles
    }
  },
  mutations: {
    tab (state, value) {
      state.tab = value
    },
    drawerVisibility (state, value) {
      state.drawerVisibility = value
      if (value === true) { this.commit('userUpdate') }
    },
    userLogin (state, id) {
      if (state.user.id.toString() === id) return
      state.user.id = Number(id)
      localStorage.setItem('id', id)
      this.commit('userUpdate')
    },
    userLogout (state) {
      localStorage.removeItem('id')
      localStorage.removeItem('token')
      state.user = Object.create(defaultUser)
      state.publish_articles = []
      state.like_articles = []
      state.drawerVisibility = false
    },
    userUpdate (state) {
      state.drawerLoading = true
      axios.get('/users/' + state.user.id).then(res => {
        state.user = res.data.user
        state.publish_articles = res.data.publish_articles
        state.like_articles = res.data.like_articles
        state.drawerLoading = false
      })
    }
  },
  actions: {

  },
  modules: {}
})
