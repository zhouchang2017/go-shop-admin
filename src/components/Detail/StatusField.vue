<template>
  <panel-item :field="field">
    <div
      slot="value"
      :class="`text-${field.text_align} flex items-center h-full`"
    >
      <div :class="warpClass"></div>
      <div>{{ value }}</div>
    </div>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  computed: {
    options() {
      return _.get(this, 'field.options')
    },
    option() {
      return _.find(this.options, ['value', this.field.value])
    },
    warpClass() {
      if (
        this.option &&
        !_.isNil(this.option.type) &&
        !_.isEmpty(this.option.type)
      ) {
        return [this.option.type, 'rounded-full w-2 h-2 mr-2']
      }
      return []
    },
    value() {
      if (this.option) {
        return this.option.label
      }
      return this.field.value
    }
  }
}
</script>
