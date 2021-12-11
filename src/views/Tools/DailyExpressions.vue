<template>
  <a-card>
    <template slot="title">
      <h2>日常用语</h2>
      <h5>英语、普通话、莆仙正字、莆仙拼音共同对照</h5>
    </template>
    <a-table
      :columns="columns"
      :data-source="expressions"
      :loading="{spinning: loading, delay: 500}"
      :pagination="pagination"
    >
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          ref="searchInputBox"
          :placeholder="`在${column.title}中搜索`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block;"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          检索
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          重置
        </a-button>
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
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
      searchedColumn: '',
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
          },
          onFilter: (value, record) =>
            record.mandarin.includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.$refs.searchInputBox.focus()
              }, 0)
            }
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
          },
          onFilter: (value, record) =>
            record.english
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.$refs.searchInputBox.focus()
              }, 0)
            }
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
          },
          onFilter: (value, record) =>
            record.character.includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.$refs.searchInputBox.focus()
              }, 0)
            }
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
          },
          onFilter: (value, record) =>
            record.pinyin.includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.$refs.searchInputBox.focus()
              }, 0)
            }
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
          page: page
        }
      }).then(res => {
        this.expressions = res.data.results
        this.total = res.data.total
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch (selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
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
