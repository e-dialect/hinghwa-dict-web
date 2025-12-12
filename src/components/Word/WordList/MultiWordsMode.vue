<script>
import PlaySoundButton from '@/components/Tools/PlaySoundButton.vue'
import EyeOutlined from '@ant-design/icons-vue/lib/icons/EyeOutlined'
import { splitDefinition } from '@/components/Word/Definition'
export default {
  name: 'MultiWordsMode',
  components: { PlaySoundButton, EyeOutlined },
  props: {
    list: {
      type: Array,
      default: () => {}
    }
  },
  data () {
    return {
      hideList: []
    }
  },
  async beforeMount () {
    this.hideList = this.list.map(() => false)
  },
  methods: {
    hideAll () {
      if (!this.hideList.includes(false)) {
        this.hideList = this.list.map(() => false)
        return
      }
      this.hideList = this.list.map(() => true)
    },
    showTarget (target) {
      this.$set(this.hideList, target, false)
    },
    splitDefinition
  }
}
</script>

<template>
  <div style="margin: auto 20px">
    <span style="line-height: 32px;margin-right: 10px;font-size: 1.1em">隐藏所有释义</span>
    <a-button type="primary" @click="hideAll">隐藏</a-button>
    <a-row class="single-word" v-for="(item, index) in list" :key="index">
      <a-col :span="4" style="font-weight: bold;color: #000;font-size: 1.2em">
        {{item.word}}
      </a-col>
      <a-col :span="7">
        <span v-if="!hideList[index]">
          <span style="color: #000">释义：</span>
          <span v-for="(definition, index) in splitDefinition(item.definition)" :key="index">
            <span v-if="index > 0">、</span>
            <span>{{definition.content}}</span>
          </span>
        </span>
        <span v-else>***<EyeOutlined class="eye-outlined" @click="showTarget(index)"/></span>
      </a-col>
      <a-col :span="10">
        <span style="color: #000">发音：</span>
        <span style="color: #222;margin-right: 10px">{{item.standard_pinyin}}</span>
        <span style="color: rgb(155,155,155)">/{{item.standard_ipa}}/</span>
        <PlaySoundButton :ipa="item.standard_ipa" :pinyin="item.standard_pinyin" :word-id="item.id"/>
      </a-col>
      <a-col :span="3">
        <a-button type="link" @click="$router.push(`/words/${item.id}`)">
          详细解释 >
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.single-word {
  padding: 10px 20px;
  border: solid 1px #ccc;
  margin-top: 10px;
  border-radius: 6px;
  line-height: 32px;
}
.single-word:hover{
  background-color: #f5f5f5;
}
.eye-outlined {
  color: #1890ff;
  cursor: pointer;
  margin-left: 10px;
}
</style>
