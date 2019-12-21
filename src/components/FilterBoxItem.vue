<template>
  <div>
    <div
      class="bg-gray-200 text-xs tracking-wide uppercase font-bold text-gray-500 px-3 py-1"
    >
      {{ name }}
    </div>
    <div class="px-3 py-1"><slot /></div>
  </div>
</template>

<script>
export default {
  props: ['name']
}
</script>

<style></style>
