<template>
  <el-image
    v-if="shouldShowImage"
    :class="warpClass"
    class="h-12 w-12"
    fit="cover"
    width="100%"
    :src="value"
    lazy
  ></el-image>
  <div v-else>{{ fileName }}</div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],
  computed: {
    shouldShowImage() {
      return this.type === 'image' && this.value !== ''
    },
    // 上传类型
    type() {
      return _.get(this, 'field.type', 'file')
    },

    warpClass() {
      if (this.field.round) {
        return [this.field.round]
      }
      return []
    },

    value() {
      // 仅为一个字符串，则视为外链
      if (_.isString(this.field.value)) {
        return this.field.value
      }
      if (_.isArray(this.field.value) && this.field.length > 0) {
        return _.isString(this.field.value[0])
          ? _.get(this, 'field.value.0')
          : _.get(this, 'field.value.0.url')
      }
      return ''
    },

    fileName() {
      return _.get(this, 'field.value.name', '-')
    }
  }
}
</script>
