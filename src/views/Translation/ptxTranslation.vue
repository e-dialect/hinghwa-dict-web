<template>
    <!--    翻译区-->
  <a-card>
  <div>
    <p>输入普通话文本以查询对应读音</p>
    <a-row>
      <a-col :span="14">
        <a-input v-model="words" placeholder="请输入普通话文本"></a-input>
      </a-col>
      <a-col :span="10">
    <a-button icon="sound" @click="playWords()">语音翻译</a-button>
    <a-button icon="search" @click="search(words)">搜索更多</a-button>
      </a-col>
    </a-row>
  </div>
    <a-divider v-if="words.length"></a-divider>
    <!--      结果-->
    <PinyinList
      v-if="words.length"
      :key-words="words"
    />
  </a-card>
</template>

<script>
import PinyinList from '../../components/Tools/PinyinList'
import axios from 'axios'

export default {
  name: 'ptxTranslation',
  components: { PinyinList },
  data () {
    return {
      words: '',
      pronunciation: {
        url: '',
        loading: false,
        disabled: false
      }
    }
  },
  computed: {
    chinese () {
      return this.words.toString().replaceAll(/[^\u4e00-\u9fa5]/ig, '')
    }
  },
  watch: {
    words () {
      this.loadingRecord()
    }
  },
  methods: {
    loadingRecord () {
      this.pronunciation = {
        url: '',
        loading: true,
        disabled: false
      }
      axios.get('pronunciation/combine', { params: { words: this.chinese } }).then(res => {
        this.pronunciation.url = res.data.url
      }).catch(() => {
        this.pronunciation.disabled = true
        this.$message.destroy()
      }).finally(() => {
        this.pronunciation.loading = false
      })
    },
    search (content) {
      if (content) {
        this.$router.push({
          name: 'Search',
          query: { key: content }
        })
      } else {
        this.$message.warning('请先录入搜索内容哦~')
      }
    },
    playWords () {
      if (this.pronunciation.loading) {
        this.$message.warning('正在合成中，请稍后再试！')
        return
      }
      if (this.pronunciation.disabled) {
        this.$message.warning('很抱歉，这句话太难了，暂时合成不了！')
        return
      }
      this.$message.warning('该语音由机器生成仅供参考！（可能存在错误）')
      new Audio(this.pronunciation.url).play()
    }
  }
}
</script>
<style scoped>

</style>
