<template>
  <a-card>
    <template slot="title">
      <h2>日常用语</h2>
      <h5>英语、普通话、莆仙正字、莆仙拼音共同对照</h5>
    </template>
    <a-table :columns="columns" :data-source="expressions">
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
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
          dataIndex: 'Mandarin',
          key: 'Mandarin',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.Mandarin.includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '英语',
          dataIndex: 'English',
          key: 'English',
          align: 'center',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
          },
          onFilter: (value, record) =>
            record.English
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus()
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
                this.searchInput.focus()
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
                this.searchInput.focus()
              }, 0)
            }
          }
        }

      ],
      expressions: [{
        key: 0,
        English: 'Welcome',
        Mandarin: '欢迎光临',
        character: '欢迎',
        pinyin: 'huang1 nging2'
      }, {
        key: 1,
        English: 'Hello',
        Mandarin: '你好',
        character: '汝好',
        pinyin: 'dy3 ho3 / dyh8 ho3'
      }, {
        key: 2,
        English: 'How are you?',
        Mandarin: '你好吗?',
        character: '你有好无?',
        pinyin: 'dy3 uh6 ho3 bo2 / dyh8 uh6 ho3 bo2'
      }, {
        key: 3,
        English: 'I\'m Good',
        Mandarin: '好',
        character: '我真好',
        pinyin: 'gua3 zing1 (h)o3 / guoh8 zing1 (h)o3'
      }, {
        key: 4,
        English: 'I\'m So-so/Okay',
        Mandarin: '一般',
        character: '复可以 / 权权',
        pinyin: 'horh7 kor3 i3 / goeng2 goeng2'
      }, {
        key: 5,
        English: 'I\'m Bad',
        Mandarin: '不好',
        character: '我无好',
        pinyin: 'gua3 bo2 ho3 / guoh8 bo2 ho3'
      }, {
        key: 6,
        English: 'I\'m Tired',
        Mandarin: '我累了',
        character: '我黍咯',
        pinyin: 'gua3 see3 lorh7'
      }, {
        key: 7,
        English: 'I\'m Hungry',
        Mandarin: '我饿了',
        character: '我腹肚枵',
        pinyin: 'gua3 bah6 dou3 ieu1'
      }, {
        key: 8,
        English: 'I\'m Sick',
        Mandarin: '我感冒了/我生病了',
        character: '我感冒咯',
        pinyin: 'gua3 gang3 mor5 lorh7'
      }, {
        key: 9,
        English: 'How about you?',
        Mandarin: '你呢?',
        character: '汝咧?',
        pinyin: 'dy3 leh6'
      }, {
        key: 10,
        English: 'Long time no see',
        Mandarin: '好久不见',
        character: '足久无见面',
        pinyin: 'zoeh6 gu3 bo2 ging4 ming4'
      }, {
        key: 11,
        English: 'What\'s your name?',
        Mandarin: '你叫什么名字?',
        character: '汝叫什物名？',
        pinyin: 'dy3 gieu4 soh7 mue5 mia2 ?'
      }, {
        key: 12,
        English: 'My name is ...',
        Mandarin: '我叫...',
        character: '我叫…',
        pinyin: 'guoh8 gieu4 …'
      }, {
        key: 13,
        English: 'Where are you from?',
        Mandarin: '你是从哪里来的?',
        character: '汝是底落侬 / 汝寻底落来的(兮)',
        pinyin: 'dy3 lih6 dah lo1 nang2/ dy3 cing2 dah lo1 li2 eh'
      }, {
        key: 14,
        English: 'I\'m from ...',
        Mandarin: '我是从 ... 来的',
        character: '我是…侬',
        pinyin: 'gua3 lih6 …. nang2'
      }, {
        key: 15,
        English: 'Pleased to meet you',
        Mandarin: '我很高兴跟你见面',
        character: '真欢喜认识汝',
        pinyin: 'zing1 huang1 (h)i3 ning5 sih6 dy3'
      }, {
        key: 16,
        English: 'Good morning',
        Mandarin: '早上好',
        character: '早',
        pinyin: 'zor3'
      }, {
        key: 17,
        English: 'Goodbye',
        Mandarin: '再见',
        character: '再见',
        pinyin: 'zai5 geng4'
      }, {
        key: 18,
        English: 'Good luck',
        Mandarin: '加油',
        character: '加油',
        pinyin: 'ga1 iu2'
      }, {
        key: 19,
        English: 'Congratulations',
        Mandarin: '恭喜',
        character: '恭喜',
        pinyin: 'goeng1 hi3'
      }, {
        key: 20,
        English: 'Yes',
        Mandarin: '是的',
        character: '系 / 系啊',
        pinyin: 'he5 / he5 ah6'
      }, {
        key: 21,
        English: 'No',
        Mandarin: '不是',
        character: '[毋是]',
        pinyin: 'ni4'
      }, {
        key: 22,
        English: 'Maybe',
        Mandarin: '也许',
        character: '可能',
        pinyin: 'kor3 neng2'
      }, {
        key: 23,
        English: 'I don\'t know',
        Mandarin: '我不知道',
        character: '我[毋知]向/ 我[毋知]',
        pinyin: 'guoh8 nai1 / guoh8 nai1 hieu4'
      }, {
        key: 24,
        English: 'Do you understand?',
        Mandarin: '你明白吗?',
        character: '汝听知[毋知]?',
        pinyin: 'dy3 tia1 zai1 nai1 ?'
      }, {
        key: 25,
        English: 'I understand',
        Mandarin: '我明白',
        character: '我知',
        pinyin: 'guoh8 zai1'
      }, {
        key: 26,
        English: 'I don\'t understand',
        Mandarin: '我不明白',
        character: '我[毋知]',
        pinyin: 'guoh8 nai1'
      }, {
        key: 27,
        English: 'Please speak more slowly',
        Mandarin: '麻烦你讲慢一点',
        character: '麻烦汝讲会宽权',
        pinyin: 'ma2 huang2 dy3 gorng3 eh6 kua1 goeng3'
      }, {
        key: 28,
        English: 'Please say that again',
        Mandarin: '请再说一遍',
        character: '麻烦汝再讲一遍',
        pinyin: 'ma2 huang2 dy3 ai4 gorng3 soh7 beng4'
      }, {
        key: 29,
        English: 'Please write it down',
        Mandarin: '麻烦你写一下，好不好',
        character: '请汝写落尾',
        pinyin: 'cia3 dy3 sia3 lo2 ue3'
      }, {
        key: 30,
        English: 'Do you speak English?',
        Mandarin: '你会说英文吗?',
        character: '汝会讲英文袂？/ 汝会晓讲英文袂？',
        pinyin: 'dy3 e5 ieu3 gorng3 ing1 mong2 be5 ? / dy3 eh6 gorng3 ing1 mong2 be5 ?'
      }, {
        key: 31,
        English: 'Do you speak Chinese?',
        Mandarin: '你会说中文吗?',
        character: '汝会晓讲中文袂？ / 汝会晓讲中文袂？',
        pinyin: 'dy3 eh6 gorng3 doeng1 mong2 be5 ? / dy3 e5 ieu3 gorng3 doeng1 mong2 be5 ?'
      }, {
        key: 32,
        English: 'A little',
        Mandarin: '一点',
        character: '少少/权权',
        pinyin: 'zieu3 zieu3/goeng2 oeng4'
      }, {
        key: 33,
        English: 'I study Chinese',
        Mandarin: '我现在学习中文',
        character: '我学莆仙话 / 我学莆田话',
        pinyin: 'guoh8 o2 pou2 seng1 ua5 / guoh8 o2 pou2 leng2 ua5'
      }, {
        key: 34,
        English: 'I learn by myself / I self-study',
        Mandarin: '我自学的',
        character: '我家己[家己]学',
        pinyin: 'guoh8 ga1 e2 gai4 o2'
      }, {
        key: 35,
        English: 'How do you say ... in Chinese?',
        Mandarin: '...中文怎么说?',
        character: '...莆田话会生讲?',
        pinyin: '… pou2 leng2 ua5 eh6 sa1 gorng3 ?'
      }, {
        key: 36,
        English: 'I like Asia',
        Mandarin: '我喜欢亚洲',
        character: '我爱挃亚洲',
        pinyin: 'guoh8 ai4 li2 a4 liu1'
      }, {
        key: 37,
        English: 'I like Languages',
        Mandarin: '我喜欢语言',
        character: '我爱挃学语言',
        pinyin: 'guoh8 ai4 li2 o2 gy3 ngoeng2'
      }, {
        key: 38,
        English: 'Excuse me',
        Mandarin: '请问',
        character: '勘一下',
        pinyin: 'kang4 soh7 gor5'
      }, {
        key: 39,
        English: 'Sorry',
        Mandarin: '对不起/不好意思 抱歉',
        character: '对不起 / 无好意思',
        pinyin: 'dui4 boh6 ki3 / bo2 ho3 i4 lo5'
      }, {
        key: 40,
        English: 'Please',
        Mandarin: '请',
        character: '请',
        pinyin: 'cia3'
      }, {
        key: 41,
        English: 'Thank you',
        Mandarin: '谢谢',
        character: '感谢 / 谢谢',
        pinyin: 'gang3 sia5 / sia5 sia5'
      }, {
        key: 42,
        English: 'Really?',
        Mandarin: '真的吗?',
        character: '有影',
        pinyin: 'uh6 ia3 / u5 ia3'
      }, {
        key: 43,
        English: 'It\'s alright',
        Mandarin: '没关系',
        character: '无要紧',
        pinyin: 'bo2 ieu4 ging3'
      }, {
        key: 44,
        English: 'Correct',
        Mandarin: '对',
        character: '无诞 / 正确',
        pinyin: 'bo2 dor5 / zing4 kah6'
      }, {
        key: 45,
        English: 'Where\'s the toilet/bathroom?',
        Mandarin: '厕所/洗手间在哪里?',
        character: '厕所伫底落？',
        pinyin: 'ceh6 see3 do2 dah lo1 ?'
      }, {
        key: 46,
        English: 'Can I have your phone number?',
        Mandarin: '你的电话号码是什么?',
        character: '汝电话号码若伙？',
        pinyin: 'dy3 deng5 ngua5 ho5 or3 dieu ua5 ?'
      }, {
        key: 47,
        English: 'You are pretty',
        Mandarin: '你很漂亮',
        character: '汝生足款',
        pinyin: 'dy3 sa1 zoeh6 kuang3'
      }, {
        key: 48,
        English: 'I like you',
        Mandarin: '我喜欢你',
        character: '我爱挃汝',
        pinyin: 'guoh8 ai4 li2 dy3'
      }, {
        key: 49,
        English: 'I love you',
        Mandarin: '我爱你',
        character: '我爱汝',
        pinyin: 'guoh8 ai4 dy3'
      }, {
        key: 50,
        English: 'I miss you',
        Mandarin: '我想你',
        character: '我算汝',
        pinyin: 'guoh8 sua4 dy3'
      }, {
        key: 51,
        English: 'Go away!',
        Mandarin: '走开! ',
        character: '行蜀(一)边',
        pinyin: 'gia2 soh7 bing1'
      }, {
        key: 52,
        English: 'Stop!',
        Mandarin: '停!',
        character: '停！',
        pinyin: 'deng2'
      }, {
        key: 53,
        English: 'Help!',
        Mandarin: '救命啊!',
        character: '救命',
        pinyin: 'giu4 mia5'
      }, {
        key: 54,
        English: 'Dangerous',
        Mandarin: '危险',
        character: '危险',
        pinyin: 'gui2 hieng3'
      }, {
        key: 55,
        English: 'Dead',
        Mandarin: '死了',
        character: '死',
        pinyin: 'si3'
      }, {
        key: 56,
        English: 'Weird',
        Mandarin: '奇怪',
        character: '怪怪 /  奇怪',
        pinyin: 'gue1 gue4 / gi2 gue4'
      }, {
        key: 57,
        English: 'Be quiet',
        Mandarin: '请安静 (polite) 安静 (less polite) 闭嘴 (shut up)',
        character: '会定权',
        pinyin: 'eh6 dia5 goeng2'
      }, {
        key: 58,
        English: 'What did you say?',
        Mandarin: '你刚才说了什么?',
        character: '汝讲甚物?',
        pinyin: 'dy3 gorng3 song5 mue5 ?'
      }, {
        key: 59,
        English: 'Can you translate it for me?',
        Mandarin: '请帮我翻译?',
        character: '请汝佣我翻译？',
        pinyin: 'cia3 dy3 oeng5 gwoh8 huang1 ih7 ?'
      }, {
        key: 60,
        English: 'What does this mean?',
        Mandarin: '这是什么意思?',
        character: '这是甚物意思？',
        pinyin: 'zieh8 lih6 song5 mue1 i4 lo5 ?'
      }, {
        key: 61,
        English: 'How do you pronounce that?',
        Mandarin: '你怎么发音?',
        character: '这会生读？',
        pinyin: 'zieh8 eh6 sa1 tah7 ?'
      }, {
        key: 62,
        English: 'What is your job?',
        Mandarin: '你做什么工作?',
        character: '汝做甚物工作？',
        pinyin: 'dy3 zo4 song5 mue1 gorng1 zorh6 ?'
      }, {
        key: 63,
        English: 'What is your hobbies?',
        Mandarin: '你的爱好是什么?',
        character: '汝爱好甚物？',
        pinyin: 'dy3 ai1 hor4 song5 mue1 ?'
      }, {
        key: 64,
        English: 'Who?',
        Mandarin: '谁?',
        character: '甚侬 / 什侬 / 什物侬？',
        pinyin: 'sing5 nang2 / soh nang2 / soh mue5 nang2?'
      }, {
        key: 65,
        English: 'What?',
        Mandarin: '什么?',
        character: '甚物 / 什物？',
        pinyin: 'song5 mue1 / soh mue5?'
      }, {
        key: 66,
        English: 'When?',
        Mandarin: '什么时候?',
        character: '什物时间 / 乜时',
        pinyin: 'si2 ang1 / me si2'
      }, {
        key: 67,
        English: 'Where?',
        Mandarin: '哪里?',
        character: '底落',
        pinyin: 'dah lo1'
      }, {
        key: 68,
        English: 'Why?',
        Mandarin: '为什么?',
        character: '为甚物',
        pinyin: 'ui5 song5 mue1'
      }, {
        key: 69,
        English: 'How?',
        Mandarin: '怎么?',
        character: '㖠',
        pinyin: 'nae3'
      }, {
        key: 70,
        English: 'Which?',
        Mandarin: '哪个?',
        character: '底蜀(一)个？',
        pinyin: 'deh loh7 ge2 / de3 loh7 ge2 ?'
      }, {
        key: 71,
        English: 'What kind of ... ?',
        Mandarin: '哪类的…?',
        character: '底蜀(一)种？',
        pinyin: 'deh loh7 zoeng3 / de3 loh7 zoeng3 ?'
      }, {
        key: 72,
        English: 'Do you have ...?',
        Mandarin: '你有...吗?',
        character: '汝有…无？',
        pinyin: 'dy3 uh6…bo2 ?'
      }, {
        key: 73,
        English: 'I have ...',
        Mandarin: '我有...',
        character: '我有…',
        pinyin: 'gua3 iu3 / guoh8 iu3 …'
      }, {
        key: 74,
        English: 'I want ,,, (Thing)',
        Mandarin: '我要……',
        character: '我欲… / 我卜…',
        pinyin: 'gua3 (guoh8) oeh7 / gua3 (guoh8)  boh6'
      }, {
        key: 75,
        English: 'I don\'t want ... (Thing)',
        Mandarin: '我不要……',
        character: '我[毋挃]…',
        pinyin: 'gua3 (guoh8)  ni2 …'
      }, {
        key: 76,
        English: 'I can do it',
        Mandarin: '可以',
        character: '我会晓',
        pinyin: 'gua3 (guoh8)  e5 ieu3'
      }, {
        key: 77,
        English: 'I can\'t do it',
        Mandarin: '不可以',
        character: '我袂晓 / 我无法度',
        pinyin: 'gua3 (guoh8)  be5 ieu3 / gua3 (guoh8)  bo2 hah6 dou5'
      }, {
        key: 78,
        English: 'Friend',
        Mandarin: '朋友',
        character: '朋友',
        pinyin: 'beng2 iu3 / beng2 ngiu3'
      }, {
        key: 79,
        English: 'Bad Person',
        Mandarin: '坏人',
        character: '㾏侬 / 痞囝',
        pinyin: 'gai2 nang2 / pai3 gyor3'
      }, {
        key: 80,
        English: 'Boyfriend',
        Mandarin: '男朋友',
        character: '男朋友',
        pinyin: 'nang2 beng2 iu3'
      }, {
        key: 81,
        English: 'Girlfriend',
        Mandarin: '女朋友',
        character: '女朋友',
        pinyin: 'dy3 eng2 iu3'
      }, {
        key: 82,
        English: 'Boy',
        Mandarin: '男人',
        character: '丈夫囝',
        pinyin: 'dah6 bou1 yor3'
      }, {
        key: 83,
        English: 'Girl',
        Mandarin: '女人',
        character: '婶娘囝',
        pinyin: 'sing3 nieu2 yor3'
      }, {
        key: 84,
        English: 'Brother',
        Mandarin: '弟弟 (younger) 哥哥 (older)',
        character: '阿兄 (older) / 阿弟 (younger)',
        pinyin: 'a1 ia1 / a1 li5'
      }, {
        key: 85,
        English: 'Sister',
        Mandarin: '妹妹 (younger) 姐姐 (older)',
        character: '阿姊 (older) / 阿妹 (younger)',
        pinyin: 'ah6 zi3 / ah6 mue4'
      }, {
        key: 86,
        English: 'Mom',
        Mandarin: '妈妈/娘',
        character: '妈妈 / 娘奶 (formal)',
        pinyin: 'ma1 ma1 / nieu2 le3'
      }, {
        key: 87,
        English: 'Dad',
        Mandarin: '爸爸/爹',
        character: '阿爸 / 老父 (formal)',
        pinyin: 'ah6 ba1 / lor5 or5'
      }, {
        key: 88,
        English: 'Husband',
        Mandarin: '丈夫',
        character: '老公',
        pinyin: 'lau5 orng1'
      }, {
        key: 89,
        English: 'Wife',
        Mandarin: '妻子',
        character: '老嬷',
        pinyin: 'lau5 ma3'
      }, {
        key: 90,
        English: 'Son',
        Mandarin: '儿子',
        character: '囝',
        pinyin: 'gyor3'
      }, {
        key: 91,
        English: 'Daughter',
        Mandarin: '女儿',
        character: '婶娘囝',
        pinyin: 'sing3 nieu2 yor3'
      }, {
        key: 92,
        English: 'Grandma',
        Mandarin: '奶奶 (paternal) 外婆 (maternal)',
        character: '阿妈 / 阿嬷 (paternal) / 外头嬷 (maternal)',
        pinyin: 'ah6 ma3 / gua5 lau2 ma3'
      }, {
        key: 93,
        English: 'Grandpa',
        Mandarin: '爷爷 (paternal) 外公 (maternal)',
        character: '阿公(paternal) / 外头公 (maternal)',
        pinyin: 'ah6 gorng1 / gua5 lau2 orng1'
      }, {
        key: 94,
        English: 'Family',
        Mandarin: '家人',
        character: '蜀厝侬 / 一厝侬',
        pinyin: 'soh7 cou4 nang2'
      }, {
        key: 95,
        English: 'Teacher',
        Mandarin: '老师',
        character: '先生 / 老师',
        pinyin: 'seng1 na1 / lor3 so1'
      }, {
        key: 96,
        English: 'Student',
        Mandarin: '学生',
        character: '学生',
        pinyin: 'hah7 seng1'
      }, {
        key: 97,
        English: 'Animal',
        Mandarin: '动物',
        character: '动物',
        pinyin: 'dorng5 moh7'
      }, {
        key: 98,
        English: 'Cat',
        Mandarin: '猫',
        character: '猫狸',
        pinyin: 'mor1 li3'
      }, {
        key: 99,
        English: 'Dog',
        Mandarin: '狗',
        character: '狗',
        pinyin: 'gau3'
      }, {
        key: 100,
        English: 'Bird',
        Mandarin: '鸟',
        character: '鸟',
        pinyin: 'zieu3'
      }, {
        key: 101,
        English: 'Fish',
        Mandarin: '鱼',
        character: '鱼',
        pinyin: 'hy2'
      }, {
        key: 102,
        English: 'White',
        Mandarin: '白色',
        character: '白',
        pinyin: 'ba2'
      }, {
        key: 103,
        English: 'Black',
        Mandarin: '黑色',
        character: '乌',
        pinyin: 'ou1'
      }, {
        key: 104,
        English: 'Grey',
        Mandarin: '灰色',
        character: '灰',
        pinyin: 'hue1'
      }, {
        key: 105,
        English: 'Red',
        Mandarin: '红色',
        character: '红',
        pinyin: 'ang2'
      }, {
        key: 106,
        English: 'Yellow',
        Mandarin: '黄色',
        character: '黄',
        pinyin: 'ng2'
      }, {
        key: 107,
        English: 'Blue',
        Mandarin: '蓝色',
        character: '蓝',
        pinyin: 'ang2'
      }, {
        key: 108,
        English: 'Green',
        Mandarin: '绿色',
        character: '绿',
        pinyin: 'loeh7'
      }, {
        key: 109,
        English: 'Brown',
        Mandarin: '咖啡色/棕色',
        character: '茶色',
        pinyin: 'dor2 seh6'
      }, {
        key: 110,
        English: 'Pink',
        Mandarin: '粉红色',
        character: '粉红',
        pinyin: 'hong3 ang2'
      }, {
        key: 111,
        English: 'Orange',
        Mandarin: '橙子',
        character: '枇杷色',
        pinyin: 'bi5 or2 seh6'
      }, {
        key: 112,
        English: 'Purple',
        Mandarin: '紫色',
        character: '茄色',
        pinyin: 'gieu2 seh6'
      }, {
        key: 113,
        English: 'Clothes',
        Mandarin: '衣服',
        character: '衫',
        pinyin: 'sor1'
      }, {
        key: 114,
        English: 'Look',
        Mandarin: '你看',
        character: '看',
        pinyin: 'kua4'
      }, {
        key: 115,
        English: 'What are you doing?',
        Mandarin: '你在干嘛?/你在做什么?',
        character: '汝许做甚物？/ 汝许做哂？',
        pinyin: 'dy3 heh zo4 song5 mue1 ? / dy3 heh zo4 sae1 ?'
      }, {
        key: 116,
        English: 'Where is ... ?',
        Mandarin: '...在哪里?',
        character: '…伫底落？',
        pinyin: '…do2 dah lo1?'
      }, {
        key: 117,
        English: 'North',
        Mandarin: '北',
        character: '北',
        pinyin: 'bah6'
      }, {
        key: 118,
        English: 'South',
        Mandarin: '南',
        character: '南',
        pinyin: 'nang2'
      }, {
        key: 119,
        English: 'East',
        Mandarin: '东',
        character: '东',
        pinyin: 'dang1'
      }, {
        key: 120,
        English: 'West',
        Mandarin: '西',
        character: '西',
        pinyin: 'sai1'
      }, {
        key: 121,
        English: 'Up',
        Mandarin: '上',
        character: '上 / 顶',
        pinyin: 'syorng5 / deng3'
      }, {
        key: 122,
        English: 'Down',
        Mandarin: '下',
        character: '下 / 底',
        pinyin: 'or5 / de3'
      }, {
        key: 123,
        English: 'Left',
        Mandarin: '左',
        character: '左',
        pinyin: 'zor3'
      }, {
        key: 124,
        English: 'Right',
        Mandarin: '右',
        character: '右',
        pinyin: 'iu5'
      }, {
        key: 125,
        English: 'Home',
        Mandarin: '家园',
        character: '厝 / 方厝',
        pinyin: 'cou4 / hng nou4'
      }, {
        key: 126,
        English: 'School',
        Mandarin: '学校',
        character: '学堂',
        pinyin: 'hah7 dorng2'
      }, {
        key: 127,
        English: 'Classroom',
        Mandarin: '课堂',
        character: '教室 / 课堂',
        pinyin: 'gau4 sih6 / kor4 lorng2'
      }, {
        key: 128,
        English: 'Park',
        Mandarin: '公园',
        character: '公园',
        pinyin: 'gorng1 ngoeng2 / gorng1 oeng2'
      }, {
        key: 129,
        English: 'Tree',
        Mandarin: '树',
        character: '树',
        pinyin: 'ciu4'
      }, {
        key: 130,
        English: 'Mountain',
        Mandarin: '山',
        character: '山',
        pinyin: 'sua1'
      }, {
        key: 131,
        English: 'Map',
        Mandarin: '地图',
        character: '地图',
        pinyin: 'de5 lou2'
      }, {
        key: 132,
        English: 'Road',
        Mandarin: '路',
        character: '路 / 路 / 街路',
        pinyin: 'dou5 / lou5 / ge1 lou5'
      }, {
        key: 133,
        English: 'Workplace',
        Mandarin: '职场',
        character: '单位 / 办公室',
        pinyin: 'dang1 ui5 / bang5 gorng1 sih6'
      }, {
        key: 134,
        English: 'Store',
        Mandarin: '店',
        character: '店',
        pinyin: 'de4'
      }, {
        key: 135,
        English: 'Restaurant',
        Mandarin: '餐厅 / 饭馆',
        character: '点心店',
        pinyin: 'deng3 ning1 ne4'
      }, {
        key: 136,
        English: 'Hospital',
        Mandarin: '医院',
        character: '医院',
        pinyin: 'i1 ing4'
      }, {
        key: 137,
        English: 'Police',
        Mandarin: '警察',
        character: '警察',
        pinyin: 'ging4 cah6'
      }, {
        key: 138,
        English: 'Place',
        Mandarin: '地点',
        character: '地方',
        pinyin: 'de5 orng1'
      }, {
        key: 139,
        English: 'Large',
        Mandarin: '大',
        character: '大',
        pinyin: 'dua5'
      }, {
        key: 140,
        English: 'Small',
        Mandarin: '小',
        character: '细',
        pinyin: 'se4'
      }, {
        key: 141,
        English: 'Close / Near',
        Mandarin: '近',
        character: '近',
        pinyin: 'gyng5'
      }, {
        key: 142,
        English: 'Far',
        Mandarin: '远',
        character: '远',
        pinyin: 'hue5'
      }, {
        key: 143,
        English: 'Cell phone',
        Mandarin: '手机',
        character: '手机',
        pinyin: 'ciu3 gi1'
      }, {
        key: 144,
        English: 'Computer',
        Mandarin: '电脑',
        character: '计算机',
        pinyin: 'deng5 nor3'
      }, {
        key: 145,
        English: 'Car',
        Mandarin: '车',
        character: '车',
        pinyin: 'cia1'
      }, {
        key: 146,
        English: 'Bike',
        Mandarin: '单车',
        character: '骹车',
        pinyin: 'kor1 lia1'
      }, {
        key: 147,
        English: 'Bus',
        Mandarin: '公车',
        character: '公交车',
        pinyin: 'gorng1 gau1 lia1'
      }, {
        key: 148,
        English: 'Train',
        Mandarin: '火车',
        character: '火车',
        pinyin: 'hue3 lia1'
      }, {
        key: 149,
        English: 'Boat',
        Mandarin: '船',
        character: '船',
        pinyin: 'song2'
      }, {
        key: 150,
        English: 'This',
        Mandarin: '这个',
        character: '这个 / 者个 / 即个',
        pinyin: 'zieh8 ge2 / zieh8 ge2 / zih6 ge2'
      }, {
        key: 151,
        English: 'That',
        Mandarin: '那个',
        character: '许个',
        pinyin: 'heh ge2 / hyorh ge2'
      }, {
        key: 152,
        English: 'Here',
        Mandarin: '这里/这边',
        character: '这厝 / 这落 / 这落 / 这途',
        pinyin: 'zieh8 lou4 / zieh8 lo1 / zia3 lo1 / zieh8 nou2'
      }, {
        key: 153,
        English: 'There',
        Mandarin: '那里/那边',
        character: '许厝 / 许厝 / 许途',
        pinyin: 'heh lou4 / hyorh lou4 / heh nou2'
      }, {
        key: 154,
        English: 'Over There',
        Mandarin: '在那边',
        character: '许丬',
        pinyin: 'heh be2'
      }, {
        key: 155,
        English: 'Come here',
        Mandarin: '来这里',
        character: '过/来',
        pinyin: 'gue4/li2'
      }, {
        key: 156,
        English: 'Go',
        Mandarin: '去',
        character: '去',
        pinyin: 'ky4'
      }, {
        key: 157,
        English: 'Food',
        Mandarin: '食物',
        character: '食的 （白）/ 食物  （文）',
        pinyin: 'sia2 geh / sih7 boh7'
      }, {
        key: 158,
        English: 'Water',
        Mandarin: '水',
        character: '水',
        pinyin: 'zui3'
      }, {
        key: 159,
        English: 'Today',
        Mandarin: '今天',
        character: '今旦',
        pinyin: 'ging1 ngua4'
      }, {
        key: 160,
        English: 'Tomorrow',
        Mandarin: '明天',
        character: '逢早',
        pinyin: 'horng2 nor3'
      }, {
        key: 161,
        English: 'Yesterday',
        Mandarin: '昨天',
        character: '昨暮',
        pinyin: 'soh mou4'
      }, {
        key: 162,
        English: 'Day',
        Mandarin: '日',
        character: '天光',
        pinyin: 'ting1 gung1'
      }, {
        key: 163,
        English: 'Night',
        Mandarin: '晚上',
        character: '暗暝时 / 暝时 / 暝时头',
        pinyin: 'ang4 ma2 li2 / ma2 li2 / ma2 li2 lau2'
      }, {
        key: 164,
        English: 'What\'s the weather?',
        Mandarin: '天气怎么样?',
        character: '天时何如？',
        pinyin: 'ting1 ni2 hor2 zy2 ?'
      }, {
        key: 165,
        English: 'Hot',
        Mandarin: '热',
        character: '热',
        pinyin: 'zeh7'
      }, {
        key: 166,
        English: 'Cold',
        Mandarin: '冷',
        character: '寒',
        pinyin: 'gua2'
      }, {
        key: 167,
        English: 'Rain',
        Mandarin: '雨',
        character: '雨',
        pinyin: 'hou5'
      }, {
        key: 168,
        English: 'Snow',
        Mandarin: '雪',
        character: '雪',
        pinyin: 'see5'
      }, {
        key: 169,
        English: 'Storm',
        Mandarin: '风暴',
        character: '风暴',
        pinyin: 'horng1 bor5'
      }, {
        key: 170,
        English: 'Nice weather',
        Mandarin: '好天气',
        character: '天时好/好天',
        pinyin: 'ting1 ni2 ho3/ ho3 ling1'
      }, {
        key: 171,
        English: 'Money',
        Mandarin: '钱',
        character: '钱',
        pinyin: 'zing2'
      }, {
        key: 172,
        English: 'Expensive',
        Mandarin: '贵',
        character: '贵',
        pinyin: 'gui4'
      }, {
        key: 173,
        English: 'Cheap',
        Mandarin: '便宜',
        character: '便宜',
        pinyin: 'beng2 i2/ngi2'
      }, {
        key: 174,
        English: 'Delicious',
        Mandarin: '好吃',
        character: '好食',
        pinyin: 'ho3 lia2'
      }, {
        key: 175,
        English: 'What time is it?',
        Mandarin: '现在几点?',
        character: '现时几点/ 这满几点？',
        pinyin: 'heng5 si2 gui3 lieng3 / zieh8 mua3 gui3 lieng3 ?'
      }, {
        key: 176,
        English: 'How much is it?',
        Mandarin: '多少钱?',
        character: '若伙钱？',
        pinyin: 'dieu ua5 ling2'
      }, {
        key: 177,
        English: 'How old are you?',
        Mandarin: '你几岁了? (for children) 你多大了? (for adults)',
        character: '你几岁？',
        pinyin: 'dy3 gui3 ue4'
      }, {
        key: 178,
        English: 'I am ... years old',
        Mandarin: '我…岁(了)',
        character: '我...岁',
        pinyin: 'guoh8 … ue4 / guoh8 … hue4'
      }, {
        key: 179,
        English: '0',
        Mandarin: '零',
        character: '零',
        pinyin: 'leng2'
      }, {
        key: 180,
        English: '1',
        Mandarin: '一',
        character: '一',
        pinyin: 'soh7 （白） / ih6 （文）'
      }, {
        key: 181,
        English: '2',
        Mandarin: '二',
        character: '两  （白） / 二 （文）',
        pinyin: 'nung5 （白） / zi5 （文）'
      }, {
        key: 182,
        English: '3',
        Mandarin: '三',
        character: '三',
        pinyin: 'sor1 （白） / sang1 （文）'
      }, {
        key: 183,
        English: '4',
        Mandarin: '四',
        character: '四',
        pinyin: 'si4 （白） / so4 （文）'
      }, {
        key: 184,
        English: '5',
        Mandarin: '五',
        character: '五',
        pinyin: 'ngou5 （白） / gou3 （文）'
      }, {
        key: 185,
        English: '6',
        Mandarin: '六',
        character: '六',
        pinyin: 'lah7 （白） / loeh7 （文）'
      }, {
        key: 186,
        English: '7',
        Mandarin: '七',
        character: '七',
        pinyin: 'cih6'
      }, {
        key: 187,
        English: '8',
        Mandarin: '八',
        character: '八',
        pinyin: 'be5 （白） / bah6 （文）'
      }, {
        key: 188,
        English: '9',
        Mandarin: '九',
        character: '九',
        pinyin: 'gau3 （白） / giu3 （文）'
      }, {
        key: 189,
        English: '10',
        Mandarin: '十',
        character: '十',
        pinyin: 'sae2 （白） / sih7 （文）'
      }, {
        key: 190,
        English: 'Amazing',
        Mandarin: '惊讶（表示好）',
        character: '大好',
        pinyin: 'dua5 ho3'
      }, {
        key: 191,
        English: 'What do you think?',
        Mandarin: '你怎么想？',
        character: '汝见觉咧',
        pinyin: 'dy3 ging4 gah6 leh6'
      }, {
        key: 192,
        English: 'I\'m happy',
        Mandarin: '我开心',
        character: '我欢喜',
        pinyin: 'guoh8 / gua3 hua1 i3'
      }, {
        key: 193,
        English: 'I\'m sad',
        Mandarin: '我伤心',
        character: '我伤心',
        pinyin: 'guoh8 / gua3 syorng1 ning1'
      }, {
        key: 194,
        English: 'I\'m angry',
        Mandarin: '我生气',
        character: '我冲狂',
        pinyin: 'guoh8 / gua3 coeng1 gorng2'
      }]
    }
  },
  methods: {
    handleSearch (selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
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
