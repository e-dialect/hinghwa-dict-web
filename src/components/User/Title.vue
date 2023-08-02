<script>
export default {
  name: 'Title',
  props: {
    title: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  computed: {
    fontColor () {
      if (!this.title.color) return '#000000'
      const backgroundColor = parseInt(this.title.color.slice(1), 16)
      const r = backgroundColor >> 16
      const g = backgroundColor >> 8 & 0xFF
      const b = backgroundColor & 0xFF
      return (r * 0.299 + g * 0.587 + b * 0.114).toFixed(0) > 186 ? '#000000' : '#FFFFFF'
    }
  }
}
</script>

<template>
  <div class="titleMain" :style="{backgroundColor: title.color,color: fontColor}">
    {{title.title}}
  </div>
</template>

<style scoped>
.titleMain{
  padding: 0 5px;
  border-radius: 4px;
}
</style>
