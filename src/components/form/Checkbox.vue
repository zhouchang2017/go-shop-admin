<template>
  <input
    class="form-checkbox"
    :class="{ 'border-red-500': hasError }"
    type="checkbox"
    :value="defaultValue"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script>
import FormItem from '@/mixins/formItem'
export default {
  name: 'z-checkbox',
  mixins: [FormItem],
  props: ['value'],
  data() {
    return {
      id: ''
    }
  },
  mounted() {}
}
</script>

<style></style>
