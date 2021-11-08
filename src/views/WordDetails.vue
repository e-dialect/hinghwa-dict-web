<template>
  <a-spin :delay="500" :spinning="spinning">
    <a-card>

      <template v-slot:title>
        <h1 style="padding-left:30px; color: rgb(26,26,73); font-size:250%">
          <strong>
            {{ word.word }}
          </strong>
        </h1>
        <span style="font-size: 100%;padding-left: 50px">
          {{ word.standard_pinyin }}
        </span>
        <span style="font-size: 100%;color: rgb(155,155,155);padding-left: 10px">
          / {{ word.standard_ipa }}/
        </span>
      </template>

      <template v-slot:extra>
        来源:
        <router-link :to="{name:'UserDetails',params:{id:word.contributor.id.toString()}}">
          {{ word.contributor.nickname }}
        </router-link>
      </template>

      <!--释义-->
      <div>
        <div style="padding:15px">
          <a-tag color="rgb(179, 7, 30,0.7)"> 释义</a-tag>
        </div>
        <div
          v-for="(item,index) in analysedDefinition"
          :key="index+1"
          style="width: 100%;padding: 20px"
        >
          <a-card>
            <template v-slot:title>
              {{ analysedDefinition.length > 1 ? (index + 1) + '：' : '' }}{{ item.content }}
            </template>
            <div v-for="exp in item.example" :key="exp.content" style="padding: 5px">
              <a-tag color="rgb(64, 49, 131)"> {{ exp.type }}</a-tag>
              <span style="padding:5px">
                <strong> {{ exp.content }} </strong>
                <span style="font-size:x-small"> {{ exp.explain }} </span>
              </span>
            </div>
          </a-card>
        </div>
      </div>

      <!--发音列表-->
      <div style="padding:15px">
        <a-tag color="rgb(179, 7, 30,0.7)"> 发音</a-tag>
        <a-button
          size="small"
          type="dashed"
          @click="openRecordingModal"
        >
          我要贡献
        </a-button>
        <recording
          :form="form"
          :onCancel="()=>{this.visible=false}"
          :visible="visible"
        />
      </div>
      <a-row justify="center" type="flex">
        <a-col :span="22">
          <a-table
            :columns="columns"
            :data-source="pronunciation"
            :pagination="{ simple: true}"
          >
            <span slot="contributor" slot-scope="text, record">
              <router-link :to="{name:'UserDetails',params:{id:record.contributor.id.toString()}}">
              <a-avatar :src="record.contributor.avatar"/>
              {{ record.contributor.nickname }}
                </router-link>
            </span>
            <span slot="customTitle"> Name</span>
            <span slot="action" slot-scope="text, record">
      <audio
        :src="record.pronunciation.source"
        controls
      />
    </span>
          </a-table>
        </a-col>
      </a-row>

      <!--相关文章-->
      <ArticleList
        v-if="word.related_articles.length"
        :list-data="word.related_articles"
        :page-size="3"
      />
      <p style="margin-top: 40px">
        <a-icon type="eye"></a-icon>
        访问量:{{word.views}}
      </p>
    </a-card>
  </a-spin>
</template>

<script>

import axios from 'axios'
import ArticleList from '@/components/Articles/ArticleList'
import Recording from '@/components/Recording'

export default {
  name: 'WordDetails',
  props: ['id'],
  components: { Recording, ArticleList },
  data () {
    return {
      spinning: false,
      visible: false,
      form: {
        item: '',
        definition: '',
        pinyin: '',
        ipa: '',
        county: '',
        town: ''
      },
      analysedDefinition: [{
        content: 'content',
        example: [
          {
            type: '例',
            content: '',
            explain: ''
          }
        ]
      }
      ],
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
      columns: [
        {
          title: '贡献者',
          key: 'contributor',
          scopedSlots: { customRender: 'contributor' },
          align: 'center'
        },
        {
          title: '拼音',
          dataIndex: 'pronunciation.pinyin',
          key: 'pinyin',
          align: 'center'
        },
        {
          title: '国际音标',
          dataIndex: 'pronunciation.ipa',
          key: 'ipa',
          align: 'center'
        },
        {
          title: '县区',
          dataIndex: 'pronunciation.county',
          key: 'county',
          align: 'center'
        },
        {
          title: '乡镇',
          dataIndex: 'pronunciation.town',
          key: 'town',
          align: 'center'
        },
        {
          title: '录音',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      pronunciation: [
        // {
        //   key: 1,
        //   pronunciation: {
        //     id: 19,
        //     word_id: 16,
        //     word_word: '阿尾哥',
        //     source: '',
        //     ipa: 'ap1 puai13 ko533',
        //     pinyin: 'a1 bue3 go1',
        //     contributor: 5,
        //     county: '涵江',
        //     town: '国欢',
        //     visibility: true
        //   },
        //   contributor: {
        //     id: 5,
        //     nickname: '这只是一个测试账号呢',
        //     avatar: ''
        //   }
        // }
      ]
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
      this.spinning = true
      await axios.get('words/' + this.id).then(res => {
        this.word = res.data.word
        this.analysedDefinition = this.splitDefinition(this.word.definition)
        this.form = {
          word: this.word.id,
          item: this.word.word,
          definition: this.word.definition,
          pinyin: this.word.standard_pinyin,
          ipa: this.word.standard_ipa
        }
      }).catch(() => {
        this.$message.destroy()
        this.$router.replace({ name: 'NotFound' })
      }).finally(() => {
        this.spinning = false
      })
      await axios.get('/pronunciation', { params: { word: this.id } }).then(res => {
        this.pronunciation = res.data.pronunciation
        this.pronunciation.forEach((item, index) => {
          item.key = index
        })
      })
    },
    /**
     * 打开录音弹框
     */
    openRecordingModal () {
      if (!this.$store.getters.loginStatus) {
        this.$message.error('请先登录后再贡献录音哦~')
        return
      }
      this.form.county = this.$store.getters.user.county
      this.form.town = this.$store.getters.user.town
      this.visible = true
    },
    /**
     * 具体解析一个待解析的字符串
     * @param definition 具体待解析的字符串
     */
    analyseDefinition (definition) {
      let index = definition.indexOf('：')
      if (index === -1) {
        index = definition.indexOf('△')
        if (index === -1) {
          index = definition.length
        } else index = index - 1
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
    },
    /**
     * 将数据库中的释义字符串进行拆分
     * @param definition 释义字符串
     */
    splitDefinition (definition) {
      const order = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']
      let lastIndex = -1
      const result = []
      for (let i = 0; i < order.length; i++) {
        const index = definition.indexOf(order[i])
        if (index < 0) break
        if (lastIndex !== -1) {
          result.push(this.analyseDefinition(definition.substring(lastIndex, index)))
        }
        lastIndex = index + 1
      }
      result.push(this.analyseDefinition(definition.substring(lastIndex)))
      return result
    }
  }
}
</script>

<style scoped>

</style>
