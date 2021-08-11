<template>

  <a-layout style="width: 1200px">
    <a-layout-header style="background: white">
      <vheader></vheader>
    </a-layout-header>
    <a-layout-content>
      <!--      <vmusic style="padding: 65px; position: fixed; z-index:1500"/>-->
      <div class="body">
        <router-view/>
      </div>
    </a-layout-content>
    <a-layout-footer style="background: rgb(46, 46, 46)">
      <vfooter/>
    </a-layout-footer>
  </a-layout>

</template>

<script>
import vheader from './components/Header&&Footer/Header.vue'
import vfooter from './components/Header&&Footer/Footer.vue'
import store from '@/store'

export default {
  components: {
    vheader,
    vfooter
  },
  created () {
    if (window.localStorage.getItem('id')) {
      store.commit('userLogin', window.localStorage.getItem('id'))
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
