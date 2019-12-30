<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
    <el-input
      type="password"
      :placeholder="field.name"
      :id="field.attribute"
      v-model="value"
      :disabled="isReadonly"
    ></el-input>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
export default {
  mixins: [FormField, HandlesValidationErrors]
}
</script>
