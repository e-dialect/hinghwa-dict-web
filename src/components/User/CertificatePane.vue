<script>

export default {
  name: 'CertificatePane',
  data () {
    return {
      certs: []
    }
  },
  props: {
    id: String
  },
  methods: {
    showCertificate (id) {
      this.$router.push({ path: `/users/certificate/${id}` })
    },
    getCerts () {
      this.$axios.get(`/certs?user=${this.id}`).then(res => {
        this.certs = res.data.certs
      })
    },
    desString (item) {
      return `${item.place} Level ${item.level} 第${item.sequence}次认证，${item.time}`
    },
    titleString (item) {
      return `${item.name}：${item.grade}， 总分：${item.scores[4]}`
    }
  },
  created () {
    this.getCerts()
  }
}
</script>

<template>
  <a-row>
    <a-row>
      <a-list item-layout="horizontal" :data-source="certs">
        <template #renderItem="item">
          <a-list-item>
            <a-list-item-meta :description='desString(item)'>
              <template #title>
                <a-button type="link" @click="showCertificate(item.ID)" style="margin-left: -15px">
                  {{ titleString(item) }}
                </a-button>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-row>
  </a-row>
</template>

<style scoped>

</style>
