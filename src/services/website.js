import request from '@/utils/request'
import { message } from 'ant-design-vue'

/**
 * 发送邮箱验证码
 */
export function sendCodeRequest (email) {
  return request.post('/website/email', { email: email }).then(
    () => {
      message.success('验证码已成功发送至' + email)
    }).catch(() => {
    message.error('发送失败！')
  })
}
