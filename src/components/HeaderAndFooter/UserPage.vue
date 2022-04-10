<template>
  <a-spin :spinning="drawerLoading">

    <a-descriptions layout="vertical">
      <template v-slot:title>
        <h3>
          <router-link :to="{name:'UserDetails',params:{id:user.id.toString()}}">
            个人信息
          </router-link>
        </h3>
        <a-button style="float: right;" type="dashed">
          <router-link :to="{ name: 'UserSettings'}">修改</router-link>
        </a-button>
      </template>
      <a-descriptions-item label="用户名">
        {{ user.username }}
      </a-descriptions-item>
      <a-descriptions-item label="昵称">
        {{ user.nickname }}
      </a-descriptions-item>
      <a-descriptions-item label="身份">
        <user-tag :type="user.is_admin"></user-tag>
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{ user.email }}
      </a-descriptions-item>
      <a-descriptions-item label="上次登陆时间">
        {{ user.login_time }}
      </a-descriptions-item>
      <a-descriptions-item label="乡镇">
        {{ user.county }}-{{ user.town }}
      </a-descriptions-item>
    </a-descriptions>

    <a-divider></a-divider>

    <a-descriptions>
      <template v-slot:title>
        <h3>
          贡献信息
        </h3>
      </template>
      <a-descriptions-item label="语音">
        <router-link :to="{name:'UserDetails',params:{id:user.id.toString()}}">
          {{ contribution.pronunciation }}
        </router-link>
      </a-descriptions-item>
      <a-descriptions-item label="词条">
        {{ contribution.word }}
      </a-descriptions-item>
      <a-descriptions-item label="文章">
        <router-link :to="{name:'UserDetails',params:{id:user.id.toString()}}">
          {{ publish_articles.length }}
        </router-link>
      </a-descriptions-item>
    </a-descriptions>

    <a-row align="middle" type="flex">
      <a-col :span="8">
        <router-link :to="{name:'QuickRecording'}">
          <a-button type="dashed">发布新语音</a-button>
        </router-link>
      </a-col>
      <a-col :span="8">
        <router-link :to="{name:'WordCreate'}">
          <a-button type="dashed">提交新词语</a-button>
        </router-link>
      </a-col>
      <a-col :span="8">
        <a-button type="dashed">
          <router-link :to="{name:'ArticleCreate'}">创建新文章</router-link>
        </a-button>
      </a-col>

    </a-row>

    <a-divider/>

    <a-button
      type="danger"
      @click="$store.commit('userLogout');$router.go(0)"
    >
      登出
    </a-button>
  </a-spin>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTag from '../User/UserTag'

export default {
  name: 'UserPage',
  components: {
    UserTag
  },
  computed: {
    ...mapGetters({
      user: 'user',
      publish_articles: 'publish_articles',
      like_articles: 'like_articles',
      drawerLoading: 'drawerLoading',
      contribution: 'contribution'
    })
  }
}
</script>

<style scoped>

</style>
