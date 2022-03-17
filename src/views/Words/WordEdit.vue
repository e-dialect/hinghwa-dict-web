<template>
  <a-spin :delay="500" :spinning="spinning">
    <a-card>
      <template v-slot:title>
        <h1>词条编辑</h1>
      </template>

      <a-form-model :model="word" :labelCol="{span: 3}" :wrapperCol="{span:16,offset:1}">
        <a-form-model-item label="词条">
          <a-input v-model="word.word"/>
        </a-form-model-item>
        <a-form-model-item label="拼音">
          <a-input v-model="word.standard_pinyin"/>
        </a-form-model-item>
        <a-form-model-item label="IPA">
          <a-input v-model="word.standard_ipa"/>
        </a-form-model-item>
        <a-form-model-item label="释义">
          <DefinitionEdit v-model="word.definition"/>
        </a-form-model-item>
        <a-form-model-item label="普通话词汇">
          <LineTags v-model="word.mandarin" tips="新词汇"></LineTags>
        </a-form-model-item>
        <a-form-model-item label="相关词条">
          <SelectWord v-model="word.related_words"/>
        </a-form-model-item>
        <a-form-model-item label="相关文章">
          <SelectArticle v-model="word.related_articles"/>
        </a-form-model-item>
        <a-form-model-item label="百科">
          <MarkdownEditor v-model="word.annotation"></MarkdownEditor>
        </a-form-model-item>
        <a-form-model-item label="理由说明">
          <a-input v-model="reason" placeholder="[可选]说明更改了哪些点，为何修改有助于更好帮助管理员审核"/>
        </a-form-model-item>
      </a-form-model>
      <a-button @click="submit">提交更改</a-button>
    </a-card>
  </a-spin>
</template>

<script>
import DefinitionEdit from '../../components/Word/DefinitionEdit'
import axios from 'axios'
import MarkdownEditor from '../../components/Articles/MarkdownEditor'
import LineTags from '../../components/Word/LineTags'
import SelectWord from '../../components/Word/SelectWord'
import SelectArticle from '../../components/Word/SelectArticle'

export default {
  name: 'WordEdit',
  props: ['id'],
  components: {
    SelectArticle,
    SelectWord,
    LineTags,
    MarkdownEditor,
    DefinitionEdit
  },
  data () {
    return {
      spinning: false,
      visible: false,
      word: {
        id: 0,
        word: '例子',
        definition: '这仅仅是一个样例',
        contributor: {
          nickname: '用户昵称',
          avatar: 'http://dummyimage.com/100x100',
          id: 0
        },
        annotation: '',
        mandarin: [],
        related_words: [],
        related_articles: [],
        views: 100
      },
      standard_pronunciation: null,
      reason: ''
    }
  },
  created () {
    this.getWordDetails()
  },
  watch: {
    $route () {
      this.getWordDetails()
    }
  },
  methods: {
    /**
     * 获取当前这个词条的具体信息
     */
    async getWordDetails () {
      if (!this.$store.getters.loginStatus) {
        this.$message.error('请先登录！')
        this.$router.push({ name: 'Login' })
        return
      }
      this.spinning = true
      await axios.get('words/' + this.id).then(res => {
        this.word = res.data.word
      }).catch(() => {
        this.$message.destroy()
        this.$router.replace({ name: 'NotFound' })
      }).finally(() => {
        this.spinning = false
      })
      this.standard_pronunciation = await this.getIPAPronunciation(this.word.standard_ipa)
      await axios.get('/pronunciation', { params: { word: this.id } }).then(res => {
        this.pronunciation = res.data.pronunciation
        this.pronunciation.forEach((item, index) => {
          item.key = index
        })
      })
    },
    /**
     * 根据ipa获取读音
     * @param ipa
     * @returns {Promise<string>} 音频url
     */
    async getIPAPronunciation (ipa) {
      let url = ''
      await axios.get(`/pronunciation/${ipa}`).then(res => {
        if (res.data.url !== 'null') {
          url = res.data.url
        } else if (res.data.tts !== 'null') url = res.data.tts
      })
      return url
    },
    /**
     * 提交更改申请
     */
    submit () {
      axios.post('/words/applications', {
        content: this.word,
        word: this.id,
        reason: this.reason
      }).then(res => {
        this.$message.success(`词条更改${res.data.id}申请已提交！正在等待管理员审核~`)
        this.$router.push({
          name: 'WordDetails',
          params: { id: this.id }
        })
      })
    }

  }
}
</script>

<style scoped>

</style>
