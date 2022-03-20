<template>
  <a-card title="声韵调选字">

    <!--   搜索按钮  -->
    <a-popconfirm
      slot="extra"
      :visible="visible"
      ok-text="继续"
      cancel-text="取消"
      @confirm="confirmShowing"
      @cancel="visible=false;loading = false"
      :title="'这样搜索共有'+result.length+'个结果，若要显示可能需要一定的时间，请确认是否继续？'"
    >
      <a-button
        type="primary"
        v-on:click="getCharacters()"
        style="margin-left:32px"
        :loading="btnLoading"
      >
        按条件检索
      </a-button>
    </a-popconfirm>

    <h2>依次选择声母、韵母、声调，即可搜索所有符合要求的汉字</h2>

    <a-row :gutter="16">
      <a-col span="8">
        <!--   筛选声母  -->
        <a-select
          :showSearch="true"
          v-model="conditions.shengmu"
          option-filter-prop="children"
          :filter-option="filterOption"
          style="width: 100%"
        >
          <a-select-option v-for="(value,key) in shengmu" :key="key">
            {{ value }}
          </a-select-option>
        </a-select>
      </a-col>

      <a-col span="8">
        <!--   筛选韵母  -->
        <a-cascader
          :options="yunmu"
          :display-render="displayRender"
          :showSearch="true"
          v-model="conditions.yunmu"
          placeholder="（选择韵母）"
          style="width:100%"
        />
      </a-col>
      <a-col span="8">
        <!--   筛选声调  -->
        <a-select
          :showSearch="true"
          v-model="conditions.shengdiao"
          option-filter-prop="children"
          style="width: 100%"
          :filter-option="filterOption"
        >
          <a-select-option v-for="(value,key) in shengdiao" :key="key">
            {{ value }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>

    <!--   分割线  -->
    <a-divider style="margin:30px 0 30px 0"/>

    <a-empty v-if="!result.length" description="无数据"/>
    <!--   搜索结果  -->
    <a-skeleton v-else active :loading="loading">
      <a-collapse
        :bordered="false"
        style="font-size: 22px;padding: 10px;background-color: white"
        :activeKey="activeKeys"
      >
        <a-collapse-panel
          v-for="(pinyin,index) in characters"
          :key="index.toString()"
          :header="pinyin.pinyin"
        >
          <a-row type="flex">
            <a-col :span="2">
              <PlaySoundButton :url="pinyin.source"/>
            </a-col>
            <a-col :span="2" v-for="(character,index2) in pinyin.characters" :key="index2">
              <span v-if="!character.word">{{ text(character) }}</span>
              <router-link
                v-else
                :to="{name:'WordDetails',params:{id:character.word}}"
              >
                {{ text(character) }}
              </router-link>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
    </a-skeleton>
  </a-card>
</template>

<script>
import axios from 'axios'
import PlaySoundButton from '../../components/Tools/PlaySoundButton'

export default {
  name: 'Conditions',
  components: { PlaySoundButton },
  data () {
    return {
      visible: false,
      btnLoading: false,
      characters: [],
      result: [],
      loading: false,
      shengmu: {
        all: 'all：全部声母',
        b: 'b：（买放笔）',
        p: 'p：（皮片拍）',
        m: 'm：（骂名目）',
        d: 'd；（刀中毒）',
        t: 't：（头天读）',
        n: 'n：（泥年肉）',
        l: 'l：（老连绿）',
        z: 'z：（早钱热）',
        c: 'c：（差清七）',
        s: 's：（时心十）',
        g: 'g：（加公月）',
        k: 'k：（气轻吸）',
        ng: 'ng：（五元硬）',
        h: 'h：（好远发）',
        Ǿ: 'Ǿ：（乌云压）'
      },
      yunmu: [
        {
          value: 'all',
          label: 'all：全部韵母'
        },
        {
          value: 'kaiwei',
          label: '开尾韵（家学鱼）',
          children: [
            {
              value: 'a',
              label: 'a：（家拆）'
            },
            {
              value: 'ae',
              label: 'ae：（十）'
            },
            {
              value: 'e',
              label: 'e：（鞋鸡）'
            },
            {
              value: 'oe',
              label: 'oe：（退所）'
            },
            {
              value: 'o',
              label: 'o：（学刀）'
            },
            {
              value: 'or',
              label: 'or：（下马）'
            },
            {
              value: 'i',
              label: 'i：（机戏）'
            },
            {
              value: 'u',
              label: 'u：（有牛）'
            },
            {
              value: 'y',
              label: 'y：（鱼猪）'
            },
            {
              value: 'ai',
              label: 'ai：（菜海）'
            },
            {
              value: 'au',
              label: 'au：（后豆）'
            },
            {
              value: 'ou',
              label: 'ou：（乌古）'
            },
            {
              value: 'ia',
              label: 'ia：（车谢）'
            },
            {
              value: 'iu',
              label: 'iu：（油救）'
            },
            {
              value: 'ieu',
              label: 'ieu：（药鸟）'
            },
            {
              value: 'ua',
              label: 'ua：（画花）'
            },
            {
              value: 'ue',
              label: 'ue：（歪飞）'
            },
            {
              value: 'ui',
              label: 'ui：（为水）'
            },
            {
              value: 'yor',
              label: 'yor：（蛇纸）'
            }
          ]
        },
        {
          value: 'biwei',
          label: '鼻尾韵（红云光）',
          children: [
            {
              value: 'ang',
              label: 'ang：（红重）'
            },
            {
              value: 'eng',
              label: 'eng：（灯生）'
            },
            {
              value: 'oeng',
              label: 'oeng：（宫窗）'
            },
            {
              value: 'ong',
              label: 'ong：（云分）'
            },
            {
              value: 'orng',
              label: 'orng：（王公）'
            },
            {
              value: 'ing',
              label: 'ing：（兵心）'
            },
            {
              value: 'ung',
              label: 'ung：（光霜）'
            },
            {
              value: 'yng',
              label: 'yng：（斤银）'
            },
            {
              value: 'ieng',
              label: 'ieng：（盐尖）'
            },
            {
              value: 'uang',
              label: 'uang：（弯团）'
            },
            {
              value: 'ng',
              label: 'ng：（黄方）'
            },
            {
              value: 'yorng',
              label: 'yorng：（上场）'
            }
          ]
        },
        {
          value: 'sewei',
          label: '塞尾韵（合出玉）',
          children: [
            {
              value: 'ah',
              label: 'ah：（合读）'
            },
            {
              value: 'eh',
              label: 'eh：（踢热）'
            },
            {
              value: 'oeh',
              label: 'oeh：（竹玉）'
            },
            {
              value: 'oh',
              label: 'oh：（出骨）'
            },
            {
              value: 'orh',
              label: 'orh：（盒国）'
            },
            {
              value: 'ih',
              label: 'ih：（笔七）'
            },
            {
              value: 'ieh',
              label: 'ieh：（页业）'
            },
            {
              value: 'iah',
              label: 'iah：（食）'
            },
            {
              value: 'uh',
              label: 'uh：（-）'
            },
            {
              value: 'uah',
              label: 'uah：（刷发）'
            },
            {
              value: 'uoh',
              label: 'uoh：（我）'
            },
            {
              value: 'yh',
              label: 'yh：（域役）'
            },
            {
              value: 'yorh',
              label: 'yorh：（约雀）'
            }
          ]
        }
      ],
      shengdiao: {
        all: 'all：全部声调',
        1: '1：阴平533（机诗）',
        2: '2：阳平13（棋时）',
        3: '3：上声453（己死）',
        4: '4：阴去42（记四）',
        5: '5：阳去11（义寺）',
        6: '6：阴入2（急息）',
        7: '7：阳入4（及实）'
      },
      conditions: {
        shengmu: 'all',
        yunmu: ['all'],
        shengdiao: 'all'
      },
      activeKeys: []
    }
  },
  computed: {
    text () {
      return (character) => {
        if (character.character === character.traditional) {
          return character.character
        } else {
          return `${character.character}(${character.traditional})`
        }
      }
    }
  },
  methods: {
    filter (inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    displayRender ({ labels }) {
      return labels[labels.length - 1]
    },
    getCharacters () {
      this.btnLoading = true

      const data = Object.assign({}, this.conditions)
      if (data.sheng === 'Ǿ') data.sheng = ''
      data.yunmu = data.yunmu[data.yunmu.length - 1]
      Object(['shengmu', 'yunmu', 'shengdiao']).forEach(item => {
        if (data[item] === 'all') delete data[item]
      })
      this.loading = true
      axios.get('/characters/pinyin', { params: data }).then(res => {
        this.result = res.data.result
        this.activeKeys = [...[...Array(this.result.length)].map((value, index) => {
          return index.toString()
        })]
        if (this.result.length > 500) {
          this.$message.error('有超过500个可能拼音，过于宽泛！请再详细一些~')
          this.result = []
        }
        if (this.result.length < 250) {
          this.characters = this.result
          setTimeout(() => {
            this.loading = false
          }, 200)
        } else {
          this.visible = true
        }
      }).finally(() => {
        this.btnLoading = false
      })
    },
    confirmShowing () {
      this.visible = false
      this.characters = this.result
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style scoped>

</style>
