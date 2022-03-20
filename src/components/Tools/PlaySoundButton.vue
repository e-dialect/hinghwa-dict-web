<template>
  <a-button icon="sound" size="small" type="link" :disabled="!url" @click="playSound(url)"/>
</template>

<script>

export default {
  props: ['url'],
  name: 'PlaySoundButton',
  methods: {
    playSound (url) {
      new Audio(url).play()
    }
  }
}
</script>

<style scoped>

</style>
