<template>
  <Dropdown placement="r" class="w-full" :z-index="zIndex" v-show="hasItem">
    <div slot="trigger" class="hover:text-blue-500">
      <IIcon type="i-filter" />
    </div>
    <div
      style="width:380px"
      class="bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <slot />
    </div>
  </Dropdown>
</template>

<script>
export default {
  props: ['z-index'],
  components: {
    Dropdown: () => import('@/components/Dropdown')
  },
  computed: {
    hasItem() {
      return _.get(this, '$slots.default', []).length > 0
    }
  }
}
</script>

<style></style>
