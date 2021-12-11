<template>
  <a-list
    :data-source="listSource || []"
    :loading="{spinning: loading, delay: 500}"
    :pagination="pagination"
  >
    <template v-slot:renderItem="item">
      <a-card
        :hoverable="true"
        style="width: 100%;"
      >
        <a-card-meta :description="item.word.definition.slice(0,100)">
          <template v-slot:title>
            <span style="font-size: 150%">
                {{ item.word.word }}
            </span>
            <span style="font-size: 80%;padding-left: 10px">
                {{ item.word.standard_pinyin }}
              </span>
            <span style="font-size: 80%;color: rgb(155,155,155);padding-left: 10px">
                / {{ item.word.standard_ipa }}/
              </span>
            <a-button
              type="link"
              icon="play-circle"
              :disabled="!item.word.url"
              @click="playSound(item.word.url)"
            />
          </template>
        </a-card-meta>
        <div style="text-align: end">
          <a-button type="link">
            <router-link :to="{name:'WordDetails',params:{id:item.word.id.toString()}}">
              更多
              <a-icon type="double-right" />
            </router-link>
          </a-button>
        </div>

      </a-card>
    </template>
  </a-list>
</template>
<script>
import axios from 'axios'

export default {
  name: 'WordList',
  data () {
    return {
      listSource: null,
      listDataLock: null,
      loading: false,
      currentPage: 1
    }
  },
  computed: {
    pagination () {
      return {
        onChange: page => {
          this.currentPage = page
          this.getCurrentPageData(page)
        },
        pageSize: this.pageSize,
        total: this.listDataLock ? this.listDataLock.length : 0,
        current: this.currentPage,
        showQuickJumper: true
      }
    }
  },
  props: {
    listData: Array,
    pageSize: Number
  },
  created () {
    this.listDataLock = Object.assign([], this.listData)
  },
  watch: {
    listData () {
      this.listDataLock = Object.assign([], this.listData)
      this.currentPage = 1
    },
    listDataLock () {
      if (!this.listDataLock) return
      if (this.listDataLock.length === 0) return
      this.getCurrentPageData(1)
    }
  },
  methods: {
    getCurrentPageData (page) {
      this.loading = true
      axios.put('/words', {
        words: this.listData.slice((page - 1) * this.pageSize, page * this.pageSize)
      }).then(async (res) => {
        this.listSource = res.data.words
        for (let i = 0; i < this.listSource.length; i++) {
          this.listSource[i].word.url = await this.getIPAPronunciation(this.listSource[i].word.standard_ipa)
        }
      }).finally(
        () => {
          this.loading = false
        }
      )
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
    }
  }
}
</script>
