<template>
  <div>
    <template v-for="(tag,index) in tags">
      <a-tag :key="index" :closable="true" @close="tags.splice(index,1)">
        {{ tag }}
      </a-tag>
    </template>
    <a-input
      v-if="inputVisible"
      ref="input"
      v-model="inputValue"
      :style="{ width: '78px' }"
      size="small"
      type="text"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
      <a-icon type="plus"/>
      {{ tips }}
    </a-tag>
  </div>
</template>

<script>

export default {
  name: 'LineTags',
  props: ['value', 'tips'],
  model: {
    prop: 'value'
  },
  data () {
    return {
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    tags: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    /**
     * 普通话词汇 显示文本输入框
     */
    showInput () {
      this.inputVisible = true
      this.$nextTick(function () {
        this.$refs.input.focus()
      })
    },

    /**
     * 普通话词汇 添加关键词
     */
    handleInputConfirm () {
      const inputValue = this.inputValue
      if (inputValue && this.tags.indexOf(inputValue) === -1) {
        this.tags = [...this.tags, inputValue]
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>

</style>
