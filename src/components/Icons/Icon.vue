<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
    :width="width"
    :height="height"
    :viewBox="viewBox"
  >
    <component :is="iconName" />
  </svg>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'i-delete'
    },
    viewBox: {
      type: String,
      default: '0 0 24 24'
    },
    width: {
      type: [Number, String],
      default: 24
    },
    height: {
      type: [Number, String],
      default: 24
    }
  },

  computed: {
    iconName() {
      return this.type
    }
  }
}
</script>
