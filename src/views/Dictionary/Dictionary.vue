<template>
  <a-card>
    <template v-slot:title>
      <h1>音序查词</h1>
      <div style="color:gray">
        <!--行间距小一点-->
        <p>兴化语记作为在线工具同样提供词语查询功能。</p>
        <p>在输入框中输入词语，点击查询即可。</p>
      </div>
    </template>

    <!--选择拼音区域-->
    <a-row>
      <a-col v-for="(pinyin,index) in order" :key="index" :span="2">
        <a-tag closable @close="popPinyin(index)">
          {{ pinyin }}
        </a-tag>
      </a-col>
      <a-col key="prefix" v-if="prefix">
        <a-tag closable @close="prefix=''" color="blue">
          {{prefix.toUpperCase()}}
        </a-tag>
      </a-col>
    </a-row>
    <a-divider v-show="order.length || prefix"/>

    <!--显示拼音区域-->
    <template>
      <template v-for="list in nextNodeList">
        <a-card :key="list[0]" >
          <a-tag color="blue" @click="prefix=list[0]">
            {{String(list[0]).toUpperCase()}}
          </a-tag>
          <template v-for="pinyin in list[1]">
            <a-tag
              :key="pinyin"
              @click="pushPinyin(pinyin)"
            >
              {{ pinyin }}
            </a-tag>
          </template>
        </a-card>
      </template>
    </template>
    <a-divider v-show="nextNodeList.length && words.length"/>

    <!--显示查询词语-->
    <WordListShowing :list-source="words" v-if="words.length"/>
  </a-card>
</template>

<script>
import { getPhoneticOrder, searchDictionary } from '@/services/words'
import WordListShowing from '@/components/Word/WordListShowing.vue'

export default {
  name: 'Dictionary',
  components: { WordListShowing },
  data () {
    return {
      fullRecord: {},
      record: {},
      order: [],
      words: [],
      prefix: ''
    }
  },
  computed: {
    /**
     * a-z 顺序返回可以继续选择的拼音
     * @returns {*[string,string[]]} 首字母和拼音列表
     */
    nextNodeList () {
      const record = this.record
      const ans = {}
      for (const i in record) {
        if (i === 'has_word') continue
        if (i[0] in ans) {
          ans[i[0]] = [...ans[i[0]], i]
        } else {
          ans[i[0]] = [i]
        }
      }
      // sort ans
      for (const i in ans) {
        ans[i].sort()
      }
      // convert to array
      const ansArray = []
      for (const i in ans) {
        ansArray.push([i, ans[i]])
      }
      ansArray.sort()
      return ansArray
    }
  },
  async created () {
    this.fullRecord = await getPhoneticOrder()
    this.record = { ...this.fullRecord }
  },
  watch: {
    order: {
      handler (newOrder) {
        if (!newOrder.length) {
          this.words = []
          return
        }
        searchDictionary(newOrder, '', true).then(res => {
          this.words = res
        })
      },
      deep: true
    },
    prefix: {
      handler (newPrefix) {
        searchDictionary(this.order, newPrefix, true).then(res => {
          this.words = res
        })
      },
      deep: true
    }
  },
  methods: {
    /**
     * 新选中拼音
     * @param pinyin{string} 拼音
     */
    pushPinyin (pinyin) {
      this.order.push(pinyin)
      this.record = this.record[pinyin]
      this.prefix = ''
    },

    /**
     * 回退拼音列表
     * @param index{number} 回退到的位置
     */
    popPinyin (index) {
      this.order.splice(index)
      let record = this.fullRecord
      for (const i of this.order) {
        record = record[i]
      }
      this.record = record
      this.prefix = ''
    }
  }
}
</script>

<style scoped>

</style>
