<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
    <area-cascader
      filterable
      :id="field.attribute"
      v-model="value"
      :disabled="isReadonly"
      class="w-full"
    >
    </area-cascader>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
export default {
  mixins: [FormField, HandlesValidationErrors],

  data() {
    return {
      value: {
        province: '',
        city: '',
        areas: ''
      }
    }
  }
}
</script>

<style scoped></style>
