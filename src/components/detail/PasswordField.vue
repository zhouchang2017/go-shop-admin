<template>
  <panel-item :field="field">
    <p slot="value">
      ......
    </p>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field']
}
</script>
