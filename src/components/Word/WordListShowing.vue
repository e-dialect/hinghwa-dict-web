<template>
  <a-list
    :data-source="listSource || []"
    :pagination="pagination"
  >
    <template v-slot:renderItem="item">
      <a-card
        :hoverable="true"
        style="width: 100%;"
      >
        <a-card-meta :description="item.definition.slice(0,100)">
          <template v-slot:title>
            <span style="font-size: 150%">
               <router-link
                 :to="{name:'WordDetails',params:{id:item.id.toString()}}"
                 style="color:black"
               >
                 {{ item.word }}
               </router-link>
            </span>
            <span style="font-size: 80%;padding-left: 10px">
                {{ item.standard_pinyin }}
              </span>
            <span style="font-size: 80%;color: rgb(155,155,155);padding-left: 10px">
                / {{ item.standard_ipa }}/
              </span>
          </template>
        </a-card-meta>
        <div style="text-align: end">
          <a-button type="link">
            <router-link :to="{name:'WordDetails',params:{id:item.id.toString()}}">
              更多
              <a-icon type="double-right"/>
            </router-link>
          </a-button>
        </div>

      </a-card>
    </template>
  </a-list>
</template>

<script>

export default {
  name: 'WordListShowing',
  props: {
    listSource: {
      type: Array,
      default: Array.from([])
    }
  },
  computed: {
    pagination () {
      return {
        showQuickJumper: true
      }
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style scoped>

</style>
