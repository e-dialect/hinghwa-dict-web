import request from '@/utils/request'
import { message } from 'ant-design-vue'
import store from '@/store'

/**
 * LG0103 刷新 token
 * @returns {Promise<void>}
 */
export async function refreshToken () {
  await request.put('/login', {}).then(res => {
    localStorage.setItem('token', res.token)
    store.dispatch('userLogin', res.id)
  }).catch(() => {
    message.error('登录已过期，请重新登录')
    store.commit('userLogout')
  })
}
