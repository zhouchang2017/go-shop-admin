<template>
  <panel-item :field="field">
    <div slot="value">
      <div v-for="(k, index) in field.value" :key="index">
        {{ getValue(k) }}
      </div>
    </div>
  </panel-item>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  methods: {
    getValue(key) {
      return _.find(this.options, ['value', key]).label
    }
  },
  computed: {
    options() {
      return _.get(this, 'field.options', [])
    }
  }
}
</script>
