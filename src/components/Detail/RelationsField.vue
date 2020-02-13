<template>
  <resource-table
    :viaHeadings="field.headings"
    :viaResourceName="field.resource_name"
    :loadCards="false"
    :extendRequestQueryParams="extendRequestQueryParams"
  />
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  computed: {
    multipleable() {
      return _.get(this, 'field.meta.multiple', false)
    },
    extendRequestQueryParams() {
      let ids = ''
      if (_.isString(this.field.value)) {
        ids = this.field.value
      } else {
        ids = this.field.value.join(',')
      }
      return {
        ids: ids
      }
    }
  }
}
</script>
