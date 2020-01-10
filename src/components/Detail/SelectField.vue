<template>
  <panel-item :field="field">
    <p slot="value">
      {{ value }}
    </p>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  computed: {
    value() {
      return _.find(this.field.options, ['value', this.field.value]).label
    }
  }
}
</script>
