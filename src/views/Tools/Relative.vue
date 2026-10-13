<template>
<a-card class="kinship-panel">
  <template slot="title">
    <h1>亲戚计算</h1>
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
.kinship-panel { max-width: 760px; margin: 0 auto; border-radius: 12px; }
h1 { margin: 0; color: #30445d; font-size: 24px; font-weight: 600; }
</style>
