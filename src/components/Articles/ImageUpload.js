import axios from 'axios'
import { message } from 'ant-design-vue'

/**
 * 在上传之前检查即将上传的文件
 * @param file 即将上传的文件
 */
export function beforeUpload (file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('仅支持上传jpg或png文件!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('上传的图片大小不超过2MB!')
  }
  return isJpgOrPng && isLt2M
}

/**
 * 上传图片
 * @param file 即将上传的图片文件
 */
export async function imageUpload (file) {
  return new Promise(resolve => {
    const formdata = new FormData()
    formdata.append('file', file)
    axios({
      url: '/website/files',
      method: 'post',
      data: formdata,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      resolve(res.data.url)
      message.success('成功上传啦~')
    }).catch(err => {
      message.destroy()
      switch (err.response.status) {
        case 401: {
          message.error('无权限：请检查您的登录状态')
          break
        }
        default: {
          message.error(err.toString())
        }
      }
    })
  })
}
