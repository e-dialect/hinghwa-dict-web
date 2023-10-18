<template>

  <a-layout>
    <a-layout-header style="background: white;position:fixed;width: 100%;z-index: 3">
      <myHeader/>
    </a-layout-header>
    <a-layout-content style="margin-top: 74px">
      <div class="body">
        <router-view/>
      </div>
      <MusicAffix/>
    </a-layout-content>
    <a-layout-footer style="background: rgb(46, 46, 46)">
      <myFooter/>
    </a-layout-footer>
  </a-layout>

</template>

<script>
import myHeader from './components/HeaderAndFooter/Header.vue'
import myFooter from './components/HeaderAndFooter/Footer.vue'
import MusicAffix from './components/Music/MusicAffix.vue'
import { refreshToken } from '@/services/login'
import pc2mob from '@/router/pc2mob'

export default {
  components: {
    myHeader,
    myFooter,
    MusicAffix
  },
  async beforeCreate () {
    if (window.localStorage.getItem('token')) {
      await refreshToken()
    }
  },
  computed: {
    routeName () {
      return this.$route.name
    },
    isMobile () {
      return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
    }
  },
  watch: {
    routeName (val) {
      if (!this.isMobile) return
      const path = pc2mob[val]
      const query = Object.keys(this.$route.params).length ? `?${Object.keys(this.$route.params)[0]}=${Object.values(this.$route.params)[0]}` : ''
      if (path) {
        window.open(`https://m.hinghwa.cn${path}${query}`, '_self')
      } else {
        window.open('https://m.hinghwa.cn', '_self')
      }
    }
  }
}
</script>
<style>
.body {
  margin: 0 auto;
  width: 80%;
  min-height: 100vh;
}
</style>
