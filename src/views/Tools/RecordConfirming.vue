<template>
  <a-card>
    <template slot="title">
      <h2>录音审核</h2>
      <div>
        使用帮助：<br>
        <ul>
          <li>点击编号进入后台管理页面修改对应编号的内容</li>
          <li>点击发音人查看发音人详细信息</li>
          <li>点击词条查看对应词条的具体内容</li>
          <li>点击发音可以播放对应的音频信息</li>
          <li>点击审核情况可以修改对应录音的审核情况</li>
          <li>如果只能查看到已审核的信息说明登录已经失效，请重新登录！</li>
        </ul>
      </div>
    </template>
    <a-row justify="center" type="flex">
      <a-col :span="22">
        <Record/>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import Record from '../../components/Admin/Record'
export default {
  name: 'RecordConfirming',
  components: { Record },
  async created () {
    await this.$store.dispatch('userUpdate')
    if (this.$store.getters.user.is_admin === false) {
      this.$message.error('仅管理员有权访问该模块！或请重新登录！')
      this.$router.push({ name: 'Tools' })
    }
  }
}
</script>

<style scoped>

</style>
