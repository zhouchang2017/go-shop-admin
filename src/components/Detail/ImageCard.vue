<template>
  <div>
    <div
      class="w-24 h-24 relative hover-trigger rounded overflow-hidden mr-2 mb-2"
    >
      <el-image fit="cover" class="h-full" :src="value.url" lazy></el-image>
      <div
        class="absolute hover-target w-full h-full top-0 hover-target__actions"
      >
        <div class="flex h-full items-center justify-center text-30">
          <div
            v-if="shouldShowPreview"
            @click="dialogVisible = true"
            class="flex1 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <icons-icon class="h-6 w-6" type="icons-zoom" />
          </div>
          <div
            v-if="shouldShowDownload"
            @click.prevent="handleDownload"
            class="flex1 ml-3 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <icons-icon class="h-6 w-6" type="icons-download" />
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" v-if="shouldShowPreview">
      <el-image fit="cover" width="100%" :src="value.url" lazy></el-image>
    </el-dialog>
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
    }
  },
  data: () => ({
    dialogVisible: false
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
    }
  },
  computed: {
    shouldShowPreview() {
      return this.value.url === '' ? false : this.showPreview
    },

    shouldShowDownload() {
      return this.value.url === '' ? false : this.showDownload
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
