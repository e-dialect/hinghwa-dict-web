<template>
  <mavon-editor
    :editable="false"
    :subfield="false"
    :toolbarsFlag="false"
    :value="text"
    class="md"
    defaultOpen="preview"
    style="z-index: auto"
    :xssOptions="xss"
  >
  </mavon-editor>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'MarkdownViewer',
  components: { mavonEditor },
  props: ['text'],
  data () {
    return {
      xss: {
        whiteList: {
          iframe: ['src', 'height', 'width'],
          div: ['style', 'height', 'width', 'align']
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
