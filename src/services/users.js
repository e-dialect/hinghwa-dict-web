import request from '../utils/request'
import { message } from 'ant-design-vue'

/**
 * US0301 修改信息
 */
export async function updateUserRequest (id, user) {
  return request.put('/users/' + id, { user }).then(async (res) => {
    localStorage.setItem('token', res.token)
    message.success('修改成功！')
  }).catch(err => {
    message.destroy()
    switch (err.status) {
      case 401: {
        message.error('请检查登录状态！')
        break
      }
      case 409: {
        message.error('该用户名存在冲突！')
        break
      }
      case 400: {
        message.error('400:格式错误！')
        break
      }
      default: {
        message.error('未知错误！请联系管理员！')
        message.error('错误内容:' + err.message)
        break
      }
    }
  })
}

/**
 * US0302 修改密码
 */
export function changePasswordRequest (id, oldPassword, newPassword) {
  return request.put(`/users/${id}/password`, {
    oldpassword: oldPassword,
    newpassword: newPassword
  }).then(() => {
    message.success('更改密码成功')
  }).catch(err => {
    message.destroy()
    switch (err.status) {
      case 401: {
        message.error('原密码错误！')
        break
      }
    }
  })
}

/**
 * US0303 修改邮箱
 */
export function changeEmailRequest (id, email, code) {
  return request.put(`/users/${id}/email`, {
    email, code
  }).then(() => {
    message.success('修改成功！')
  }).catch(err => {
    message.destroy()
    switch (err.status) {
      case 401: {
        message.error('验证码错误！')
        break
      }
    }
  })
}

/**
 * US0305 取消绑定微信
 */
export function deleteWechatRequest (id) {
  return request.del(`/users/${id}/wechat`, { }).then(() => {
    message.success('取消绑定成功！')
  })
}
