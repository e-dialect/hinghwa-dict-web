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
    isMobileDevice () {
      return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)
    },
    isNarrowViewport () {
      // Check if viewport is narrow (mobile-like)
      // Using 768px as common breakpoint between mobile and tablet/desktop
      return window.innerWidth <= 768
    },
    shouldRedirectToMobile () {
      // Check if URL has desktop parameter to force desktop version
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('desktop') === '1') {
        // Store preference when explicitly requested via URL
        localStorage.setItem('preferDesktopSite', 'true')
        return false
      }
      
      // Check if user has explicitly opted out of redirects
      if (localStorage.getItem('preferDesktopSite') === 'true') {
        return false
      }
      
      // Check if we've already attempted redirect in this session to prevent loops
      if (sessionStorage.getItem('redirectAttempted') === 'true') {
        return false
      }
      
      // Only redirect if BOTH conditions are true:
      // 1. Device identifies as mobile (User-Agent)
      // 2. Viewport is actually narrow (not desktop mode)
      return this.isMobileDevice && this.isNarrowViewport
    }
  },
  watch: {
    routeName (val) {
      if (!this.shouldRedirectToMobile) return
      
      // Mark that we've attempted a redirect in this session
      sessionStorage.setItem('redirectAttempted', 'true')
      
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
            .filter(([key, value]) => value != null) // Filters both null and undefined
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
