<template>
  <el-input
    :placeholder="placeholder"
    v-bind:value="value"
    v-on:input="v => $emit('input', v)"
    clearable
  >
    <div slot="prefix">
      <IIcon type="i-search" />
    </div>
  </el-input>
</template>

<script>
export default {
  name: 'z-search-input',
  props: {
    placeholder: {
      type: String,
      default: 'Search by keywords'
    },
    value: {
      type: String
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  }
}
</script>

<style scoped></style>
