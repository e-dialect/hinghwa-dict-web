import request from '@/utils/request'

/**
 * WD0501 获取音序表
 * @returns {Promise<unknown>}
 */
export function getPhonetic () {
  return request.get('http://127.0.0.1:4523/mock/404238/words/phonetic_ordering')
}

/**
 * WD0502 音序表字典查词
 * @returns {Promise<unknown>}
 */
export async function searchQuiz () {
  return await request.get('/words/dictionary_search')
}

/**
 * WD0503 音序表首音序查词
 * @returns {Promise<unknown>}
 */
export async function getRandomQuiz () {
  return request.get('/words/dictionary_search_initial')
}
