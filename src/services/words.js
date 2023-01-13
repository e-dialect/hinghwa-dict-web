import request from '../utils/request'

/**
 * WD0101 获取指定词语
 * @param id 词语id
 * @returns {Promise<unknown>}
 */
export function getWordDetails (id) {
  return request.get(`/words/${id}`)
}

/**
 * WD0501 获取音序表
 * @returns {Promise<object|null>}
 */
export async function getPhoneticOrder () {
  try {
    return (await request.get('/words/phonetic_ordering')).record
  } catch (e) {
    return null
  }
}

/**
 * WD0502 音序表字典查词
 * @param order{string[]} 音序表
 * @param prefix{string} 前缀
 * @param recursion{boolean} 是否递归
 * @returns {Promise<unknown>}
 */
export async function searchDictionary (order, prefix = '', recursion = false) {
  return new Promise((resolve) => {
    request.post('/words/dictionary', { order: [...order], prefix: prefix, recursion: recursion }).then(res => {
      resolve(res.words)
    }).catch(err => {
      if (err.data.words) {
        resolve(err.data.words)
      } else resolve([])
    })
  })
}
