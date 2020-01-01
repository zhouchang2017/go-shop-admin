<template>
  <filter-box-item :name="filter.name">
    <el-checkbox-group v-model="value">
      <el-checkbox
        v-for="option in options"
        :key="option.value"
        :label="option.value"
        >{{ option.label }}</el-checkbox
      >
    </el-checkbox-group>
  </filter-box-item>
</template>

<script>
import FilterField from '@/mixins/FilterField'

export default {
  mixins: [FilterField],
  data() {
    return {
      checked: []
    }
  },
  computed: {
    value: {
      get() {
        return this.filter.value
      },
      set(value) {
        this.$store.commit(`${this.resourceName}/updateFilterState`, {
          key: this.filterKey,
          value: value
        })
        this.$emit('change', value)
      }
    }
  }
}
</script>
