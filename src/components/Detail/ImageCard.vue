<template>
  <div
    class="w-24 h-24 relative hover-trigger rounded overflow-hidden mr-2 mb-2"
  >
    <el-image
      fit="cover"
      class="h-full w-full"
      :src="value.url"
      lazy
      @error="loadImageError"
      @load="loadImageSuccess"
      v-bind="elImageProps"
    ></el-image>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    showPreview: {
      type: Boolean,
      default: true
    },
    showDownload: {
      type: Boolean,
      default: true
    },
    previewList: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    dialogVisible: false,
    loaded: false,
    loadErr: false
  }),
  methods: {
    handlePictureCardPreview() {
      this.dialogVisible = true
    },
    handleDownload() {
      let link = document.createElement('a')
      link.href = this.value.url
      link.download = this.value.name || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    loadImageError() {
      this.loadErr = true
    },
    loadImageSuccess() {
      this.loaded = true
    }
  },
  computed: {
    shouldShowPreview() {
      return this.value.url === '' ? false : this.showPreview
    },

    shouldShowDownload() {
      return this.value.url === '' ? false : this.showDownload
    },

    shouldShowIcons() {
      return this.loaded && !this.loadErr
    },

    elImageProps() {
      let props = {}
      if (this.showPreview && this.previewList.length > 0) {
        props.previewSrcList = this.previewList
      }
      return props
    }
  }
}
</script>

<style>
.hover-target__actions {
  opacity: 0;
  transition: opacity 0.3s;
  background-color: rgba(0, 0, 0, 0.3);
}
.hover-target__actions:hover {
  opacity: 1;
}
</style>
