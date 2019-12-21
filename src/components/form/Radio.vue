<template>
  <input
    class="form-radio"
    :class="{ 'border-red-500': hasError }"
    type="radio"
    :value="defaultValue"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script>
import FormItem from '@/mixins/formItem'
export default {
  name: 'z-radio',
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
