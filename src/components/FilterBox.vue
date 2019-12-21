<template>
  <Dropdown v-show="hasSlots" placement="r" class="w-full">
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
  components: {
    Dropdown: () => import('@/components/Dropdown')
  },
  computed: {
    hasSlots() {
      return !_.isEmpty(this.$slots)
    }
  }
}
</script>

<style></style>
