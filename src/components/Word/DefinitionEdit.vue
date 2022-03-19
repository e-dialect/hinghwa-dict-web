<template>
  <div>
    <!--    <a-row type="flex" :gutter="4">-->
    <!--      <a-col >-->
    <!--        <a-popover title="格式帮助" placement="bottomLeft">-->
    <!--          <template slot="content">-->
    <!--            <p>每个义项用①②③等序号隔开</p>-->
    <!--            <p>例句在义项内容后用“：”表示，例句之间用“|”分割，最后用“。”表示结束</p>-->
    <!--            <p>对于例句的解释则用“（）”包裹起来</p>-->
    <!--            <p>若当前例句为俗语，则在开头加上“△”</p>-->
    <!--          </template>-->
    <!--          <a-button icon="question" size="small"/>-->
    <!--        </a-popover>-->
    <!--      </a-col>-->
    <!--    </a-row>-->

    <!--    <a-textarea v-model="text"/>-->
    <a-list
      item-layout="horizontal"
      :data-source="definitions"
    >
      <a-list-item slot="renderItem" slot-scope="item,index2">
        <a-list-item-meta>
          <a-row slot="title" type="flex" align="middle" :gutter="4">
            <a-col :span="1">
              <span>{{ OrderIndex[index2] }}</span>
            </a-col>
            <a-col :span="20">
              <a-input v-model="item.content" placeholder="义项内容"/>
            </a-col>
            <a-col :span="1">
              <a-button icon="plus" type="primary" size="small" @click="addItem(definitions,index2+1)"/>
            </a-col>
            <a-col :span="1">
              <a-button icon="minus" type="primary" size="small" @click="definitions.splice(index2,1)"/>
            </a-col>
          </a-row>
          <a-row
            type="flex"
            :gutter="4"
            align="middle"
            v-for="(exp,index) in item.example"
            :key="index"
            slot="description"
          >
            <a-col :span="3">
              <a-select style="width: 64px" v-model="exp.type">
                <a-select-option value="例">
                  例
                </a-select-option>
                <a-select-option value="俗">
                  俗
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="9">
              <a-input v-model="exp.content" placeholder="例句（可用~来代替原词语）"/>
            </a-col>
            <a-col :span="9">
              <a-input v-model="exp.explain" placeholder="对应句子的翻译"/>
            </a-col>
            <a-col :span="1">
              <a-button icon="plus" size="small" type="dashed" @click="addExplain(item.example,index+1)"/>
            </a-col>
            <a-col :span="1">
              <a-button icon="minus" size="small" type="dashed" @click="item.example.splice(index,1)"/>
            </a-col>
          </a-row>
          <div slot="description" style="text-align: center;padding: 8px">
            <a-button icon="plus" @click="addExplain(item.example)" size="small" type="dashed">
              增加新例句或俗语
            </a-button>
          </div>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item>
        <div style="text-align: center">
          <a-button icon="plus" type="primary" @click="addItem(definitions)">
            增加新义项
          </a-button>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { order, splitDefinition, combineDefinitions } from './Definition.js'

export default {
  name: 'DefinitionEdit',
  props: { definition: String },
  model: {
    prop: 'definition'
  },
  data () {
    return {
      OrderIndex: order,
      definitions: []
    }
  },
  created () {
    this.definitions = this.definition ? splitDefinition(this.definition) : []
  },
  computed: {
    text: {
      get () {
        if (this.definition) {
          return combineDefinitions(this.definitions.map((item, index) => {
            const value = { ...item }
            value.content = order[index] + value.content
            return value
          }))
        } else {
          return []
        }
      },
      set (value) {
        this.definitions = splitDefinition(value)
        this.definitions.forEach(item => {
          while (item.content && order.indexOf(item.content[0]) !== -1) {
            item.content = item.content.substring(1)
          }
        })
        this.$emit('input', value)
      }
    },
    index () {
      let i = 0
      while (i < 10) {
        if (this.definition.includes(order[i]) === true) {
          i++
        } else {
          break
        }
      }
      return i
    }
  },
  watch: {
    definition (value) {
      if (!value) {
        this.definitions = []
        return
      }
      this.definitions = splitDefinition(value)
      this.definitions.forEach(item => {
        item.content = item.content.substring(1)
      })
    }
  },
  methods: {
    addExplain (array, index = array.length) {
      array.splice(index, 0, {
        type: '例',
        content: '',
        explain: ''
      })
    },
    addItem (array, index = array.length) {
      array.splice(index, 0, {
        content: '',
        example: []
      })
    }
  }
}
</script>

<style scoped>

</style>
