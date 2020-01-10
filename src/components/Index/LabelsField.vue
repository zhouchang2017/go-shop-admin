<template>
  <div class="flex flex-row flex-wrap" v-if="shouldShowValues">
    <div v-for="(value, index) in values" :key="index">
      <el-tooltip
        v-if="tooltip"
        class="item"
        effect="dark"
        :content="value[tooltip]"
        placement="top"
      >
        <code
          class="inline-block bg-gray-100 whitespace-no-wrap text-gray-700 px-1 bg-30 hover:bg-white hover:font-bold hover:text-primary rounded mr-3 text-xs"
          >{{ value[label] }}</code
        >
      </el-tooltip>
      <code
        v-else
        class="inline-block bg-gray-100 whitespace-no-wrap text-gray-700 px-1 bg-30 hover:bg-white hover:font-bold hover:text-primary rounded mr-3 text-xs"
        >{{ value[label] }}</code
      >
    </div>
  </div>
  <div v-else>-</div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],
  computed: {
    shouldShowValues() {
      return this.values.length > 0
    },
    values() {
      return _.get(this, 'field.value', [])
    },
    label() {
      return _.get(this, 'field.meta.label', 'value')
    },
    tooltip() {
      return _.get(this, 'field.meta.tooltip')
    }
  }
}
</script>
