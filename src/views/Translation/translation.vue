<template>
<a-card>
  <h1>语音识别</h1>
  <a-layout>
    <a-layout-header style="background: white">
  <translation-header/>
    </a-layout-header>
    <a-layout-content>
      <div>
        <router-view/>
      </div>
    </a-layout-content>
  </a-layout>
</a-card>
</template>

<script>
import TranslationHeader from '@/views/Translation/translationHeader'
export default {
  name: 'translation',
  components: { TranslationHeader }
}
</script>

<style scoped>

</style>
