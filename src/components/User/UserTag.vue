<template>
  <div>
    <a-tag v-if="type" color="purple">管理员</a-tag>
    <a-tag v-else color="cyan">普通用户</a-tag>
  </div>
</template>

<script>
export default {
  name: 'UserTag',
  props: ['type']
}
</script>

<style scoped>

</style>
