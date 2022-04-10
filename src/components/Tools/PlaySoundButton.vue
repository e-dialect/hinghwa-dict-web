<template>
  <a-button :disabled="!url" icon="sound" size="small" type="link" @click="playSound(url)"/>
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
