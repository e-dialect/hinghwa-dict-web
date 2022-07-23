<template>
  <div>
    <a-row>
      <a-tag color="orange">己身</a-tag>
      <span v-for="(item, index) in selected" :key="index">
        <span>{{ ' 的 ' }}</span>
        <a-tag color="orange">{{ item }}</a-tag>
      </span>
    </a-row>

    <a-row>
      <a-button
        v-for="item in buttons"
        :key="item.name"
        :disabled="topLength > 1 || !top.relations[item.filed]"
        @click="push(item.filed)"
        style="margin: 5px"
      >
        {{ item.name }}
      </a-button>
      <a-button :disabled="stack.length === 1" @click="pop()" style="margin: 5px">
        <a-icon type="arrow-left"/>
      </a-button>
      <a-button @click="clear()" style="margin: 5px">AC</a-button>
    </a-row>

    <a-divider/>

    <div v-if="topLength > 1">
      <h2>你要找的是：</h2>
      <a-button
        v-for="(item, index) in stack[stack.length - 1]"
        :key="index"
        size="large"
        style="margin: 12px"
        @click="choose(item.name)"
      >
        {{ item.name }}
      </a-button>
    </div>
    <div v-else>
      <a-list :data-source="words">
        <template v-slot:renderItem="item">
          <a-card v-if="item.id" :hoverable="true" style="width: 100%">
            <a-card-meta :description="item.word.definition.slice(0, 100)">
              <template v-slot:title>
                <span style="font-size: 150%">
                  <router-link
                    :to="{ name: 'WordDetails', params: { id: item.word.id.toString() } }"
                    style="color: black"
                  >
                    {{ item.word.word }}
                  </router-link>
                </span>
                <span style="font-size: 80%; padding-left: 10px">
                  {{ item.word.standard_pinyin }}
                </span>
                <span
                  style="font-size: 80%; color: rgb(155, 155, 155); padding-left: 10px"
                >
                  / {{ item.word.standard_ipa }}/
                </span>
                <PlaySoundButton
                  :ipa="item.word.standard_ipa"
                  :pinyin="item.word.standard_pinyin"
                  :url="item.word.source"
                />
              </template>
            </a-card-meta>
            <div style="text-align: end">
              <a-button type="link">
                <router-link
                  :to="{ name: 'WordDetails', params: { id: item.word.id.toString() } }"
                >
                  更多
                  <a-icon type="double-right"/>
                </router-link>
              </a-button>
            </div>
          </a-card>
          <a-card v-else :hoverable="true" style="width: 100%">
            <a-card-meta description="（词条等待创建）">
              <template v-slot:title>
                <span style="font-size: 150%">
                  {{ item.word }}
                </span>
              </template>
            </a-card-meta>
            <div style="text-align: end">
              <a-button type="link">
                <router-link :to="{ name: 'WordCreate' }">
                  补充词条
                  <a-icon type="double-right"/>
                </router-link>
              </a-button>
            </div>
          </a-card>
        </template>
      </a-list>
    </div>
  </div>
</template>

<script>
import { buttons, fieldName, find, relative } from './relative'
import axios from 'axios'
import PlaySoundButton from './PlaySoundButton'

export default {
  name: 'RelationSelect',
  components: { PlaySoundButton },
  data () {
    return {
      stack: [[relative[0]]],
      select: [],
      words: []
    }
  },
  created () {
    this.push('fa')
    this.pop()
  },
  computed: {
    relations () {
      return relative
    },
    buttons () {
      return buttons
    },
    top () {
      return this.stack[this.stack.length - 1][0]
    },
    topLength () {
      return this.stack[this.stack.length - 1].length
    },
    selected () {
      const ans = []
      this.select.forEach((item) => {
        if (item) ans.push(item)
      })
      return ans
    }
  },
  methods: {
    push (field) {
      if (this.stack.length > 15) {
        this.$message.warning('关系层数太多了，可以考虑简化一下无效信息？')
        return false
      }

      if (!this.top.relations[field]) return false
      const ans = []
      if (typeof this.top.relations[field] !== 'string') {
        for (const i in this.top.relations[field]) {
          ans.push(find(this.top.relations[field][i]))
        }
      } else {
        ans.push(find(this.top.relations[field]))
      }
      this.select.push(fieldName[field])
      this.stack.push(ans)
      console.log(this.top)
    },
    choose (name) {
      this.stack.push([find(name)])
      this.select.push(null)
    },
    pop () {
      this.select.pop()
      this.stack.pop()
    },
    clear () {
      this.stack = [[relative[0]]]
      this.select = []
    }
  },
  watch: {
    async top (value) {
      console.log(this.top, value, this.words)
      const ans = []
      for (const item of value.words) {
        let tmp = {
          word: item.word,
          id: null
        }
        if (item.id) {
          await axios.get(`/words/${item.id}`).then((res) => {
            tmp = res.data
            tmp.url = res.data.word.source
            tmp.id = item.id
          })
        } else {
          tmp = { ...item }
        }
        ans.push(tmp)
      }
      console.log(ans)
      this.words = ans
    }
  }
}

</script>

<style scoped></style>
