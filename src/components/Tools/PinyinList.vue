<template>
  <div>
    <a-spin
      :spinning="loading"
      :delay="500">
      <a-collapse
        :bordered="false"
        style="font-size: 22px;padding: 10px;background-color: white"
        :activeKey="Array.from(characters.keys())"
      >
        <a-collapse-panel
          v-for="(item,index) in characters "
          :header="item.label"
          :key="index.toString()"
        >
          {{ item.characters.map(jtem => jtem.pinyin).join('&nbsp;&nbsp;&nbsp;&nbsp;') }}
        </a-collapse-panel>
      </a-collapse>
    </a-spin>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PinyinList',
  props: ['keyWords'],
  data () {
    return {
      loading: true,
      characters: [
        {
          label: '',
          characters: [
            {
              id: 0,
              shengmu: '',
              ipa: '',
              pinyin: '',
              yunmu: '',
              shengdiao: '',
              character: '',
              county: '',
              town: ''
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
      axios.get('/characters/words', { params: { search: key } }).then(res => {
        this.characters = res.data.characters
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
