<template>
  <panel-item :field="field" />
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  components: {
    'panel-item': () => import('@/components/PanelItem')
  }
}
</script>
