<template>
  <panel-item :field="field">
    <template slot="value">
      <p v-if="field.value" class="text-90">{{ field.value | timeStr }}</p>
      <p v-else>-</p>
    </template>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  components: {
    'panel-item': () => import('@/components/PanelItem')
  },
  computed: {
    /**
     * Get the localized date time.
     */
    localizedDateTime() {
      return this.localizeDateTimeField(this.field)
    }
  }
}
</script>
