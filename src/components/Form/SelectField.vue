<template>
  <el-form-item :required="isRequired" :label="field.name" :error="firstError">
    <el-select v-model="value" :placeholder="placeholder">
      <template v-if="hasGroup">
        <el-option-group
          v-for="(group, label) in groupedOptions"
          :key="label"
          :label="label"
        >
          <el-option
            v-for="item in group"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          >
          </el-option>
        </el-option-group>
      </template>
      <template v-else>
        <el-option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        >
        </el-option>
      </template>
    </el-select>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'

export default {
  mixins: [FormField, HandlesValidationErrors],

  methods: {
    /**
     * Resolve the component name.
     */
    resolveComponentName(field) {
      return field.prefix_component
        ? `index-${field.component}`
        : field.component
    }
  },

  computed: {
    options() {
      return _.get(this, 'field.options', [])
    },
    hasGroup() {
      return !_.isNil(this.groupedOptions) && !_.isEmpty(this.groupedOptions)
    },
    groupedOptions() {
      return _.groupBy(
        this.options.filter(opt => opt.group !== ''),
        option => option.group || ''
      )
    },
    placeholder() {
      return this.field.placeholder || this.field.name
    }
  }
}
</script>
