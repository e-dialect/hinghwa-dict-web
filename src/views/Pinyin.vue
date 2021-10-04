<template>
  <div style="background: white;padding: 24px">
    <h1>拼音方案</h1>
    <div>
      <p>
        本拼音方案基于莆仙话爱好者圈子使用的“国际音标转写”改造而成，为方便大众了解和学习，本拼音在声母上做了贴近普通话拼音的处理。韵母在之前的基础上，做了一些调整，使拼写更加简洁，不同口音中的近似音视作同一个音位，标法一致。同时增加了表示声调的符号。本拼音定名为“莆仙话拼音”。
      </p>
      <p>
        莆仙话拼音可运用在学习、记录莆仙话词句，科普莆仙话正字，朗读古诗时体现韵脚，做莆仙话表情包，以及使用莆仙话输入方案。如今用普通话谐音字记录莆仙话的行为十分泛滥，谐音字不仅不雅观，还歪曲了莆仙话的发音，外地人依照“夸电喜”这样的发音，也无法学习到“看电视”（kuā-dèng-sĭ）准确的莆仙话发音，而了解了莆仙话拼音，有助力于掌握莆仙话整体发音。
      </p>
      <p>
        下面介绍的拼音方案为莆田城里口音。想要了解更多其他口音的介绍请关注微信公众号「莆仙乡音社」(微信号：PhouSengUa)搜索“拼音教程”，或者
        <a href="https://www.bilibili.com/video/BV1RJ411q7yW/" target="_blank">点击观看b站拼音教程视频</a>。
      </p>
    </div>
    <iframe
      src="https://player.bilibili.com/player.html?aid=77966786&bvid=BV1RJ411q7yW&cid=133662582&page=1"
      :scrolling="true"
      border="0"
      framespacing="0"
      :allowfullscreen="true"
      width="100%"
      height="500px"
    >
    </iframe>

    <h2>声母</h2>
    <pinyin-table :columns="columns" :pinyin="shengmu"/>

    <h2>韵母</h2>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="开尾韵">

        <pinyin-table :columns="columns" :pinyin="kai"/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="鼻尾韵">
        <pinyin-table :columns="columns" :pinyin="bi"/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="塞尾韵">
        <pinyin-table :columns="columns" :pinyin="se"/>
      </a-tab-pane>
    </a-tabs>

    <h2>声调</h2>
    <p>
      声调可以采用调符和调号两种方法表示。调符是使用符号表示每种声调的起伏，调号则是以数字表示对应的调类。
      调值是语言学上常用的标记，「五度标记法」，1到5个数字表示声调的相对音高，1是最低，5是最高，可以用音阶的do re mi fa sol来理解。
      另外莆仙话还有一个用在代词的声调，并且伴有喉塞音，这里把它标记成第三调，如「我」guoh3/guôh，「这」zeh3/zêh。
    </p>
    <pinyin-table :columns="columns2" :pinyin="tone"/>
  </div>
</template>

<script>
import PinyinTable from '@/components/PinyinTable'

