<template>
  <div>
    <a-spin
      :delay="500"
      :spinning="loading">
      <a-collapse
        v-if="characters.length"
        :activeKey="Array.from(characters.keys())"
        :bordered="false"
        style="font-size: 22px;padding: 10px;background-color: white"
      >
        <a-collapse-panel
          v-for="(item,index) in characters "
          :key="index.toString()"
          :header="item.label===item.traditional?`${item.label}`:`${item.label}（${item.traditional}）`"
        >
          <div v-for="(jtem,index2) in item.characters" :key="index2.toString()">
            <a-breadcrumb>
              <a-breadcrumb-item>{{ jtem.county }}</a-breadcrumb-item>
              <a-breadcrumb-item>{{ jtem.town }}</a-breadcrumb-item>
            </a-breadcrumb>
            <span v-for="(ktem,index3) in jtem.characters" :key="index3.toString()" style="padding-right: 16px">
              <span v-if="ktem.word===null">{{ ktem.pinyin }}</span>
              <router-link v-else :to="{name:'WordDetails',params:{id:ktem.word}}">{{ ktem.pinyin }}</router-link>
              <PlaySoundButton :url="ktem.source" :pinyin="ktem.pinyin"/>
            </span>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <a-empty v-else description="暂无数据"/>
    </a-spin>
  </div>
</template>

<script>
import axios from 'axios'
import PlaySoundButton from './PlaySoundButton'

export default {
  name: 'PinyinList',
  components: { PlaySoundButton },
  props: ['keyWords'],
  data () {
    return {
      loading: true,
      characters: [
        {
          label: '行',
          characters: [
            {
              county: '莆田',
              town: '城里',
              characters: [
                {
                  id: 135,
                  shengmu: 'g',
                  ipa: 'ka13',
                  pinyin: 'ga2',
                  yunmu: 'a',
                  shengdiao: '2',
                  character: '行',
                  county: '莆田',
                  town: '城里',
                  word: null,
                  source: 'null'
                },
                {
                  id: 895,
                  shengmu: 'h',
                  ipa: 'haŋ13',
                  pinyin: 'hang2',
                  yunmu: 'ang',
                  shengdiao: '2',
                  character: '行',
                  county: '莆田',
                  town: '城里',
                  word: 'null',
                  source: 'null'
                },
                {
                  id: 1504,
                  shengmu: 'h',
                  ipa: 'hɛŋ13',
                  pinyin: 'heng2',
                  yunmu: 'eng',
                  shengdiao: '2',
                  character: '行',
                  county: '莆田',
                  town: '城里',
                  word: 'null',
                  source: 'null'
                },
                {
                  id: 3850,
                  shengmu: 'h',
                  ipa: 'hiŋ13',
                  pinyin: 'hing2',
                  yunmu: 'ing',
                  shengdiao: '2',
                  character: '行',
                  county: '莆田',
                  town: '城里',
                  word: 'null',
                  source: 'null'
                },
                {
                  id: 4137,
                  shengmu: 'g',
                  ipa: 'kia13',
                  pinyin: 'gia2',
                  yunmu: 'ia',
                  shengdiao: '2',
                  character: '行',
                  county: '莆田',
                  town: '城里',
                  word: 2237,
                  source: 'null'
                },
                {
                  id: 5759,
                  shengmu: 'Ǿ',
                  ipa: 'ŋ13',
                  pinyin: 'ng2',
                  yunmu: 'ng',
                  shengdiao: '2',
                  character: '行',
                  county: '莆田',
                  town: '城里',
                  word: 4000,
                  source: 'null'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    activeKey () {
      return [...this.characters.keys()]
    }
  },
  created () {
    this.getPinyin(this.keyWords)
  },
  watch: {
    keyWords () {
      this.getPinyin(this.keyWords)
    }
  },
  methods: {
    getPinyin (key) {
      if (!key) {
        this.characters = {}
        return
      }
      this.loading = true
      axios.get('/characters/words/v2', { params: { search: key } }).then(res => {
        this.characters = res.data.characters
      }).finally(() => {
        this.loading = false
      })
    },
    playSound (url) {
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>

</style>
