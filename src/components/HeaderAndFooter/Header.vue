<template>
  <div class="header">
    <a-row align="middle" justify="space-around" type="flex">
      <a-col :span="3">
        <router-link to="/Home">
          <img alt="E方言图标" src="../../assets/blue.svg" width="120px">
        </router-link>
      </a-col>

      <a-col :span="9">
        <a-menu v-model="tab" mode="horizontal">
          <a-menu-item key="Home">
            <router-link :to="{name:'Home'}">主页</router-link>
          </a-menu-item>
          <a-menu-item key="Pinyin">
            <router-link :to="{name:'Pinyin'}">拼音</router-link>
          </a-menu-item>
          <a-menu-item key="Articles">
            <router-link :to="{name:'Articles'}">文章</router-link>
          </a-menu-item>

          <a-menu-item key="Tools">
            <router-link :to="{name:'Tools'}">工具</router-link>
          </a-menu-item>
        </a-menu>
      </a-col>

      <a-col :span="6">
        <a-input-search
          v-model="searchContent"
          placeholder="开始搜索"
          @search="search(searchContent)"
        />
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
      searchContent: ''
    }
  },
  computed: {
    tab: {
      get () {
        return this.$store.getters.tab
      },
      set (value) {
        this.$store.commit('tab', value)
      }
    }
  },
  methods: {
    search (content) {
      if (content) {
        if (!(this.$route.name === 'Search' && content === this.$route.query.key)) {
          this.$router.push({
            name: 'Search',
            query: { key: content }
          })
        }
      } else {
        this.$message.warning('请先输入搜索内容哦~')
      }
    }
  }
}
</script>

<style scoped>

</style>