export default {
  name: 'Pinyin',
  components: { PinyinTable },
  data () {
    return {
      columns: [
        {
          title: '拼音',
          dataIndex: 'pinyin',
          key: 'pinyin',
          align: 'center'
        },
        {
          title: '国际音标',
          dataIndex: 'IPA',
          key: 'IPA',
          align: 'center'
        },
        {
          title: '例字',
          dataIndex: 'example',
          key: 'example',
          align: 'center'
        },

        {
          title: '音频',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      shengmu: [{
        key: 0,
        pinyin: 'b',
        IPA: 'p',
        example: '布 bou4 班 bang1'
      }, {
        key: 1,
        pinyin: 'p',
        IPA: 'pʰ',
        example: '破 pua4 片 peng4'
      }, {
        key: 2,
        pinyin: 'm',
        IPA: 'm',
        example: '骂 mor4 免 meng3'
      }, {
        key: 3,
        pinyin: 'd',
        IPA: 't',
        example: '刀 do1 东 dorng1'
      }, {
        key: 4,
        pinyin: 't',
        IPA: 'tʰ',
        example: '桃 to2 头 tao2'
      }, {
        key: 5,
        pinyin: 'n',
        IPA: 'n',
        example: '脑 nor3 年 ning2'
      }, {
        key: 6,
        pinyin: 'l',
        IPA: 'l',
        example: '老 lao5 梨 li2'
      }, {
        key: 7,
        pinyin: 'z',
        IPA: 'ts',
        example: '纸 zyo3 粽 zang4'
      }, {
        key: 8,
        pinyin: 'c',
        IPA: 'tsʰ',
        example: '厝 cou4 葱 cang1'
      }, {
        key: 9,
        pinyin: 's',
        IPA: 'ɬ',
        example: '洗 se3 收 siu1'
      }, {
        key: 10,
        pinyin: 'g',
        IPA: 'k',
        example: '狗 gao3 讲 gorng3'
      }, {
        key: 11,
        pinyin: 'k',
        IPA: 'kʰ',
        example: '裤 kou4 轻 king1'
      }, {
        key: 12,
        pinyin: 'ng-',
        IPA: 'ŋ',
        example: '硬 nge5 颜 ngang2'
      }, {
        key: 13,
        pinyin: 'h',
        IPA: 'h',
        example: '雨 hou5 喜 hi3'
      }, {
        key: 14,
        pinyin: '零声母',
        IPA: 'ʔ/不标',
        example: '乌 ou1 云 ong2'
      }],
      kai: [{
        key: 0,
        pinyin: 'a',
        IPA: 'a',
        example: '家 ga1 百 ba5'
      }, {
        key: 1,
        pinyin: 'or',
        IPA: 'ɒ',
        example: '下 or5 马 bor3'
      }, {
        key: 2,
        pinyin: 'ae',
        IPA: 'ɛ',
        example: '十 sae2'
      }, {
        key: 3,
        pinyin: 'e',
        IPA: 'e',
        example: '鞋 e2 鸡 ge1'
      }, {
        key: 4,
        pinyin: 'oe',
        IPA: 'ø',
        example: '退 toe4 所 soe3'
      }, {
        key: 5,
        pinyin: 'o',
        IPA: 'o',
        example: '学 o2 刀 do1'
      }, {
        key: 6,
        pinyin: 'i',
        IPA: 'i',
        example: '枝 gi1 戏 hi4'
      }, {
        key: 7,
        pinyin: 'y',
        IPA: 'y',
        example: '鱼 hy2 猪 dy1'
      }, {
        key: 8,
        pinyin: 'u',
        IPA: 'u',
        example: '有 u5 牛 gu2'
      }, {
        key: 9,
        pinyin: 'ai',
        IPA: 'ai',
        example: '菜 cai4 海 hai3'
      }, {
        key: 10,
        pinyin: 'ao',
        IPA: 'au',
        example: '后 ao5 豆 dao5'
      }, {
        key: 11,
        pinyin: 'ou',
        IPA: 'ɔu',
        example: '乌 ou1 古 gou3'
      }, {
        key: 12,
        pinyin: 'ia',
        IPA: 'ia',
        example: '车 cia1 谢 sia5'
      }, {
        key: 13,
        pinyin: 'ieo',
        IPA: 'ieu',
        example: '药 ieo2 鸟 zieo3'
      }, {
        key: 14,
        pinyin: 'iu',
        IPA: 'iu',
        example: '油 iu2 救giu4'
      }, {
        key: 15,
        pinyin: 'ua',
        IPA: 'ua',
        example: '画 ua5 花 hua1'
      }, {
        key: 16,
        pinyin: 'ue',
        IPA: 'uei',
        example: '歪 ue1 飞 bue1'
      }, {
        key: 17,
        pinyin: 'ui',
        IPA: 'ui',
        example: '位 ui5 水 zui3'
      }, {
        key: 18,
        pinyin: 'yo',
        IPA: 'yɒ',
        example: '蛇 syo2 鹅 gyo2'
      }],
      bi: [{
        key: 0,
        pinyin: 'ang',
        IPA: 'aŋ',
        example: '红 ang2 重 dang5'
      }, {
        key: 1,
        pinyin: 'orng',
        IPA: 'ɒŋ',
        example: '王 orng2 公 gorng1'
      }, {
        key: 2,
        pinyin: 'eng',
        IPA: 'ɛŋ',
        example: '灯 deng1 生 seng1'
      }, {
        key: 3,
        pinyin: 'oeng',
        IPA: 'œŋ',
        example: '宫 goeng1 窗 toeng1'
      }, {
        key: 4,
        pinyin: 'ong',
        IPA: 'ɔŋ',
        example: '云 ong2 分 bong1'
      }, {
        key: 5,
        pinyin: 'ing',
        IPA: 'iŋ',
        example: '冰 bing1 心 sing1'
      }, {
        key: 6,
        pinyin: 'ieng',
        IPA: 'iɛŋ',
        example: '盐 ieng2 尖 zieng1'
      }, {
        key: 7,
        pinyin: 'ung',
        IPA: 'uŋ',
        example: '光 gung1 霜 sung1'
      }, {
        key: 8,
        pinyin: 'uang',
        IPA: 'uaŋ',
        example: '弯 uang1 团duang2'
      }, {
        key: 9,
        pinyin: 'yng',
        IPA: 'yŋ',
        example: '斤 gyng1 银 ngyng2'
      }, {
        key: 10,
        pinyin: 'yong',
        IPA: 'yɒŋ',
        example: '上 syong5 场 dyong2'
      }, {
        key: 11,
        pinyin: 'ng',
        IPA: 'ŋ̍',
        example: '黄 ng2 方 hng1'
      }],
      se: [{
        key: 0,
        pinyin: 'ah',
        IPA: 'aʔ',
        example: '合 hah7 读 tah7'
      }, {
        key: 1,
        pinyin: 'orh',
        IPA: 'ɒʔ',
        example: '盒 orh7 国 gorh6'
      }, {
        key: 2,
        pinyin: 'eh',
        IPA: 'ɛʔ',
        example: '踢 teh6 热 zeh7'
      }, {
        key: 3,
        pinyin: 'oeh',
        IPA: 'œʔ',
        example: '竹 doeh6 玉 goeh7'
      }, {
        key: 4,
        pinyin: 'oh',
        IPA: 'ɔʔ',
        example: '出 coh6 骨 goh6'
      }, {
        key: 5,
        pinyin: 'ih',
        IPA: 'iʔ',
        example: '笔 bih6 七 cih6'
      }, {
        key: 6,
        pinyin: 'iah',
        IPA: 'iaʔ',
        example: '食 siah7 揲 iah7(扇动)'
      }, {
        key: 7,
        pinyin: 'ieh',
        IPA: 'iɛʔ',
        example: '页 ieh7 业 gieh7'
      }, {
        key: 8,
        pinyin: 'uh',
        IPA: 'uʔ',
        example: '*'
      }, {
        key: 9,
        pinyin: 'uah',
        IPA: 'uaʔ',
        example: '刷 suah6 发 huah6'
      }, {
        key: 10,
        pinyin: 'uoh',
        IPA: 'uoʔ',
        example: '我 guoh3'
      }, {
        key: 11,
        pinyin: 'yh',
        IPA: 'yʔ',
        example: '疫 yh7 域 yh7'
      }, {
        key: 12,
        pinyin: 'yoh',
        IPA: 'yɒʔ',
        example: '约 yoh6 雀 cyoh6'
      }],
      columns2: [
        {
          title: '调类',
          dataIndex: 'type',
          key: 'type',
          align: 'center'
        },
        {
          title: '调值/调符',
          dataIndex: 'tone',
          key: 'tone',
          align: 'center'
        },
        {
          title: '例字/调号',
          dataIndex: 'example',
          key: 'example',
          align: 'center'
        },

        {
          title: '音频',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ],
      tone: [{
        key: 0,
        type: '阴平',
        tone: '533 gī',
        example: '枝 gi1'
      }, {
        key: 1,
        type: '阳平',
        tone: '13 gí',
        example: '期 gi2'
      }, {
        key: 2,
        type: '上声',
        tone: '453 gî',
        example: '指 gi3'
      }, {
        key: 3,
        type: '阴去',
        tone: '42 gì',
        example: '记 gi4'
      }, {
        key: 4,
        type: '阳去',
        tone: '11 gĭ',
        example: '义 gi5'
      }, {
        key: 5,
        type: '阴入',
        tone: '21 gĭh',
        example: '急 gih6'
      }, {
        key: 6,
        type: '阳入',
        tone: '4 gíh',
        example: '及 gih7'
      }]

    }
  }
}
</script>

<style scoped>

</style>
