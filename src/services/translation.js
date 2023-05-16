import request from '@/utils/request'

/**
 * PN0204 以音查字
 * @returns {Promise<unknown>}
 */
export function xtpTranslation (url) {
  return request.post('/pronunciation/translate', { file: url })
}
