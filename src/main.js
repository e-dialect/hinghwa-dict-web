import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import Antd, { message } from 'ant-design-vue'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'https://api.pxm.edialect.top/'
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImNzIiwiaWQiOjMsImxvZ2luX3RpbWUiOiIyMDIxLTA4LTA1IDE0OjMzOjIyIiwidmFsdWUiOiJoenZ3OTMifQ.DK0yLWYDhJn2gG578kGS2KC-h-6Q9a2qtpNVu7gIr5g')
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = token // 将token放到请求头发送给服务器
    return config
  }
}, function (error) {
  // Do something with request error
  message.error(error.toString())
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  message.error(error.toString())
  return Promise.reject(error)
})

export default axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
