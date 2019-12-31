<template>
  <div class="whitespace-no-wrap">{{ value }}</div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],
  computed: {
    value() {
      return Object.values(_.get(this, 'field.value', {})).join('/')
    }
  }
}
</script>
