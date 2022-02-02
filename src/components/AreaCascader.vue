<template>
  <a-cascader
    v-model="option"
    :options="towns"
    placeholder="默认发音乡镇"
    :disabled="disabled"
  />
</template>

<script>
export default {
  name: 'AreaCascader',
  props: {
    county: String,
    town: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      towns: [{
        value: '城厢区',
        label: '城厢区',
        children: [{
          value: '龙桥街道',
          label: '龙桥街道'
        }, {
          value: '凤凰山街道',
          label: '凤凰山街道'
        }, {
          value: '霞林街道',
          label: '霞林街道'
        }, {
          value: '常太镇',
          label: '常太镇'
        }, {
          value: '华亭镇',
          label: '华亭镇'
        }, {
          value: '灵川镇',
          label: '灵川镇'
        }, {
          value: '东海镇',
          label: '东海镇'
        }]
      }, {
        value: '涵江区',
        label: '涵江区',
        children: [{
          value: '涵东街道',
          label: '涵东街道'
        }, {
          value: '涵西街道',
          label: '涵西街道'
        }, {
          value: '三江口镇',
          label: '三江口镇'
        }, {
          value: '白塘镇',
          label: '白塘镇'
        }, {
          value: '国欢镇',
          label: '国欢镇'
        }, {
          value: '梧塘镇',
          label: '梧塘镇'
        }, {
          value: '江口镇',
          label: '江口镇'
        }, {
          value: '萩芦镇',
          label: '萩芦镇'
        }, {
          value: '白沙镇',
          label: '白沙镇'
        }, {
          value: '庄边镇',
          label: '庄边镇'
        }, {
          value: '新县镇',
          label: '新县镇'
        }, {
          value: '大洋乡',
          label: '大洋乡'
        }]
      }, {
        value: '荔城区',
        label: '荔城区',
        children: [{
          value: '镇海街道',
          label: '镇海街道'
        }, {
          value: '拱辰街道',
          label: '拱辰街道'
        }, {
          value: '西天尾镇',
          label: '西天尾镇'
        }, {
          value: '黄石镇',
          label: '黄石镇'
        }, {
          value: '新度镇',
          label: '新度镇'
        }, {
          value: '北高镇',
          label: '北高镇'
        }]
      }, {
        value: '秀屿区',
        label: '秀屿区',
        children: [{
          value: '笏石镇',
          label: '笏石镇'
        }, {
          value: '东庄镇',
          label: '东庄镇'
        }, {
          value: '忠门镇',
          label: '忠门镇'
        }, {
          value: '东埔镇',
          label: '东埔镇'
        }, {
          value: '东峤镇',
          label: '东峤镇'
        }, {
          value: '埭头镇',
          label: '埭头镇'
        }, {
          value: '平海镇',
          label: '平海镇'
        }, {
          value: '南日镇',
          label: '南日镇'
        }, {
          value: '湄洲镇',
          label: '湄洲镇'
        }, {
          value: '山亭镇',
          label: '山亭镇'
        }, {
          value: '月塘乡',
          label: '月塘乡'
        }]
      }, {
        value: '仙游县',
        label: '仙游县',
        children: [{
          value: '鲤城街道',
          label: '鲤城街道'
        }, {
          value: '枫亭镇',
          label: '枫亭镇'
        }, {
          value: '榜头镇',
          label: '榜头镇'
        }, {
          value: '郊尾镇',
          label: '郊尾镇'
        }, {
          value: '度尾镇',
          label: '度尾镇'
        }, {
          value: '鲤南镇',
          label: '鲤南镇'
        }, {
          value: '赖店镇',
          label: '赖店镇'
        }, {
          value: '盖尾镇',
          label: '盖尾镇'
        }, {
          value: '园庄镇',
          label: '园庄镇'
        }, {
          value: '大济镇',
          label: '大济镇'
        }, {
          value: '龙华镇',
          label: '龙华镇'
        }, {
          value: '钟山镇',
          label: '钟山镇'
        }, {
          value: '游洋镇',
          label: '游洋镇'
        }, {
          value: '西苑乡',
          label: '西苑乡'
        }, {
          value: '石苍乡',
          label: '石苍乡'
        }, {
          value: '社硎乡',
          label: '社硎乡'
        }, {
          value: '书峰乡',
          label: '书峰乡'
        }, {
          value: '菜溪乡',
          label: '菜溪乡'
        }]
      }]
    }
  },
  computed: {
    option: {
      get () {
        return [this.county, this.town]
      },
      set (value) {
        this.$emit('update:county', value[0])
        this.$emit('update:town', value[1])
      }
    }
  }
}
</script>

<style scoped>

</style>
