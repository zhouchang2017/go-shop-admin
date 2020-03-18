<template>
  <div :class="`text-${field.text_align} flex flex-col items-center h-full`">
    <div class="flex items-center">
      <div :class="warpClass"></div>
      <div>{{ value }}</div>
    </div>
    <div class="flex" v-if="status === 2">
      <el-button type="primary" size="mini">发货</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],

  data() {
    return {
      statusMap: [
        { name: '已取消', value: -1 },
        { name: '待付款', value: 0 },
        { name: '已付款', value: 1 },
        { name: '待发货', value: 2 },
        { name: '待收货', value: 3 },
        { name: '待评价', value: 4 },
        { name: '已完成', value: 5 },
        { name: 'N/A', value: null }
      ]
    }
  },

  computed: {
    status() {
      return _.get(this.field, 'value.status', null)
    },
    warpClass() {
      let statusClass = ['rounded-full w-2 h-2 mr-2']
      switch (this.status) {
        case -1:
          statusClass.push('bg-gray-400')
          break
        case 0:
          statusClass.push('bg-yellow-400')
          break
        case 1:
          statusClass.push('bg-blue-400')
          break
        case 2:
          statusClass.push('bg-red-400')
          break
        case 3:
          statusClass.push('bg-green-200')
          break
        case 4:
          statusClass.push('bg-green-300')
          break
        case 5:
          statusClass.push('bg-green-400')
          break
        default:
          statusClass.push('bg-gray-400')
      }
      return statusClass
    },
    value() {
      return _.find(this.statusMap, ['value', this.status]).name
    }
  }
}
</script>
