<template>
  <span class="whitespace-no-wrap">{{ field.value | timeStr }}</span>
</template>

<script>
export default {
  props: ['resourceName', 'field']
}
</script>
