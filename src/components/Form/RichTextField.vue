<template>
  <el-form-item
    :required="isRequired"
    :error="firstError"
    :label="field.name"
    class="full"
  >
    <quill-editor v-model="value" :action="field.action" :token="field.token">
    </quill-editor>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'

export default {
  mixins: [FormField, HandlesValidationErrors],
  components: {
    'quill-editor': () => import('@/3rd-components/Quill')
  }
}
</script>
