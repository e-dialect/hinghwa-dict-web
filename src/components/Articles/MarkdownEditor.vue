<template>
  <mavon-editor
    ref="md"
    v-model="content"
    style="z-index: auto"
    @imgAdd="$imgAdd"
    @imgDel="$imgDel"
    :xssOptions="xss"
  />
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { checkImageBeforeUpload, deleteFile, uploadFile } from '@/services/website'

export default {
  name: 'MarkdownEditor',
  components: {
    mavonEditor
  },
  props: ['value'],
  data () {
    return {
      xss: {
        whiteList: {
          iframe: ['src', 'height', 'width'],
          div: ['style', 'height', 'width', 'align']
        }
      }
    }
  },
  computed: {
    content: {
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
     * mavonEditor 绑定@imgAdd event
     * @param pos markdown编辑器中图片的位置
     * @param $file 用户上传的图片文件
     */
    $imgAdd (pos, $file) {
      if (checkImageBeforeUpload($file)) {
        uploadFile($file).then(url => {
          this.$refs.md.$img2Url(pos, url)
        })
      }
    },

    /**
     * mavonEditor 绑定@imgDel event
     * @param pos markdown编辑器中图片的位置
     */
    $imgDel (pos) {
      deleteFile({ url: pos[0] }).then(() => {
        this.$message.success('成功删除图片' + pos[1].name)
      }).catch(err => {
        this.$message.destroy()
        switch (err.status) {
          case 401: {
            this.$message.error('无权限：请检查您的登录状态')
            break
          }
          case 404: {
            this.$message.warn('图片不存在！已忽略本次操作')
            break
          }
          default: {
            this.$message.error(err.toString())
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
