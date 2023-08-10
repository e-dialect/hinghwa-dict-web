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

export default {
  components: {
    myHeader,
    myFooter,
    MusicAffix
  },
  async beforeCreate () {
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
      window.open('https://m.hinghwa.cn', '_self')
    }
    if (window.localStorage.getItem('token')) {
      await refreshToken()
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
