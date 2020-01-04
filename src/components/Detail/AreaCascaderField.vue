<template>
  <panel-item :field="field">
    <template slot="value">
      <p v-if="field.value" class="text-90">{{ value }}</p>
      <p v-else>-</p>
    </template>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  computed: {
    value() {
      return Object.values(_.get(this, 'field.value', {})).join('/')
    }
  }
}
</script>
