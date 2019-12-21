<template>
  <input
    class="form-input w-full"
    :class="{ 'border-red-500': hasError }"
    :type="type || 'text'"
    :placeholder="placeholder || ''"
    :value="defaultValue"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>

<script>
import FormItem from '@/mixins/formItem'
export default {
  name: 'z-input',
  mixins: [FormItem],
  props: ['placeholder', 'value', 'type'],
  data() {
    return {
      id: ''
    }
  },
  mounted() {}
}
</script>

<style></style>
