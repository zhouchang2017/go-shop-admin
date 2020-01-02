<template>
  <dropdown placement="r" class="w-full" :z-index="zIndex" v-show="hasItem">
    <div slot="trigger" class="hover:text-blue-500">
      <el-badge :value="currentCount" v-show="hasCount">
        <icons-icon type="icons-filter" />
      </el-badge>
      <icons-icon type="icons-filter" v-show="!hasCount" />
    </div>

    <div
      style="width:380px"
      class="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <slot />
    </div>
  </dropdown>
</template>

<script>
export default {
  props: ['z-index', 'count'],

  computed: {
    hasItem() {
      return _.get(this, '$slots.default', []).length > 0
    },
    hasCount() {
      return this.currentCount > 0
    },
    currentCount() {
      return _.get(this, 'count', 0)
    }
  }
}
</script>

<style></style>
