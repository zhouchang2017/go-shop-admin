<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
    <form-currency v-model="value" v-bind="extraProps" />
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
export default {
  mixins: [FormField, HandlesValidationErrors],
  computed: {
    currency() {
      return _.get(this, 'field.meta.currency', 'CNY')
    },
    locale() {
      return _.get(this, 'field.meta.locale', 'zh-CN')
    },
    precision() {
      return _.get(this, 'field.meta.precision', 2)
    },
    valueAsInteger() {
      return _.get(this, 'field.meta.valueAsInteger', true)
    },
    extraClass() {
      return _.get(this, 'field.meta.extraClass', '')
    },
    extraProps() {
      let props = _.get(this, 'field.meta.extraProps', {})
      let placeholder = this.field.placeholder
      if (placeholder === '') {
        placeholder = this.field.name
      }
      return {
        placeholder: this.placeholder,
        ...props,
        currency: this.currency,
        locale: this.locale,
        precision: this.precision,
        valueAsInteger: this.valueAsInteger,
        extraClass: this.extraClass
      }
    }
  }
}
</script>
