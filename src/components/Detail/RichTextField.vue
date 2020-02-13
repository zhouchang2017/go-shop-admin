<template>
  <panel-item :field="field">
    <div slot="value" v-html="field.value" class="ql-editor"></div>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field']
}
</script>
