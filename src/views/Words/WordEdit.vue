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
          <template v-for="(tag,index) in word.mandarin">
            <a-tag :key="tag" :closable="true" @close="word.mandarin.splice(index,1)">
              {{ tag }}
            </a-tag>
          </template>
          <a-input
            v-if="inputVisible"
            ref="input"
            type="text"
            size="small"
            :style="{ width: '78px' }"
            v-model="inputValue"
            @blur="handleInputConfirm"
            @keyup.enter="handleInputConfirm"
          />
          <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
            <a-icon type="plus"/>
            新词汇
          </a-tag>
        </a-form-model-item>
        <a-form-model-item label="相关词条">
          <a-select
            show-search
            mode="multiple"
            v-model="word.related_words"
            :not-found-content="fetching ? undefined : null"
            style="width: 100%"
            :maxTagTextLength="30"
            :filter-option="false"
            @search="handleWordSearch"
            placeholder="键入关键字选择相关词条"
            option-label-prop="label"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option
              v-for="(item,index) in options_word"
              :key="index"
              :value="item.id"
              :label="`${item.word}(${item.standard_pinyin})`"
            >
              {{ item.word }}-{{ item.standard_pinyin }}-{{ item.definition }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="相关文章">
          <a-select
            show-search
            mode="multiple"
            v-model="word.related_articles"
            :not-found-content="fetching ? undefined : null"
            style="width: 100%"
            :maxTagTextLength="30"
            :filter-option="false"
            @search="handleArticleSearch"
            placeholder="键入关键字选择相关文章"
            option-label-prop="label"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small"/>
            <a-select-option
              v-for="(item,index) in options_article"
              :key="index"
              :value="item.article.id"
              :label="`${item.article.title}(${item.author.nickname})`"
            >
              {{ item.article.title }}-{{ item.author.nickname }}-{{ item.article.description }}
            </a-select-option>
          </a-select>
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

export default {
  name: 'WordEdit',
  props: ['id'],
  components: {
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
      inputVisible: false,
      inputValue: '',
      options_word: [],
      options_article: [],
      fetching: false,
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
    },
    /**
     * 普通话词汇 显示文本输入框
     */
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    /**
     * 普通话词汇 添加关键词
     */
    handleInputConfirm () {
      const inputValue = this.inputValue
      const tags = this.word.mandarin
      if (inputValue && tags.indexOf(inputValue) === -1) {
        this.word.mandarin = [...tags, inputValue]
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    /**
     * 相关词条 搜索词条
     * @param keyword 关键词
     */
    handleWordSearch (keyword) {
      this.options_word = []
      if (keyword === '') return
      this.fetching = true
      axios.get('/words', {
        params: { search: keyword },
        cache: true
      }).then(res => {
        this.options_word = res.data.result
      }).finally(() => {
        this.fetching = false
      })
    },
    /**
     * 相关词条 搜索文章
     * @param keyword 关键词
     */
    handleArticleSearch (keyword) {
      this.options_article = []
      if (keyword === '') return
      this.fetching = true
      axios.get('/articles', {
        params: { search: keyword },
        cache: true
      }).then(res => {
        axios.put('/articles', { articles: res.data.articles }, { cache: true }).then(res2 => {
          this.options_article = res2.data.articles
        })
      }).finally(() => {
        this.fetching = false
      })
    }
  }
}
</script>

<style scoped>

</style>
