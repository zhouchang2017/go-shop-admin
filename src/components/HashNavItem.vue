<template>
  <li class="mb-2">
    <a
      :href="hash"
      class="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
    >
      {{ name }}
    </a>
  </li>
</template>

<script>
export default {
  name: 'hash-nav-item',
  props: {
    name: String
  },
  computed: {
    hash() {
      return '#' + this.name
    }
  }
}
</script>

<style></style>
