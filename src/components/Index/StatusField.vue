<template>
  <div :class="`text-${field.text_align}`">
    <div :class="status" class="rounded-full w-2 h-2"></div>
  </div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],
  data: () => ({
    colors: {
      success: 'bg-green-400',
      info: 'bg-blue-400',
      warning: 'bg-yellow-400',
      danger: 'bg-red-400',
      cancel: 'bg-gray-400',
      error: 'bg-red-400'
    }
  }),

  computed: {
    config() {
      // value -> type
      return _.get(this, 'field.config', {
        1: 'success',
        0: 'error'
      })
    },
    options() {
      // value -> info
      return _.get(this, 'field.option')
    },
    status() {
      return this.colors[_.get(this.config, this.value, '')]
    },
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
