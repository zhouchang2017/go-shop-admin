<template>
  <el-table
    :data="values"
    class="rounded-lg overflow-hidden"
    fit
    highlight-current-row
    style="width: 100%;"
  >
    <el-table-column
      show-overflow-tooltip
      v-for="(item, index) in headings"
      :label="item.name"
      :prop="item.attribute"
      align="left"
      :key="index"
    >
      <template slot-scope="{ row }">
        <component
          :is="resolveComponentName(item)"
          :resource-name="resourceName"
          :field="row[index]"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['resourceName', 'field'],
  methods: {
    /**
     * Resolve the component name.
     */
    resolveComponentName(field) {
      return field.prefix_component
        ? 'index-' + field.component
        : field.component
    }
  },
  computed: {
    values() {
      return _.get(this, 'field.value', [])
    },
    headings() {
      return _.get(this, 'field.headings', [])
    }
  }
}
</script>
