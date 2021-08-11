<template>
  <div>

    <a-descriptions layout="vertical">
      <template v-slot:title>
        <router-link :to="{name:'UserDetails',params:{id:user.id}}" >用户信息</router-link>
        <a-button type="dashed" style="float: right;">
          <router-link :to="{ name: 'userSetting'}">修改</router-link>
        </a-button>
      </template>

      <a-descriptions-item label="用户名">
        {{user.username}}
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{user.email}}
      </a-descriptions-item>
      <a-descriptions-item label="上次登陆时间">
        {{user.login_time}}
      </a-descriptions-item>
    </a-descriptions>

    <a-tabs>
      <a-tab-pane key="1" tab="我创作的文章">
        <ArticleList :listData="publish_articles" :page-size="3" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="收藏列表">
        <ArticleList :listData="like_articles" :page-size="3"/>
      </a-tab-pane>
      <template v-slot:tabBarExtraContent>
        <router-link to="/PostCreate"> 进入创作中心 </router-link>
      </template>
    </a-tabs>

    <a-button
      type="danger"
      @click="$store.commit('userLogout')"
    >
      登出
    </a-button>
  </div>
</template>

<script>
import ArticleList from '@/components/Articles/ArticleList'
import { mapGetters } from 'vuex'
export default {
  name: 'UserPage',
  components: {
    ArticleList
  },
  created () {
    this.$store.commit('userUpdate')
  },
  computed: {
    ...mapGetters({
      user: 'user',
      publish_articles: 'publish_articles',
      like_articles: 'like_articles'
    })
  }
}
</script>

<style scoped>

</style>
