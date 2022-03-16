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

        <a-button
          type="link"
          icon="play-circle"
          :disabled="!standard_pronunciation"
          @click="playSound(standard_pronunciation)"
        />
      </template>

      <template v-slot:extra>
        创建者:
        <router-link :to="{name:'UserDetails',params:{id:word.contributor.id.toString()}}">
          {{ word.contributor.nickname }}
        </router-link>
      </template>

      <!--释义-->

      <div style="padding:15px">
        <a-tag color="rgb(179, 7, 30,0.7)"> 释义</a-tag>
      </div>
      <a-row type="flex" justify="center">
        <a-col :span="22">
          <Definition :definition="word.definition"/>
        </a-col>
      </a-row>

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
              <a-avatar :src="record.contributor.avatar" />
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
        访问量:{{ word.views }}
      </p>
    </a-card>
  </a-spin>
</template>

<script>

import axios from 'axios'
import ArticleList from '../../components/Articles/ArticleList'
import Recording from '../../components/Pronunciation/Recording'
import Definition from '../../components/Word/Definition'

export default {
  name: 'WordDetails',
  props: ['id'],
  components: {
    Definition,
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
      this.spinning = true
      await axios.get('words/' + this.id).then(res => {
        this.word = res.data.word
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
     * 播放音频
     * @param url 音频地址
     */
    playSound (url) {
      const player = new Audio(url)
      player.play()
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
    }
  }
}
</script>

<style scoped>

</style>
