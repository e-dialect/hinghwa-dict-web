<template>
<a-card>
  <template slot="title">
    <h1>亲戚计算器（开发中）</h1>
  </template>
  <RelationSelect/>
</a-card>
</template>

<script>
import RelationSelect from '../../components/Tools/RelativeSelect'
export default {
  name: 'Relations',
  components: { RelationSelect }
}
</script>

<style scoped>

</style>
