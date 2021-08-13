<template>
  <a-spin :spinning="spinning" :delay="500" class="body">
    <a-row :gutter="20" type="flex" justify="center">
      <!--文章主体部分-->
      <a-col span="17">

        <!--标题、封面、简介-->
        <a-card>
          <template #title>
            <h1> {{ article.title }} </h1>
          </template>

          <template #extra>
            <!--              <a-button type="primary" v-if="authoruid===loginuid" @click="deletePost(tid)"> 删除 </a-button>-->
            <!--              <router-link :to="'/PostEdit/'+tid"><a-button type="primary" v-if="authoruid===loginuid"> 编辑 </a-button></router-link>-->
            <!--              <a-button type="primary" @click="shouchang" v-if="hasshoucang===false"> 收藏 </a-button>-->
            <!--              <a-button type="primary" @click="quxiaoshouchang" v-if="hasshoucang===true"> 取消收藏 </a-button>-->
          </template>

          <template #cover>
            <img :src="article.cover" :alt="'这里本是文章的封面，其地址为'+article.cover+',但是显示不出来了'">
          </template>

          <p> 文章简介： {{ article.description }} </p>
        </a-card>

        <!---文章主体部分--->
        <a-card>
          <mavon-editor
            class="md"
            :value="article.content"
            :subfield="false"
            defaultOpen="preview"
            :toolbarsFlag="false"
            :editable="false"
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
              :data-source="comments"
              :header="`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`"
              item-layout="horizontal"
              :pagination="{pageSize: 8}"
            >
              <template v-slot:renderItem="item">
                <a-list-item>
                  <a-comment
                    :author="item.user.username"
                    :content="item.content"
                    :datetime="item.time">
                    <template v-slot:avatar>
                      <!--                        <router-link :to="{name:'UserDetails',params:{uid:item.uid}}">-->
                      <a-avatar :src="item.user.avatar"></a-avatar>
                      <!--                        </router-link>-->
                    </template>
                    <template slot="actions">
                      <!--                        <span v-if="item.uid===loginuid" @click="commentDelete(item.pid)">删除评论</span>-->
                    </template>
                  </a-comment>
                </a-list-item>
              </template>
            </a-list>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-spin>
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
  created () {
    axios.get('/articles/' + this.id).then(res => {
      this.article = res.data.article
      this.me = res.data.me
      axios.get('/articles/' + this.id + '/comments').then(ress => {
        this.comments = ress.data.comments
        this.comments.forEach(item => {
          item.time = moment(item.time).fromNow()
        })
      })
    }).catch(() => {
      this.$message.destroy()
      this.$router.replace({ name: 'NotFound' })
    }).finally(() => { this.spinning = false })
  },
  beforeRouteEnter (to, from, next) {
    if (to.params.id % 1 === 0)next()
    else next({ name: 'NotFound' })
  }
}
</script>

<style scoped>

</style>
