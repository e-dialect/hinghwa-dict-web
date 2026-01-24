<script>
export default {
  name: 'WordTag',
  data () {
    return {
      maxLength: 10
    }
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    stringToRGB (tag) {
      // 1. 计算整个字符串的特征值（累加所有字符的编码）
      let sum = 0
      for (let i = 0; i < tag.length; i++) {
        // 取模 256 防止累加数值过大，保持在颜色范围内
        sum = (sum + tag.codePointAt(i)) % 256
      }

      // 如果是空字符串，给个默认值
      if (tag.length === 0) sum = 0

      let value = '#'

      // 2. 基于总和生成 RGB 三通道
      // 使用 3, 5, 7 这三个质数作为乘数，是为了让 R、G、B 产生区分度，同时保持基于 sum 的确定性
      const multipliers = [3, 5, 7]

      for (let i = 0; i < 3; ++i) {
        // 计算基础色值
        let temp = (sum * multipliers[i]) % 256

        // 3. 降低亮度 (保持白字可读性)
        // 0.6 系数确保颜色足够深
        temp = Math.floor(temp * 0.6)

        // 补全十六进制
        let hex = temp.toString(16)
        if (hex.length < 2) {
          hex = '0' + hex
        }

        value += hex
      }
      return value
    },

    getTags (tag) {
      return tag.length > this.maxLength ? tag.slice(0, this.maxLength - 3) + '...' : tag
    }
  }
}
</script>

<template>
  <div>
    <a-tag v-for="tag in tags" :key="tag" :color="stringToRGB(tag)" bordered>{{ getTags(tag) }}</a-tag>
  </div>
</template>

<style scoped>

</style>
