<template>
  <panel-item :field="field">
    <template slot="value">
      {{ value }}
    </template>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  computed: {
    value() {
      return this.$money({
        amount: this.field.value,
        currency: this.currency,
        precision: this.precision
      })
        .setLocale(this.locale)
        .toFormat()
    },
    currency() {
      return _.get(this, 'field.meta.currency', 'CNY')
    },
    locale() {
      return _.get(this, 'field.meta.locale', 'zh-CN')
    },
    precision() {
      return _.get(this, 'field.meta.precision', 2)
    }
  }
}
</script>
