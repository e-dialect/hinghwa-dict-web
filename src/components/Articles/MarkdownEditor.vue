<template>
  <mavon-editor
    ref="md"
    v-model="content"
    style="z-index: auto"
    @imgAdd="$imgAdd"
    @imgDel="$imgDel"
  />
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from 'axios'
import { beforeUpload, imageUpload } from './ImageUpload'

export default {
  name: 'MarkdownEditor',
  components: {
    mavonEditor
  },
  props: ['value'],
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
     * 上传图片
     * @param file 即将上传的图片文件
     */
    async imageUpload (file) {
      return new Promise(resolve => {
        var formdata = new FormData()
        formdata.append('file', file)
        axios({
          url: '/website/files',
          method: 'post',
          data: formdata,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then((res) => {
          resolve(res.data.url)
          this.$message.success('成功上传啦~')
        }).catch(err => {
          this.$message.destroy()
          switch (err.response.status) {
            case 401: {
              this.$message.error('无权限：请检查您的登录状态')
              break
            }
            default: {
              this.$message.error(err.toString())
            }
          }
        })
      })
    },
    /**
     * mavonEditor 绑定@imgAdd event
     * @param pos markdown编辑器中图片的位置
     * @param $file 用户上传的图片文件
     */
    $imgAdd (pos, $file) {
      if (beforeUpload($file)) {
        imageUpload($file).then(url => {
          this.$refs.md.$img2Url(pos, url)
        })
      }
    },

    /**
     * mavonEditor 绑定@imgDel event
     * @param pos markdown编辑器中图片的位置
     */
    $imgDel (pos) {
      axios.delete('/website/files', { data: { url: pos[0] } }).then(() => {
        this.$message.success('成功删除图片' + pos[1].name)
      }).catch(err => {
        this.$message.destroy()
        console.log(pos[0])
        console.log(pos[1])
        console.log(err.response)
        switch (err.response.status) {
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
