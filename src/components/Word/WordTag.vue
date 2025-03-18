<script>
export default {
  name: 'WordTag',
  data () {
    return {
      maxLength: 10
    }
  },
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    stringToRBG (tag) {
      let value = '#'
      for (let i = 0; i < 3; ++i) {
        if (i >= tag.length) {
          value += '00'
          break
        }
        const temp = tag.codePointAt(i) % 256
        value += temp.toString(16)
      }
      return value
    },
    getTags (tag) {
      return tag.length > this.maxLength ? tag.slice(0, this.maxLength - 3) + '...' : tag
    }
  }
}
</script>

<template>
  <div>
    <a-tag v-for="tag in tags" :key="tag" :color="stringToRBG(tag)" bordered>{{ getTags(tag) }}</a-tag>
  </div>
</template>

<style scoped>

</style>
