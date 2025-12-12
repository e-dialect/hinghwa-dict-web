/**
 * 等待认证初始化完成的工具函数
 * 用于解决页面刷新时的认证状态竞态条件问题
 */

// 最大重试次数
const MAX_RETRIES = 50
// 每次重试的延迟时间（毫秒）
const RETRY_DELAY_MS = 100

/**
 * 等待用户认证状态初始化完成
 * 如果localStorage中存在token，等待App.vue中的refreshToken完成，确保user.id被正确设置
 * 这个函数主要用于管理员页面，避免在页面刷新时因为认证状态未初始化而导致验证失败
 *
 * @param {Object} store - Vuex store实例
 * @returns {Promise<boolean>} 返回true表示初始化成功，false表示超时或token不存在
 */
export async function waitForAuthInitialization (store) {
  // 如果没有token，直接返回false
  const token = localStorage.getItem('token')
  if (!token) {
    return false
  }

  // 如果已经登录（user.id > 0），直接返回true
  if (store.getters.loginStatus) {
    return true
  }

  // 等待用户ID被设置（表示refreshToken已完成）
  let retries = 0
  while (!store.getters.loginStatus && retries < MAX_RETRIES) {
    // 再次检查token是否还存在（可能在等待期间被清除）
    if (!localStorage.getItem('token')) {
      return false
    }
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
    retries++
  }

  // 返回最终的登录状态
  const success = store.getters.loginStatus
  if (!success && retries >= MAX_RETRIES) {
    console.warn('waitForAuthInitialization: 等待认证初始化超时')
  }
  return success
}
