<template>
  <div class="whitespace-no-wrap">{{ value }}</div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],
  computed: {
    value() {
      return _.find(this.field.options, ['value', this.field.value]).label
    }
  }
}
</script>
