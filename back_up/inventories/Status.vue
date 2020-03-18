<template>
  <StatusField :type="toStatus(value)">
    <span class="font-bold ml-2">{{ toStatus(value, 'name', 'N/A') }}</span>
  </StatusField>
</template>

<script>
import inventory from './inventory'
export default {
  name: 'InventoryStatus',
  props: ['value'],
  mixins: [inventory],
  components: {
    StatusField: () => import('@/components/StatusField')
  },
  methods: {
    toStatus(status, field = 'type', value = 'cancel') {
      return _.get(
        this.status.find(state => state.value === status),
        field,
        value
      )
    }
  }
}
</script>
