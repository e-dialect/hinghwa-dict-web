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
      const routeConfig = pc2mob[val]
      
      // Handle both old string format and new object format
      const path = typeof routeConfig === 'string' ? routeConfig : routeConfig?.path
      
      if (!path) {
        // If no mapping exists, redirect to mobile home page
        window.open('https://m.hinghwa.cn/pages/index', '_self')
        return
      }
      
      // Build query params, applying parameter name transformations if specified
      let queryParams = { ...this.$route.params, ...this.$route.query }
      
      // Apply parameter name mapping if specified
      if (typeof routeConfig === 'object' && routeConfig !== null && routeConfig.paramMap) {
        const transformedParams = {}
        for (const [key, value] of Object.entries(queryParams)) {
          // Use mapped name if it exists, otherwise use original name
          const mappedKey = routeConfig.paramMap[key] || key
          transformedParams[mappedKey] = value
        }
        queryParams = transformedParams
      }
      
      const queryString = Object.keys(queryParams).length 
        ? '?' + Object.entries(queryParams)
            .filter(([key, value]) => value != null)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join('&')
        : ''
      
      window.open(`https://m.hinghwa.cn${path}${queryString}`, '_self')
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
