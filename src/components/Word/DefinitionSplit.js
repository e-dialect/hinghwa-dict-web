/**
 * 具体解析一个待解析的字符串
 * @param definition 具体待解析的字符串
 */
function analyseDefinition (definition) {
  let index = definition.indexOf('：')
  if (index === -1) {
    index = definition.indexOf('△')
    if (index === -1) {
      index = definition.length
    } else {
      index = index - 1
    }
  }
  const result = {
    content: definition.substring(0, index),
    example: []
  }
  let status = 1 // 1：现在是例子；0：现在是例子的解释
  let example = {
    type: '例',
    content: '',
    explain: ''
  }

  for (const char of definition.substring(index + 1)) {
    if (char === '（') {
      // 例子解释开始
      status = 0
    } else if (char === '）') {
      // 例子解释结束
      status = 1
    } else if (status === 0) {
      // 例子解释内容
      example.explain = example.explain + char
    } else if (char === '△') {
      // 例子类型
      example.type = '俗'
    } else if (char === '|' || char === '。') {
      // 一个例子结束
      result.example.push(example)
      example = {
        type: '例',
        content: '',
        explain: ''
      }
    } else {
      // 例子的内容
      example.content = example.content + char
    }
  }
  return result
}

/**
 * 将数据库中的释义字符串进行拆分
 * @param definition 释义字符串
 */
export function splitDefinition (definition) {
  const order = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
  let lastIndex = -1
  const result = []
  for (let i = 0; i < order.length; i++) {
    const index = definition.indexOf(order[i])
    if (index < 0) break
    if (lastIndex !== -1) {
      result.push(analyseDefinition(definition.substring(lastIndex, index)))
    }
    lastIndex = index + 1
  }
  result.push(analyseDefinition(definition.substring(lastIndex)))
  if (result.length > 1) {
    result.forEach((item, index) => {
      item.content = order[index] + ' ' + item.content
    })
  }
  return result
}
