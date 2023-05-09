<template>
  <a-spin :delay="500" :spinning="spinning">
    <a-card style="padding:32px">

      <template v-slot:title>
        <h1 style="padding-left:32px; color: rgb(26,26,73); font-size:250%">
          <strong>
            {{ word.word }}
          </strong>
        </h1>
        <span style="font-size: 100%;padding-left: 50px">
          {{ word.standard_pinyin }}
        </span>
        <span style="font-size: 100%;color: rgb(155,155,155);padding-left: 18px">
          / {{ word.standard_ipa }}/
        </span>
        <PlaySoundButton :url="word.source" :pinyin="word.standard_pinyin" :ipa="word.standard_ipa"/>
      </template>

      <template v-slot:extra>
        <a-row>
          <router-link :to="{name:'WordEdit',params:{id:word.id}}">
            <a-button icon="edit" size="small"> 编辑词条</a-button>
          </router-link>
        </a-row>
        <a-row style="padding-top: 16px">
          创建者:
          <router-link :to="{name:'UserDetails',params:{id:word.contributor.id.toString()}}">
            {{ word.contributor.nickname }}
          </router-link>
        </a-row>

      </template>

      <!--释义-->
      <div>
        <a-tag color="rgb(179, 7, 30,0.7)"> 释义</a-tag>
      </div>
      <a-row justify="center" type="flex">
        <a-col :span="22">
          <Definition :definition="word.definition"/>
        </a-col>
      </a-row>

      <div v-if="word.mandarin.length" style="padding-top:32px">
        <a-tag color="rgb(179, 7, 30,0.7)"> 普通话词汇</a-tag>
        <template v-for="(tag,index) in word.mandarin">
          <a-tag :key="index" color="blue">
            <a :href="`https://www.baidu.com/s?wd=${tag}`" target="_blank">{{ tag }}</a>
          </a-tag>
        </template>
      </div>

      <div v-if="word.related_words.length" style="padding-top:32px">
        <a-tag color="rgb(179, 7, 30,0.7)">相关词汇</a-tag>
        <router-link
          v-for="(tag,index) in word.related_words"
          :key="index"
          :to="{name:'WordDetails',params:{id:tag.id}}"
        >
          <a-tag color="blue">{{ tag.word }}</a-tag>
        </router-link>
      </div>

      <!--百科-->
      <div v-if="word.annotation" style="padding-top:32px">
        <a-tag color="rgb(179, 7, 30,0.7)"> 附注</a-tag>
        <a-row justify="center" type="flex">
          <a-col :span="22">
            <MarkdownViewer :text="word.annotation"/>
          </a-col>
        </a-row>
      </div>

      <!--发音列表-->
      <div style="padding-top:32px">
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
              <audio :src="record.pronunciation.source" controls/>
            </span>
          </a-table>
        </a-col>
      </a-row>

      <!--相关文章-->
      <div v-if="word.related_articles.length" style="padding-top:32px">
        <a-tag color="rgb(179, 7, 30,0.7)"> 相关文章</a-tag>
        <a-row justify="center" type="flex">
          <a-col :span="22">
            <ArticleList
              :list-data="word.related_articles.map(item=>{return item.id})"
              :page-size="3"
            />
          </a-col>
        </a-row>
      </div>
      <p style="margin-top: 40px">
        <a-icon type="eye"></a-icon>
        访问量:{{ word.views }}
      </p>
    </a-card>
  </a-spin>
</template>

<script>

import axios from 'axios'
import ArticleList from '../../components/Articles/ArticleList'
import Recording from '../../components/Pronunciation/Recording'
import DefinitionShow from '../../components/Word/DefinitionShow'
import PlaySoundButton from '../../components/Tools/PlaySoundButton'
import MarkdownViewer from '../../components/Articles/MarkdownViewer'
import { getWordDetails } from '@/services/words'

export default {
  name: 'WordDetails',
  props: ['id'],
  components: {
    MarkdownViewer,
    PlaySoundButton,
    Definition: DefinitionShow,
    Recording,
    ArticleList
  },
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
      standard_pronunciation: null,
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
      await getWordDetails(this.id).then(res => {
        this.word = res.word
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
      if (this.$store.getters.user.county !== '' && this.$store.getters.user.town !== '') {
        this.form.county = this.$store.getters.user.county
        this.form.town = this.$store.getters.user.town
      }
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
