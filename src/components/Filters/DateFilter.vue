<template>
  <filter-box-item :name="filter.name">
    <el-date-picker
      v-model="value"
      value-format="yyyy-MM-dd HH:mm:ss"
      type="date"
      :placeholder="filter.name"
    >
    </el-date-picker>
  </filter-box-item>
</template>

<script>
import FilterField from '@/mixins/FilterField'

export default {
  mixins: [FilterField],
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
