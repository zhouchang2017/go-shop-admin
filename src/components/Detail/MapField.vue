<template>
  <panel-item :field="field">
    <template slot="value">
      <baidu-map-view :location="field.value" />
    </template>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field']
}
</script>
