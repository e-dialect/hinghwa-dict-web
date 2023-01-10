<template>
  <a-card>
    <div slot="title">
      <div v-if="application.word">
        <h2>审核词条变更申请（测试中）</h2>
        <p>显示内容（不可编辑内容）为词条当前已公开的状态</p>
        <p>申请发生变动的部分显示在下方的编辑模式内</p>
        <p>未发生变动的部分默认隐藏编辑模式，但可手动点击对应的显示内容进入编辑模式</p>
      </div>
      <div v-else>
        <h2>审核词条创建申请（测试中）</h2>
      </div>
    </div>
    <a-spin :delay="500" :spinning="spinning">
      <a-form-model :labelCol="{span: 3}" :model="application.content" :wrapperCol="{span:16,offset:1}">
        <a-form-model-item label="词条">
          <span @click="editing.word=!editing.word">{{ content.word }}</span>
          <a-input
            v-if="content.word!==application.content.word || editing.word"
            v-model="application.content.word"
          />
        </a-form-model-item>
        <a-form-model-item label="拼音">
          <span @click="editing.pinyin=!editing.pinyin">{{ content.standard_pinyin }}</span>
          <a-input
            v-if="content.standard_pinyin!==application.content.standard_pinyin || editing.pinyin"
            v-model="application.content.standard_pinyin"
          />
        </a-form-model-item>
        <a-form-model-item label="IPA">
          <span @click="editing.ipa=!editing.ipa">{{ content.standard_ipa }}</span>
          <a-input
            v-if="content.standard_ipa!==application.content.standard_ipa || editing.ipa"
            v-model="application.content.standard_ipa"
          />
        </a-form-model-item>
        <a-form-model-item label="释义">
          <div @click="editing.definition=!editing.definition">
            <DefinitionShow v-if="application.word" :definition="content.definition"/>
          </div>
          <DefinitionEdit
            v-if="content.definition!==application.content.definition || editing.definition"
            v-model="application.content.definition"
          />
        </a-form-model-item>
        <a-form-model-item label="普通话词汇">
          <LineTags v-model="application.content.mandarin" tips="新词汇"/>
        </a-form-model-item>
        <a-form-model-item label="相关词条">
          <SelectWord
            v-model="application.content.related_words" :default-value="related_words"/>
        </a-form-model-item>
        <a-form-model-item label="相关文章">
          <SelectArticle v-model="application.content.related_articles" :default-value="related_articles"/>
        </a-form-model-item>
        <a-form-model-item label="百科">
          <MarkdownEditor v-model="application.content.annotation"/>
        </a-form-model-item>
        <a-form-model-item label="理由说明">
          {{ application.reason || '（用户没有填写任何说明）' }}
        </a-form-model-item>
      </a-form-model>

      <a-divider/>

      <a-button icon="check" type="primary" @click="check(true)"> 审核通过</a-button>
      <a-button icon="close" type="danger" @click="check(false)"> 拒绝通过</a-button>
      <a-textarea v-model="reason" placeholder="这里填写审核意见的相关说明"/>
    </a-spin>
  </a-card>
</template>

<script>
import axios from 'axios'
import SelectArticle from '../../components/Word/SelectArticle'
import SelectWord from '../../components/Word/SelectWord'
import LineTags from '../../components/Word/LineTags'
import MarkdownEditor from '../../components/Articles/MarkdownEditor'
import DefinitionEdit from '../../components/Word/DefinitionEdit'
import DefinitionShow from '../../components/Word/DefinitionShow'

export default {
  name: 'Application',
  props: ['id'],
  components: {
    SelectArticle,
    SelectWord,
    LineTags,
    MarkdownEditor,
    DefinitionEdit,
    DefinitionShow
  },
  data () {
    return {
      spinning: true,
      content: {},
      application: {
        content: {},
        word: 0,
        reason: '',
        application: 0,
        contributor: {
          nickname: '这只是一个测试账号呢',
          avatar: 'https://cos.edialect.top/website/默认头像.jpg',
          id: 0
        },
        granted: false,
        verifier: null
      },
      reason: '',
      editing: {
        word: false,
        pinyin: false,
        ipa: false,
        definition: false,
        mandarin: false,
        words: false,
        articles: false,
        annotation: false
      },
      related_words: [],
      related_articles: []
    }
  },
  async created () {
    await axios.get(`/words/applications/${this.id}`).then(res => {
      this.application = res.data.application
      this.related_articles = res.data.application.content.related_articles
      this.related_words = res.data.application.content.related_words
    })
    if (this.application.word) {
      await axios.get(`words/${this.application.word}`).then(res => {
        this.content = res.data.word
      })
    }
    this.spinning = false
  },
  watch: {
    $route () {
      this.created()
    }
  },
  computed: {
    submit () {
      const o = { ...this.application.content }
      o.related_words = [...this.application.content.related_words.map(item => {
        return item.id || item.key
      })]
      o.related_articles = [...this.application.content.related_articles.map(item => {
        return item.id || item.key
      })]
      return o
    }
  },
  methods: {
    async check (result) {
      if (!this.reason) {
        this.$message.error('请填写审核意见！')
        return
      }
      try {
        const word = await axios.put(`/words/applications/${this.id}`, {
          reason: this.reason,
          result: result
        })
        if (result && this.application.word !== 0) {
          await axios.put(`words/${this.application.word}`, { word: this.submit })
        } else if (result && this.application.word === 0) {
          await axios.post('/words', { word: this.submit })
        }
        if (result && this.application.word !== 0) {
          this.$message.success(`提交审核结果成功，词条（${this.application.content.word}）${word}已修改`)
        } else if (result && this.application.word === 0) {
          this.$message.success(`提交审核结果成功，词条（${this.application.content.word}）${word}已创建`)
        } else if (result === false && this.application.word !== 0) {
          this.$message.success('提交审核结果成功，词条修改不通过')
        } else {
          this.$message.success('提交审核结果成功，词条创建不通过')
        }
        this.$router.push({ name: 'WordConfirming' })
      } catch (e) {
        this.$message.error('提交审核结果失败！')
      }
    }
  }
}
</script>

<style scoped>

</style>
