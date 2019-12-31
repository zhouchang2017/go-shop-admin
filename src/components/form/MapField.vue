<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
    <baidu-b-map :id="field.attribute" v-model="value" :disabled="isReadonly">
    </baidu-b-map>
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
        lat: 28.199554,
        lng: 112.969625
      }
    }
  }
}
</script>

<style scoped></style>
