<template>
  <a-card>
    <template slot="title">
      <h2>日常用语</h2>
      <h5>英语、普通话、莆仙正字、莆仙拼音共同对照</h5>
    </template>

    <template slot="extra">
      <a-input-search
        v-model="searchInput"
        placeholder="在全字段中搜索"
        style="width:200px; margin-bottom: 8px;"
        @search="searchText=searchInput;getCurrentPage(1)"
      />
    </template>
    <a-table
      :columns="columns"
      :data-source="expressions"
      :loading="{spinning: loading, delay: 500}"
      :pagination="pagination"
    >
      <template slot="customRender" slot-scope="text">
      <span v-if="searchText">
        <template
          v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
            :key="i"
            class="highlight"
          >{{ fragment }}</mark
          >
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'DailyExpressions',
  data () {
    return {
      searchText: '',
      searchInput: null,
      columns: [
        {
          title: '普通话',
          dataIndex: 'mandarin',
          key: 'mandarin',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          }
        },
        {
          title: '英语',
          dataIndex: 'english',
          key: 'english',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          }
        },
        {
          title: '莆仙正字',
          dataIndex: 'character',
          key: 'character',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          }
        },
        {
          title: '莆仙拼音',
          dataIndex: 'pinyin',
          key: 'pinyin',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          }
        }
      ],
      expressions: [],
      loading: false,
      total: {
        item: 0,
        page: 0
      }
    }
  },

  mounted () {
    this.getCurrentPage(1)
  },
  methods: {
    getCurrentPage (page) {
      this.loading = true
      axios.get('/website/daily-expression', {
        params: {
          pageSize: this.pagination.pageSize,
          page: page,
          keyword: this.searchText
        }
      }).then(res => {
        this.expressions = res.data.results
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    }
  },
  computed: {
    pagination () {
      return {
        onChange: page => {
          this.getCurrentPage(page)
        },
        total: this.total.item,
        pageSize: 10
      }
    }
  }
}
</script>

<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0;
}
</style>
