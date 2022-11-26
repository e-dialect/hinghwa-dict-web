<template>
  <a-spin v-if="hasDeleted===false" :delay="500" :spinning="spinning">

    <a-row :gutter="20" justify="center" type="flex">
      <!--文章主体部分-->
      <a-col span="17">
        <SelectSearch>
          <!--标题、封面、简介-->
          <a-card>
            <template #title>
              <h1> {{ article.title }} </h1>
            </template>

            <template #cover>
              <img :alt="'这里本是文章的封面，其地址为'+article.cover+',但是显示不出来了'" :src="article.cover">
            </template>

            <p> 文章简介： {{ article.description }} </p>
          </a-card>

          <!---文章主体部分--->
          <a-card>
            <MarkdownViewer :text="article.content"/>
          </a-card>
          <!--评论区-->
          <a-card>
            <template #title>
              <h3> 评论区 </h3>
            </template>
            <a-spin :delay="500" :spinning="commentsLoading">
              <comment-list :id="id" :pageSize="8" :parent="0"/>
            </a-spin>
          </a-card>
        </SelectSearch>
      </a-col>

      <!--文章的附加信息-->
      <a-col span="7">
        <!-- 文章的附加信息-->

        <a-card style="margin-top: 16px" title="文章信息">
          <h3>文章作者：</h3>
          <a-card-meta :title="article.author.nickname">
            <router-link
              slot="avatar"
              :to="{name:'UserDetails',params:{id:article.author.id.toString()}}"
            >
              <a-avatar :src="article.author.avatar"/>
            </router-link>
          </a-card-meta>
          <br>
          <h3> 发布时间:<br>&nbsp;&nbsp;&nbsp;&nbsp;{{ article.publish_time }} </h3>
          <h3> 最近更新:<br>&nbsp;&nbsp;&nbsp;&nbsp;{{ article.update_time }} </h3>
          <h3>
            <a-icon type="eye"/>
            阅读量：{{ article.views }}
          </h3>
          <h3>
            <a-icon type="like"/>
            点赞量：{{ article.likes }}
          </h3>
        </a-card>

        <a-card style="margin-top: 16px" title="文章操作">
          <div style="text-align: center;line-height: 48px">
            <a-button
              :loading="btnLikeLoading"
              style="margin-top:8px"
              type="primary"
              @click="btnLikeClick"
            >
              {{ me.liked ? '取消' : '' }}点赞
            </a-button>

            <br>

            <a-popconfirm
              cancel-text="取消"
              ok-text="删除"
              title="文章一旦删除变无法找回，你确定要继续操作？"
              @confirm="deleteArticle"
            >

              <a-button
                v-if="me.is_author"
                :loading="btnDeleteLoading"
                type="primary"
              >
                删除
              </a-button>
            </a-popconfirm>

            <br>

            <router-link :to="{name:'ArticleEdit',params:{id: id}}">
              <a-button v-if="me.is_author" type="primary"> 编辑</a-button>
            </router-link>

          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
  <a-result
    v-else
    class="body"
    status="success"
    title="成功删除文章！"
  >
    <template #extra>
      <router-link :to="{name:'Home'}">
        <a-button>返回首页</a-button>
      </router-link>
    </template>
  </a-result>
</template>

<script>
import axios from 'axios'
import CommentList from '../../components/Articles/CommentList'
import MarkdownViewer from '../../components/Articles/MarkdownViewer'
import SelectSearch from '@/components/Tools/SelectSearch.vue'

export default {
  name: 'ArticleDetails',
  components: {
    MarkdownViewer,
    CommentList,
    SelectSearch
  },
  props: { id: String },
  data () {
    return {
      spinning: true,
      btnLikeLoading: false,
      btnDeleteLoading: false,
      hasDeleted: false, // 文章是否被删除
      article: {
        id: 0,
        author: {
          id: 0,
          username: 'username',
          nickname: 'nickname',
          email: 'edialect@edialect.top',
          telephone: '',
          registration_time: '2000-01-01 00:00:00',
          login_time: '2000-01-01 00:00:00',
          birthday: '2000-01-01 00:00:00',
          avatar: '',
          county: '',
          town: '',
          is_admin: false
        },
        likes: 0,
        views: 0,
        like_users: [],
        publish_time: '2000-01-01 00:00:00',
        update_time: '2000-01-01 00:00:00',
        title: 'title',
        description: 'description',
        content: 'content',
        cover: ''
      },
      me: {
        liked: false,
        is_author: false
      }
    }
  },
  computed: {
    commentsLoading () {
      return this.$store.getters.commentsLoading
    }
  },
  created () {
    axios.get('/articles/' + this.id).then(async (res) => {
      this.article = res.data.article
      this.me = res.data.me
      this.$store.commit('updateComments', this.id)
    }).catch(() => {
      this.$message.destroy()
      this.$router.replace({ name: 'NotFound' })
    }).finally(() => {
      this.spinning = false
    })
  },
  beforeRouteEnter (to, from, next) {
    if (to.params.id % 1 === 0) {
      next()
    } else {
      next({ name: 'NotFound' })
    }
  },
  methods: {
    /**
     * 点击按钮点赞/取消点赞触发事件
     */
    btnLikeClick () {
      if (!this.$store.getters.loginStatus) {
        this.$message.error('请先登录后再操作哦~')
        return
      }
      this.btnLikeLoading = true
      if (this.me.liked) {
        axios.delete('/articles/' + this.id + '/like').finally(() => {
          this.me.liked = false
          setTimeout(() => {
            this.article.likes -= 1
            this.btnLikeLoading = false
          }, 500)
        })
      } else {
        axios.post('/articles/' + this.id + '/like').finally(() => {
          this.me.liked = true
          // this.btnLikeLoading = false
          setTimeout(() => {
            this.article.likes += 1
            this.btnLikeLoading = false
          }, 500)
        })
      }
    },
    /**
     * 删除文章
     */
    deleteArticle () {
      this.btnDeleteLoading = true
      axios.delete('/articles/' + this.id).finally(() => {
        // axios.delete('http://127.0.0.1:4523/mock/404238/articles/' + this.id).finally(() => {
        setTimeout(() => {
          this.btnDeleteLoading = false
          this.hasDeleted = true
        }, 500)
      })
    }
  }
}
</script>

<style scoped>

</style>
