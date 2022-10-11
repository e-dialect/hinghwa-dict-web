import axios from 'axios'
import { BASE_URL } from '../consts/urls'
import { message } from 'ant-design-vue'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {}
})

request.interceptors.request.use((conf) => {
  conf.headers.Authorization = `${localStorage.getItem('token') || ''}`
  message.loading('加载中...', 0)
  return conf
}, (err) => Promise.reject(err))

request.interceptors.response.use((res) => res,
  ({ response }) => {
    message.destroy()
    switch (response?.status) {
      case 401:
        message.error(response?.data?.msg || '你没有权限访问该页面，请登录')
        break
      case 403:
        message.error(response?.data?.msg || '禁止访问！')
        break
      case 404:
        message.error(response?.data?.msg || '资源不存在！')
        break
      case 409:
        message.error(response?.data?.msg || '资源已存在！')
        break
      default:
        message.error(response?.data?.msg)
        break
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      status: response?.status,
      message: response?.data?.message
    })
  })

export function get (url, data) {
  return new Promise((resolve, reject) => {
    request.get(url, { params: data })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function post (url, data) {
  return new Promise((resolve, reject) => {
    request.post(url, data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function put (url, data) {
  return new Promise((resolve, reject) => {
    request.put(url, data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function del (url, data) {
  return new Promise((resolve, reject) => {
    request.delete(url, data)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default {
  get,
  post,
  put,
  del
}
