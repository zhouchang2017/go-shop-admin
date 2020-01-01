<template>
  <filter-box-item :name="filter.name">
    <el-select
      :multiple="multiple"
      clearable
      :value="filter.value"
      class="w-full"
      @change="handleChange"
    >
      <el-option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :label="option.label"
      >
        {{ option.label }}
      </el-option>
    </el-select>
  </filter-box-item>
</template>

<script>
import FilterField from '@/mixins/FilterField'
export default {
  mixins: [FilterField],

  computed: {
    multiple() {
      return _.get(this, 'filter.multiple')
    }
  }
}
</script>
