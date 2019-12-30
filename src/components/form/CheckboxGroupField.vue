<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
    <el-checkbox-group
      :disabled="isReadonly"
      :id="field.attribute"
      v-model="value"
    >
      <el-checkbox
        v-for="(option, index) in options"
        :label="option.value"
        :disabled="option.disabled"
        :key="index"
        v-bind="defaultAttributes"
        >{{ option.label }}</el-checkbox
      >
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
export default {
  mixins: [FormField, HandlesValidationErrors],

  data() {
    return {
      value: []
    }
  },

  methods: {
    setInitialValue() {
      this.value = this.initDefaultValue
    }
  },

  computed: {
    initDefaultValue() {
      if (!_.isNil(this.field.value) && !_.isEmpty(this.field.value)) {
        if (this.field.key_field) {
          return this.field.value.map(item => item[this.field.key_field])
        }
        return this.field.value
      }
      return []
    },
    options() {
      return _.get(this, 'field.options', [])
    },
    defaultAttributes() {
      return _.tap({}, attrs => {
        if (_.has(this.field, 'min')) {
          attrs.min = this.field.min
        }

        if (_.has(this.field, 'max')) {
          attrs.max = this.field.max
        }
      })
    }
  }
}
</script>
