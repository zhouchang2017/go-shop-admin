<template>
  <el-form-item v-if="updating" label="ID" prop="id">
    <el-date-picker
      :id="field.attribute"
      v-model="value"
      type="datetime"
      :disabled="isReadonly"
      v-bind="extraAttributes"
      :picker-options="pickerOptions"
    >
    </el-date-picker>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'

export default {
  mixins: [FormField],

  data: () => ({
    pickerOptions: {
      shortcuts: [
        {
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        },
        {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        },
        {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }
      ]
    }
  }),

  computed: {
    defaultAttributes() {
      return {
        type: this.field.type || 'text',
        min: this.field.min,
        max: this.field.max,
        step: this.field.step,
        pattern: this.field.pattern,
        placeholder: this.field.placeholder || this.field.name
      }
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
    }
  }
}
</script>
