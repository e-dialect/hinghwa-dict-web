<template>
  <a-card>
    <template slot="title">
      <h2>输入汉字查拼音</h2>
      <h5>忽略所有非汉字字符，暂不支持搜索繁体字</h5>
      <a-input-search
        placeholder="请输入搜索内容"
        enter-button
        size="large"
        v-model="searchContent"
      />
    </template>
    <PinyinList
      v-if="chinese.length"
      :key-words="chinese"
    />
    <a-empty v-else/>
  </a-card>
</template>

<script>
import PinyinList from '../../components/Tools/PinyinList'

export default {
  name: 'Characters',
  components: { PinyinList },
  data () {
    return {
      searchContent: '莆仙方言'
    }
  },
  computed: {
    chinese () {
      return this.searchContent.toString().replaceAll(/[^\u4e00-\u9fa5]/ig, '')
    }
  }
}
</script>

<style scoped>

</style>
