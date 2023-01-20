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

/**
 * WS0201 上传文件
 * @param file
 */
export async function uploadFile (file) {
  let ans = ''
  const formData = new FormData()
  formData.append('file', file)
  await request.post('/website/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
    message.success('成功上传文件')
    ans = res.url
  })
  return ans
}

/**
 * WS0202 删除文件
 */
export function deleteFile (url) {
  return request.del('/website/files', { url }).then(() => {
    message.success('成功删除文件')
  })
}

/**
 * 在上传之前检查即将上传的图片
 * @param image 即将上传的图片
 */
export function checkImageBeforeUpload (image) {
  const isJpgOrPng = image.type === 'image/jpeg' || image.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('仅支持上传jpg或png文件!')
    return
  }
  const isLt2M = image.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('上传的图片大小不超过2MB!')
    return
  }
  return isJpgOrPng && isLt2M
}

/**
 * WS0804 检索通知
 * @param config
 * @returns {Promise | Promise<unknown>}
 */
export function searchNotificatons (config) {
  return request.get('/website/notifications', config)
}

/**
 * WS0804 检索通知（用户）
 * @param to 用户id
 * @param onlyUnread 未读消息
 * @param page 页码，1开始
 * @param pageSize 每页大小
 * @returns {Promise | Promise<unknown>}
 */
export function receiveNotificatons (to, onlyUnread = false, page = 1, pageSize = 10) {
  if (onlyUnread === false) {
    return request.get('/website/notifications', { to, page, pageSize })
  } else return request.get('/website/notifications', { to, page, pageSize, unread: true })
}

/**
 * WS0803 批量已读通知
 * @param ids 通知编号
 * @returns {Promise | Promise<unknown>}
 */
export function readNotifications (ids) {
  return request.put('/website/notifications/unread', { notifications: ids })
}
