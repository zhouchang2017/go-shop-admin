<template>
  <filter-box-item :name="filter.name">
    <el-date-picker
      value-format="yyyy-MM-dd HH:mm:ss"
      v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
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
