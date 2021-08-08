<template>
  <div class="header">
    <a-row align="middle" justify="space-around" type="flex">
      <a-col :span="3">
        <router-link to="/Home">
          <img src="@/assets/logo.png" alt="E方言图标" width="120px">
        </router-link>
      </a-col>

      <a-col :span="9">
        <a-menu mode="horizontal" v-model="tab">
          <a-menu-item key="home">
            <router-link to="/Home">主页</router-link>
          </a-menu-item>

          <a-menu-item key="post">
            <router-link to="/posts">文章</router-link>
          </a-menu-item>

          <a-menu-item key="tools">
            <router-link to="/tools">工具</router-link>
          </a-menu-item>
          <a-menu-item key="music">
            <router-link to="/music">音乐</router-link>
          </a-menu-item>
        </a-menu>
      </a-col>

      <a-col :span="6">
        <a-input-search
          v-model="search_content"
          placeholder="开始搜索"/>
        <!--          @search="$router.push({ name: 'search', query: { key: search_content } })"  TODO: 页眉搜索-->

      </a-col>

      <a-col :span="2">
        <header-user/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import headerUser from './HeaderUser.vue'

export default {
  name: 'Header',
  components: {
    headerUser
  },
  data () {
    return {
      search_content: '',
      // TODO: 将tab转化为vuex中的状态，以保证页面首页的完整性
      tab: null
    }
  }
}
</script>

<style scoped>

</style>
