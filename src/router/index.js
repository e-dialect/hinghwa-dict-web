import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  // Login区
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Login/Register.vue')
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('../views/Login/Forget.vue')
  },
  // Articles区
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/Articles/Articles.vue')
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetails',
    props: true,
    component: () => import('../views/Articles/ArticleDetails.vue')
  },
  // Users区
  {
    path: '/users/:id',
    name: 'UserDetails',
    props: true,
    component: () => import('../views/Users/UserDetails.vue')
  },
  {
    path: '/settings',
    name: 'UserSettings',
    component: () => import('../views/Users/UserSettings.vue')

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  store.commit('tab', [to.name])
  next()
})
