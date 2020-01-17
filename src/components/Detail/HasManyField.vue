<template>
  <resource-table
    :viaHeadings="field.headings"
    :viaResourceName="field.via_resource_name"
    :loadCards="false"
    :extendRequestQueryParams="extendRequestQueryParams"
  />
</template>
<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],

  computed: {
    extendRequestQueryParams() {
      return {
        [this.field.local_key]: this.resourceId
      }
    }
  }
}
</script>
