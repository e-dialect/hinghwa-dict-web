<template>
  <a-spin v-if="hasDeleted===false" :delay="500" :spinning="spinning">
    <a-row :gutter="20" justify="center" type="flex">
      <!--文章主体部分-->
      <a-col span="17">

        <!--标题、封面、简介-->
        <a-card>
          <template #title>
            <h1> {{ article.title }} </h1>
          </template>

          <template #extra>
            <a-button
              v-if="me.is_author"
              :loading="btnDeleteLoading"
              type="primary"
              @click="deleteArticle"
            >
              删除
            </a-button>
            <router-link :to="{name:'ArticleEdit',params:{id: id}}">
              <a-button v-if="me.is_author" type="primary"> 编辑</a-button>
            </router-link>
            <a-button :loading="btnLikeLoading" type="primary" @click="btnLikeClick">
              {{ me.liked ? "取消" : "" }}收藏
            </a-button>
          </template>

          <template #cover>
            <img :alt="'这里本是文章的封面，其地址为'+article.cover+',但是显示不出来了'" :src="article.cover">
          </template>

          <p> 文章简介： {{ article.description }} </p>
        </a-card>

        <!---文章主体部分--->
        <a-card>
          <mavon-editor
            :editable="false"
            :subfield="false"
            :toolbarsFlag="false"
            :value="article.content"
            class="md"
            defaultOpen="preview"
            style="z-index: auto"
          >
          </mavon-editor>
        </a-card>
        <a-card>
          <h3> 发布时间:&nbsp;&nbsp;{{ article.publish_time }} </h3>
          <h3> 最近更新:&nbsp;&nbsp;{{ article.update_time }} </h3>
        </a-card>
      </a-col>

      <!--文章的附加信息（含未来的评论区功能等-->
      <a-col span="7">
        <!-- 文章的附加信息-->
        <a-card>
          <h3>
            作者:&nbsp;&nbsp;
            {{ article.author.nickname }}
          </h3>
        </a-card>

        <!--评论区-->
        <a-card>
          <template #title>
            <h3> 评论区 </h3>
          </template>
          <div>

            <!--现有评论列表-->
            <a-list
              :loading="{spinning: commentsLoading, delay: 500}"
              :data-source="comments"
              :header="`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`"
              :pagination="{pageSize: 8}"
              item-layout="horizontal"
            >
              <template v-slot:renderItem="item">
                <a-list-item>
                  <a-comment
                    :author="item.user.username"
                    :content="item.content"
                    :datetime="item.time">
                    <template v-slot:avatar>
                      <router-link :to="{name:'UserDetails',params:{id:item.user.id}}">
                        <a-avatar :src="item.user.avatar"></a-avatar>
                      </router-link>
                    </template>
                    <template slot="actions">
                      <span
                        v-if="item.user.id===user.id"
                        @click="commentDelete(item.id)"
                      >
                       删除评论
                      </span>
                    </template>
                  </a-comment>
                </a-list-item>
              </template>
            </a-list>

            <!--新提交的评论-->
            <a-comment>
              <template v-slot:avatar>
                <a-avatar
                  :alt="user.nickname"
                  :src="user.avatar"
                />
              </template>
              <template v-slot:content>
                <a-form-item>
                  <a-textarea v-model="newCommentValue" :rows="4"/>
                </a-form-item>
                <a-form-item>
                  <a-button
                    :disabled="newCommentValue===''"
                    :loading="btnCommentSubmitting"
                    html-type="submit" type="primary"
                    @click="commentSubmit(0)"
                  >
                    评论
                  </a-button>
                </a-form-item>
              </template>
            </a-comment>
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
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import moment from 'moment'

export default {
  name: 'ArticleDetails',
  components: { mavonEditor },
  props: { id: String },
  data () {
    return {
      spinning: true,
      btnLikeLoading: false,
      btnDeleteLoading: false,
      hasDeleted: false,
      btnCommentSubmitting: false,
      commentsLoading: false,
      newCommentValue: '',
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
          avatar: 'http://dummyimage.com/100x100',
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
        cover: 'http://dummyimage.com/160x90'
      },
      me: {
        liked: false,
        is_author: false
      },
      comments: [
        {
          id: 0,
          user: {
            id: 0,
            nickname: 'nickname',
            avatar: 'http://dummyimage.com/100x100'
          },
          content: 'content',
          time: '2000-01-01 00:00:00',
          parent: 0
        }
      ]
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  created () {
    axios.get('/articles/' + this.id).then(res => {
      this.article = res.data.article
      this.me = res.data.me
      this.getComments()
    }).catch(() => {
      this.$message.destroy()
      this.$router.replace({ name: 'NotFound' })
    }).finally(() => {
      this.spinning = false
    })
  },
  beforeRouteEnter (to, from, next) {
    if (to.params.id % 1 === 0) next()
    else next({ name: 'NotFound' })
  },
  methods: {
    /**
     * 获取评论区列表
     */
    getComments () {
      this.commentsLoading = true
      return axios.get('/articles/' + this.id + '/comments').then(res => {
        this.comments = res.data.comments
        this.comments.forEach(item => {
          item.time = moment(item.time).fromNow()
        })
        this.commentsLoading = false
      })
    },
    /**
     * 点击按钮点赞/取消点赞触发事件
     */
    btnLikeClick () {
      this.btnLikeLoading = true
      if (this.me.liked) {
        axios.delete('/articles/' + this.id + '/like').finally(() => {
          this.me.liked = false
          setTimeout(() => {
            this.btnLikeLoading = false
          }, 500)
        })
      } else {
        axios.post('/articles/' + this.id + '/like').finally(() => {
          this.me.liked = true
          // this.btnLikeLoading = false
          setTimeout(() => {
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
    },
    /**
     * 提交评论
     * @param parent 回复的评论的id，若无则为0
     */
    commentSubmit (parent) {
      this.btnCommentSubmitting = true
      const data = { content: this.newCommentValue }
      if (parent) data[parent] = parent
      axios.post('/articles/' + this.id + '/comments', data).then(() => {
        this.getComments()
        this.newCommentValue = ''
        this.$message.success('评论发布成功')
      }).finally(() => {
        setTimeout(() => {
          this.btnCommentSubmitting = false
        }, 500)
      })
    },
    /**
     * 删除评论
     * @param id 删除的评论的id
     */
    commentDelete (id) {
      axios.delete('/articles/' + this.id + '/comments', {
        data: {
          id: id
        }
      }).then(() => {
        this.$message.success('成功删除评论')
        this.getComments()
      })
    }
  }
}
</script>

<style scoped>

</style>
