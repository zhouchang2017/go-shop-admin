<template>
  <el-cascader :options="availableOptions" v-model="selected" v-bind="$props">
  </el-cascader>
</template>

<script>
import { regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { Cascader } from 'element-ui'
export default {
  name: 'AreaCascader',

  props: {
    ...Cascader.props,
    value: {
      type: Object,
      default: () => {
        return {
          province: '',
          city: '',
          areas: ''
        }
      }
    }
  },

  data() {
    return {
      availableOptions: regionDataPlus
    }
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  methods: {
    textToCode() {
      const { province, city, areas } = this.value
      if (province === '全部') {
        return ['']
      }
      let data = []
      if (!_.isEmpty(province)) {
        data.push(TextToCode[province].code)
      }
      if (!_.isEmpty(province) && !_.isEmpty(city)) {
        data.push(TextToCode[province][city].code)
      }
      if (!_.isEmpty(province) && !_.isEmpty(city) && !_.isEmpty(areas)) {
        data.push(TextToCode[province][city][areas].code)
      }
      return data
    },

    codeToText(value) {
      let data = {
        province: '',
        city: '',
        areas: ''
      }
      let count = value.length
      Object.keys(data).forEach((key, index) => {
        if (index + 1 <= count) {
          data[key] = CodeToText[value[index]]
        }
      })
      return data
    },

    handleChange(value) {
      this.$emit('change', this.codeToText(value))
    }
  },

  computed: {
    selected: {
      get() {
        return this.textToCode() || []
      },
      set(value) {
        this.$emit('input', this.codeToText(value))
      }
    }
  }
}
</script>

<style scoped></style>
