<template>
  <div :class="`text-${field.text_align} flex flex-col h-full`">
    <div class="flex items-center">
      <div :class="warpClass"></div>
      <div>{{ value }}</div>
    </div>
    <div class="flex mt-1" v-if="status === 2">
      <el-link type="primary" @click="toShipment" :underline="false"
        >发货</el-link
      >
    </div>
    <div class="flex mt-1" v-if="status === 3">
      <el-link type="primary" @click="toLogistics" :underline="false"
        >查看物流</el-link
      >
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
        { name: '已完成', value: 4 },
        { name: '待评价', value: 5 },

        { name: 'N/A', value: null }
      ]
    }
  },

  methods: {
    // 发货
    toShipment() {
      this.$router.push({
        name: 'orders.shipment',
        params: { id: this.id }
      })
    },
    // 物流详情
    toLogistics() {
      this.$router.push({
        name: 'orders.logistics',
        params: { id: this.id }
      })
    }
  },

  computed: {
    id() {
      return _.get(this.field, 'value.id', null)
    },
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
