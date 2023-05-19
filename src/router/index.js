import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Home'
  },
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/About',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/music',
    name: 'Music',
    component: () => import('../views/Music/MusicList.vue')
  },
  {
    path: '/search',
    name: 'Search',
    props: route => ({ keyWords: route.query.key }),
    component: () => import('../views/SearchResult.vue')
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
    path: '/articles/create',
    name: 'ArticleCreate',
    props: true,
    component: () => import('../views/Articles/ArticleEdit.vue')
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetails',
    props: true,
    component: () => import('../views/Articles/ArticleDetails.vue')
  },
  {
    path: '/articles/edit/:id',
    name: 'ArticleEdit',
    props: true,
    component: () => import('../views/Articles/ArticleEdit.vue')
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
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('../views/Users/Notification.vue')
  },
  // Tools区
  {
    path: '/pinyin',
    name: 'Pinyin',
    component: () => import('../views/Pinyin.vue')
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('../views/Tools/Tools.vue')
  },
  {
    path: '/tools/conditions',
    name: 'Conditions',
    component: () => import('../views/Tools/Conditions.vue')
  },
  {
    path: '/tools/QuickRecording',
    name: 'QuickRecording',
    component: () => import('../views/Tools/QuickRecording.vue')
  },
  {
    path: '/tools/QuickRecording/RecordRank',
    name: 'RankList',
    component: () => import('../components/Pronunciation/RankList')
  },
  {
    path: '/tools/characters',
    name: 'Characters',
    component: () => import('../views/Tools/Characters.vue')
  },
  {
    path: '/tools/DailyExpressions',
    name: 'DailyExpressions',
    component: () => import('../views/Tools/DailyExpressions.vue')
  },
  {
    path: '/tools/RecordConfirming',
    name: 'RecordConfirming',
    component: () => import('../views/Tools/RecordConfirming.vue')
  },
  {
    path: '/tools/WordConfirming',
    name: 'WordConfirming',
    component: () => import('../views/Tools/WordConfirming.vue')
  },
  {
    path: '/tools/Relative',
    name: 'Relative',
    component: () => import('../views/Tools/Relative.vue')
  },
  {
    path: '/words/Create',
    name: 'WordCreate',
    props: true,
    component: () => import('../views/Words/WordEdit.vue')
  },
  {
    path: '/words/:id',
    name: 'WordDetails',
    props: true,
    component: () => import('../views/Words/WordDetails.vue')
  },
  {
    path: '/words/:id/edit',
    name: 'WordEdit',
    props: true,
    component: () => import('../views/Words/WordEdit.vue')
  },
  {
    path: '/application/:id',
    name: 'Application',
    props: true,
    component: () => import('../views/Words/Application.vue')
  },
  {
    path: '*',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/NotFound',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/Forbidden',
    name: 'Forbidden',
    component: () => import('../views/Forbidden.vue')
  },
  // 答题区
  {
    path: '/PuxianExam',
    name: 'PuxianExam',
    props: true,
    component: () => import('../views/Quiz/Quiz')
  },
  {
    path: '/PuxianExam/Create',
    name: 'QuizCreate',
    props: true,
    component: () => import('../views/Quiz/QuizEdit')
  },
  {
    path: '/PuxianExam/:id',
    name: 'QuizDetails',
    props: true,
    component: () => import('../views/Quiz/QuizDetails')
  },
  {
    path: '/PuxianExam/Research',
    name: 'QuizResearch',
    props: true,
    component: () => import('../views/Quiz/QuizResearch')
  },
  // 词典区
  {
    path: '/Dictionary',
    name: 'Dictionary',
    props: true,
    component: () => import('../views/Dictionary/Dictionary.vue')
  },
  // 翻译区
  {
    path: '/Translation',
    name: 'Translation',
    props: true,
    component: () => import('../views/Translation/translation.vue'),
    children: [
      {
        path: '/ptxTranslation',
        name: 'ptxTranslation',
        props: true,
        component: () => import('../views/Translation/ptxTranslation.vue')
      },
      {
        path: '/xtpTranslation',
        name: 'xtpTranslation',
        props: true,
        component: () => import('../views/Translation/xtpTranslation.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach(async (to, from, next) => {
  store.commit('tab', [to.name])
  store.commit('tab1', [to.name])
  store.commit('drawerVisibility', false)
  next()
})
