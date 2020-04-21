<template>
  <div :class="`text-${field.text_align} flex flex-col h-full`">
    <div class="flex items-center">
      <div :class="warpClass"></div>
      <div>{{ value }}</div>
    </div>
    <div class="flex flex-wrap">
      <router-link
        v-if="status === 2"
        title="发货"
        :to="{
          name: 'orders.shipment',
          params: { id: id }
        }"
        class="hover:opacity-75 font-bold inline-block text-xs text-blue-500 mr-2"
      >
        发货
      </router-link>
      <router-link
        v-if="status === 3"
        title="查看物流"
        :to="{
          name: 'orders.logistics',
          params: { id: id }
        }"
        class="hover:opacity-75 font-bold inline-block text-xs text-blue-500 mr-2"
      >
        查看物流
      </router-link>
      <router-link
        v-if="hasRefund"
        title="退款详情"
        :to="{
          name: 'orders.refund',
          params: { id: id }
        }"
        class="hover:opacity-75 font-bold inline-block text-xs text-blue-500 mr-2"
      >
        有退款
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],

  data() {
    return {}
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
      return [
        'rounded-full w-2 h-2 mr-2',
        _.get(this, 'statusObject.class', 'bg-gray-400')
      ]
    },
    statusObject() {
      return _.find(this.appConfig.order_status, ['value', this.status])
    },
    value() {
      return _.get(this, 'statusObject.name', 'N/A')
    },
    hasRefund() {
      return _.get(this, 'field.value.order_items', []).some(
        item => item.refunding
      )
    }
  }
}
</script>
