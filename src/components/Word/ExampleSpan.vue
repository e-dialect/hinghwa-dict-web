<template>
  <span>
    <span v-for="(item,index) in (spans||[])" :key="index">
      <span v-if="item.type===0" style="color:black"> {{ item.content }} </span>
      <strong v-if="item.type===1" style="color:red;font-weight: bold"> {{ item.content }} </strong>
    </span>
  </span>

</template>

<script>
export default {
  name: 'ExampleSpan',
  props: ['content'],
  data () {
    return {}
  },
  computed: {
    spans () {
      const spans = []
      const s = this.content + '～'
      let now = ''
      for (let i = 0; i < s.length; i++) {
        if (s[i] === '～') {
          spans.push({
            content: now,
            type: 0
          })
          spans.push({
            content: '～',
            type: 1
          })
          now = ''
        } else {
          now = now + s[i]
        }
      }
      spans.pop()
      return spans
    }
  }
}
</script>

<style scoped>

</style>
