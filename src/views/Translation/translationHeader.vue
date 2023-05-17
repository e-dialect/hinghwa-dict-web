<template>
  <div>
  <a-menu v-model="tab1" mode="horizontal">
    <a-menu-item key="ptx">
      <router-link replace :to="{name:'ptxTranslation'}">
        普通话识别
      </router-link>
    </a-menu-item>
    <a-menu-item key="xtp">
      <router-link replace :to="{name:'xtpTranslation'}">
        莆仙话识别
      </router-link>
    </a-menu-item>
  </a-menu>
  </div>
</template>

<script>
export default {
  name: 'translationHeader',
  computed: {
    tab1: {
      get () {
        return this.$store.getters.tab1
      },
      set (value) {
        this.$store.commit('tab1', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
