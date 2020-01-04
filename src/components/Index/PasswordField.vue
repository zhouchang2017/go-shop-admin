<template>
  <div :class="`text-${field.text_align}`">
    <span class="font-bold">......</span>
  </div>
</template>

<script>
export default {
  props: ['resourceName', 'field']
}
</script>
