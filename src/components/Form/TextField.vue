<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
    <el-input-number
      v-if="isInputNumber"
      v-model="value"
      :id="field.attribute"
      :disabled="isReadonly"
      v-bind="extraAttributes"
    ></el-input-number>
    <el-input
      v-else
      :id="field.attribute"
      v-model="value"
      :disabled="isReadonly"
      v-bind="extraAttributes"
    ></el-input>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
export default {
  mixins: [FormField, HandlesValidationErrors],

  computed: {
    defaultAttributes() {
      let attrs = {}
      attrs.type = _.get(this, 'field.meta.type', 'text')
      attrs.placeholder = _.get(this, 'field.meta.placeholder', this.field.name)
      attrs.clearable = _.get(this, 'field.meta.clearable', false)
      attrs.label = _.get(this, 'field.name')
      if (!_.isNil(_.get(this, 'field.meta.min'))) {
        if (attrs.type === 'textarea') {
          attrs.minlength = _.get(this, 'field.meta.min')
        } else {
          attrs.min = _.get(this, 'field.meta.min')
        }
      }
      if (!_.isNil(_.get(this, 'field.meta.max'))) {
        if (attrs.type === 'textarea') {
          attrs.maxlength = _.get(this, 'field.meta.min')
        } else {
          attrs.max = _.get(this, 'field.meta.max')
        }
      }
      if (
        !_.isNil(_.get(this, 'field.meta.showWordLimit')) &&
        ['text', 'textarea'].includes(attrs.type)
      ) {
        attrs.showWordLimit = _.get(this, 'field.meta.showWordLimit')
      }

      if (
        !_.isNil(_.get(this, 'field.meta.rows') && attrs.type === 'textarea')
      ) {
        attrs.rows = _.get(this, 'field.meta.rows')
      }

      if (
        !_.isNil(
          _.get(this, 'field.meta.autosize') && attrs.type === 'textarea'
        )
      ) {
        if (
          _.isNil(
            _.get(this, 'field.meta.minRows') &&
              _.isNil(_.get(this, 'field.meta.maxRows'))
          )
        ) {
          attrs.autosize = {
            minRows: this.field.meta.minRows,
            maxRows: this.field.meta.maxRows
          }
        } else {
          attrs.autosize = true
        }
      }

      if (!_.isNil(_.get(this, 'field.meta.step'))) {
        attrs.step = _.get(this, 'field.meta.step')
      }
      if (!_.isNil(_.get(this, 'field.meta.pattern'))) {
        attrs.pattern = _.get(this, 'field.meta.pattern')
      }

      return attrs
    },

    extraAttributes() {
      const attrs = this.field.extraAttributes

      return {
        // Leave the default attributes even though we can now specify
        // whatever attributes we like because the old number field still
        // uses the old field attributes
        ...this.defaultAttributes,
        ...attrs
      }
    },

    isInputNumber() {
      return _.get(this, 'field.meta.input_number', false)
    }
  }
}
</script>
