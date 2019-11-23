<template>
  <div>
    <label
      v-if="label"
      class="block mb-2 text-sm font-bold text-gray-700"
      :for="id"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      :type="type || 'text'"
      :placeholder="placeholder || ''"
      v-on:input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'z-input',
  props: ['placeholder', 'value', 'type', 'label'],
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      id: ''
    }
  },
  mounted() {
    this.id = _.uniqueId('input')
  }
}
</script>

<style></style>
