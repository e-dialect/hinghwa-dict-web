<template>
  <a-spin :delay="500" :spinning="spinning">
    <a-card>
      <template v-slot:title>
        <h1 v-if="id">词条编辑</h1>
        <h1 v-else>词条创建</h1>
      </template>

      <a-form-model :labelCol="{span: 3}" :model="word" :wrapperCol="{span:16,offset:1}">
        <a-form-model-item label="词条">
          <a-input v-model="word.word" placeholder="填入词条标题"/>
        </a-form-model-item>
        <a-form-model-item label="拼音">
          <a-input v-model="word.standard_pinyin" placeholder="词条的拼音写法（不用类化）"/>
        </a-form-model-item>
        <a-form-model-item label="IPA">
          <a-input v-model="word.standard_ipa" placeholder="词条的IPA（实际发音），实在不会可以留空找管理员帮忙"/>
        </a-form-model-item>
        <a-form-model-item label="释义">
          <DefinitionEdit v-model="word.definition"/>
        </a-form-model-item>
        <a-form-model-item label="普通话词汇">
          <LineTags v-model="word.mandarin" tips="新词汇"></LineTags>
        </a-form-model-item>
        <a-form-model-item label="相关词条">
          <SelectWord :default-value="related_words" v-model="word.related_words"/>
        </a-form-model-item>
        <a-form-model-item label="相关文章">
          <SelectArticle v-model="word.related_articles" :default-value="related_articles"/>
        </a-form-model-item>
        <a-form-model-item label="附注">
          <MarkdownEditor v-model="word.annotation"></MarkdownEditor>
        </a-form-model-item>
        <a-form-model-item label="理由说明">
          <a-input v-if="id" v-model="reason" placeholder="[可选]说明更改了哪些点，为何修改有助于更好帮助管理员审核"/>
          <a-input v-else v-model="reason" placeholder="[可选]说明有哪些看可能把握不准的地方，有助于更好帮助管理员审核"/>
        </a-form-model-item>
      </a-form-model>
      <a-button @click="submit">
        {{ id ? '提交更改' : '创建词条' }}
      </a-button>
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
        word: '',
        definition: '',
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
      related_words: [],
      related_articles: [],
      reason: ''
    }
  },
  computed: {
    id () {
      if (this.$route.name === 'WordCreate') {
        return 0
      } else {
        return +this.$route.params.id
      }
    },
    content () {
      const o = { ...this.word }
      o.related_words = [...this.word.related_words.map(item => {
        return item.id
      })]
      o.related_articles = [...this.word.related_articles.map(item => {
        return item.id
      })]
      return o
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

      if (this.id) {
        this.spinning = true
        await axios.get('words/' + this.id).then(res => {
          this.word = res.data.word
          this.related_articles = this.word.related_articles
          this.related_words = this.word.related_words
        }).catch(() => {
          this.$message.destroy()
          this.$router.replace({ name: 'NotFound' })
        }).finally(() => {
          this.spinning = false
        })
      }
    },
    /**
     * 提交更改申请
     */
    submit () {
      axios.post('/words/applications', {
        content: this.content,
        word: this.id,
        reason: this.reason
      }).then(res => {
        this.$message.success(`词条更改${res.data.id}申请已提交！正在等待管理员审核~`)
        if (this.id) {
          this.$router.push({
            name: 'WordDetails',
            params: { id: this.id }
          })
        } else {
          this.$router.push({ name: 'Home' })
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
