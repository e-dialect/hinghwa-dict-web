import request from '@/utils/request'

/**
 * PN0204 以音查字
 * @returns {Promise<unknown>}
 */
export function xtpTranslation (file) {
  return request.post('/pronunciation/translate', { file: file })
}
