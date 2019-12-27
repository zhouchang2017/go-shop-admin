<template>
  <el-table
    :data="values"
    class="rounded-lg overflow-hidden"
    fit
    highlight-current-row
    style="width: 100%;"
  >
    <el-table-column
      v-for="(prop, label) in headings"
      :label="label"
      :prop="prop"
      align="left"
      :key="prop"
    >
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],

  computed: {
    values() {
      return _.get(this, 'field.value', [])
    },
    headings() {
      return _.get(this, 'field.meta.headings', {})
    }
  }
}
</script>
