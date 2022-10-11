import request from '../utils/request'

export function getWordDetails (id) {
  return request.get(`/words/${id}`)
}
