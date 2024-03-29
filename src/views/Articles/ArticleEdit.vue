<template>
  <div v-show="isAuthor" class="body">
    <!--标题区域-->
    <h1 style="margin-left: 8vw;margin-top: 20px"> 文章创作中心 </h1>

    <!--这是一条分割线-->
    <a-divider/>

    <!--文章封面-->
    <a-row
      :gutter="12"
      align="middle"
      justify="center"
      style="padding-top:10px;padding-bottom:60px;"
      type="flex"
    >

      <a-col span="3">
        <h3>文章封面 </h3>
      </a-col>

      <a-col span="12">
        <a-input v-model="article.cover"></a-input>
        <a-upload
          :before-upload="checkImageBeforeUpload"
          :customRequest="customRequest"
          :show-upload-list="false"
        >
          <a-button :loading="btnCoverLoading">
            <a-icon type="upload"/>
            更换封面图片
          </a-button>
        </a-upload>
        <img :src="article.cover" alt="文章目前的封面图片" style="width: 100%"/>
      </a-col>
    </a-row>

    <!--文章名称-->
    <a-row
      :gutter="12"
      align="middle"
      justify="center"
      style="padding-top:10px;padding-bottom:60px;"
      type="flex"
    >
      <a-col span="3">
        <h3>文章名称 </h3>
      </a-col>
      <a-col span="12">
        <a-input v-model="article.title" placeholder="输入文章名称"/>
      </a-col>
    </a-row>

    <!--文章简介-->
    <a-row
      :gutter="12"
      align="middle"
      justify="center"
      style="padding-top:10px;padding-bottom:60px;"
      type="flex"
    >

      <a-col span="3">
        <h3>文章简介 </h3>
      </a-col>
      <a-col span="12">
        <a-textarea v-model="article.description" :rows="4" placeholder="输入文章简介"/>
      </a-col>
    </a-row>

    <!--文章内容-->
    <a-row
      align="middle"
      justify="center"
      type="flex"
    >
      <MarkdownEditor v-model="article.content"/>
      <a-button
        :loading="btnArticleLoading"
        type="primary"
        @click="id?updateArticle():createArticle()"
      >
        {{ id ? '更新文章' : '创建文章' }}
      </a-button>
    </a-row>

  </div>
</template>

<script>
import axios from 'axios'
import { checkImageBeforeUpload, uploadFile } from '@/services/website'
import MarkdownEditor from '@/components/Articles/MarkdownEditor'

export default {
  name: 'ArticleEdit',
  // props: { articleID: String },
  data () {
    return {
      checkImageBeforeUpload: checkImageBeforeUpload,
      // 用户输入的文章名称和简介
      article: {
        title: '',
        description: '',
        content: '',
        cover: 'https://cos.edialect.top/website/默认封面.png'
      },
      buttonContent: '创建文章',
      btnArticleLoading: false,
      btnCoverLoading: false,
      submit: false,
      isAuthor: false,
      compareArticle: { ...this.article }
    }
  },
  components: {
    MarkdownEditor
  },
  computed: {
    /**
     * 在edit文章时，返回int类型的文章id
     */
    id () {
      if (this.$route.name === 'ArticleCreate') {
        return 0
      } else {
        return +this.$attrs.id
      }
    }
  },

  methods: {
    /**
     * 创建文章时的命令操作
     */
    createArticle () {
      this.btnArticleLoading = true
      axios.post('/articles', Object.assign({}, this.article)).then(res => {
        this.submit = true
        this.$message.success('恭喜你，创建成功！')
        this.$router.push({
          name: 'ArticleDetails',
          params: { id: res.data.id.toString() }
        })
      }).catch(err => {
        this.$message.destroy()
        switch (err.response.status) {
          case 401: {
            this.$message.error('登录状态无效！请重新登录！')
            break
          }
          case 400: {
            this.$message.error('请完成所有内容！')
            break
          }
          case 500: {
            this.$message.error('服务器错误！请联系管理员！')
            this.$message.error('错误内容:' + err.response.data.msg)
            break
          }
        }
      }).finally(() => {
        this.btnArticleLoading = false
      })
    },

    /**
     * 更新文章时候的命令操作
     */
    updateArticle () {
      this.btnArticleLoading = true
      axios.put('/articles/' + this.id, {
        article: {
          title: this.article.title,
          description: this.article.description,
          content: this.article.content,
          cover: this.article.cover
        }
      }).then(() => {
        this.submit = true
        this.$message.success('文章更新成功！')
        this.$router.push({
          name: 'ArticleDetails',
          params: { id: this.id.toString() }
        })
      }).catch(err => {
        this.$message.destroy()
        switch (err.response.status) {
          case 401: {
            this.$message.error('登录状态异常！请重新登录后再试！')
            break
          }
          default: {
            this.$message.error(err.toString())
          }
        }
      }).finally(() => {
        this.btnArticleLoading = false
      })
    },

    /**
     *  @name getArticleDetails
     *  @brief 获取文章内容
     */
    getArticleDetails () {
      if (this.id) {
        axios.get('/articles/' + this.id).then(res => {
          this.isAuthor = res.data.me.is_author
          if (this.isAuthor === false) {
            this.$message.error('你没有权限编辑本文！')
            this.$router.push({ name: 'Forbidden' })
          }
          this.article = res.data.article
          this.compareArticle = { ...this.article }
        })
      }
    },
    /**
     * 自定义上传文件请求
     * @param data 需要上传文件
     */
    customRequest (data) {
      this.btnCoverLoading = true
      uploadFile(data.file).then(url => {
        this.article.cover = url
        this.btnCoverLoading = false
      })
    },
    /**
     * 初始化页面内容
     */
    initPageContent () {
      if (this.$route.name === 'ArticleCreate') {
        this.article = {
          title: '',
          description: '',
          content: '',
          cover: 'https://cos.edialect.top/website/默认封面.png'
        }
        this.compareArticle = { ...this.article }
        this.isAuthor = true
      } else {
        this.getArticleDetails()
      }
    }

  },

  created () {
    this.initPageContent()
  },

  watch: {
    $route () {
      this.initPageContent()
    }
  },

  beforeRouteEnter (to, from, next) {
    if (to.name === 'ArticleCreate') {
      next()
    } else if (to.params.id % 1 === 0) {
      next()
    } else {
      next({ name: 'NotFound' })
    }
  },

  beforeRouteLeave (to, from, next) {
    let deng = true
    for (const i in this.article) {
      if (this.article[i] !== this.compareArticle[i]) deng = false
    }
    const key = 'page'
    if (this.submit === true) deng = true
    if (!deng) {
      this.$notification.warning({
        key,
        message: '确认离开？',
        description:
          '您对当前文章进行过修改，确认放弃修改直接离开？',
        btn: h => {
          return h(
            'a-button',
            {
              props: {
                type: 'primary',
                size: 'small'
              },
              on: {
                click: () => {
                  next()
                  this.$notification.close(key)
                }
              }
            },
            '确定'
          )
        },
        duration: 0,
        style: {
          zIndex: 'auto',
          color: 'red'
        },
        placement: 'bottomLeft'
      })
    } else {
      next()
    }
  }
}
</script>

<style scoped>
.body {
  background: white;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
