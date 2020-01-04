<template>
  <div class="flex items-center h-full">
    <div :class="bgC" class="rounded-full w-2 h-2"></div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'status-field',
  props: {
    type: {
      type: String,
      validator: function(value) {
        return [
          'success',
          'info',
          'warning',
          'danger',
          'error',
          'cancel'
        ].includes(value)
      }
    },
    color: String
  },

  data() {
    return {
      colors: {
        success: 'bg-green-400',
        info: 'bg-blue-400',
        warning: 'bg-yellow-400',
        danger: 'bg-red-400',
        cancel: 'bg-gray-400',
        error: 'bg-red-400'
      }
    }
  },

  computed: {
    bgC() {
      if (this.color) {
        return this.color
      }
      return this.colors[this.type || 'success']
    }
  }
}
</script>

<style scoped></style>
