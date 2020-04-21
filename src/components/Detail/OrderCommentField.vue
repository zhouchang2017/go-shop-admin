<template>
  <div class="p-3">
    暂无评价
  </div>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  data() {
    return {
      loading: false
    }
  },
  inject: ['reload'],
  mounted() {},
  methods: {},
  computed: {
    id() {
      return _.get(this.field, 'value.id')
    },
    orderNo() {
      return _.get(this.field, 'value.order_no')
    }
  }
}
</script>
