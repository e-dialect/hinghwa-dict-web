<template>

  <a-layout>
    <a-layout-header style="background: white">
      <myHeader/>
    </a-layout-header>
    <a-layout-content>
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
    if (document.documentElement.clientHeight / document.documentElement.clientWidth > 4 / 3) {
      if (confirm('根据您的屏幕长宽比建议您访问移动版 m.hinghwa.cn ，是否立刻跳转？')) {
        window.open('https://m.hinghwa.cn', '_self')
      }
    }
    document.addEventListener('DOMContentLoaded', () => {
      const width = document.documentElement.clientWidth
      document.body.style.zoom = Number(width / 12).toString() + '%'
    })
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
}
</style>
