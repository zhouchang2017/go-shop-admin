<template>
  <div class="flex">
    <div
      class="w-24 h-24 relative hover-trigger rounded overflow-hidden mr-2"
      v-for="(image, index) in images"
      :key="index"
    >
      <el-image
        fit="cover"
        class="h-full"
        :src="resolveImageUrl(image)"
        lazy
      ></el-image>
      <div
        class="absolute hover-target w-full h-full top-0 hover-target__actions"
      >
        <div class="flex h-full items-center justify-center text-30">
          <div
            @click="handlePictureCardPreview(image)"
            class="flex1 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <IIcon class="h-6 w-6" type="i-zoom" />
          </div>
          <div
            @click="handleDownload(image)"
            class="flex1 ml-3 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <IIcon class="h-6 w-6" type="i-download" />
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <el-image fit="cover" width="100%" :src="dialogImageUrl" lazy></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageList',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = `${this.$qiniuUrl}/${file.key}`
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
      let link = document.createElement('a')
      link.href = file.url
      link.style = 'display: none'
      link.download = file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(file.url)
    },
    resolveImageUrl(image) {
      return `${this.$qiniuUrl}/${image.key}`
    }
  },
  computed: {
    $qiniuUrl() {
      return process.env.VUE_APP_QINIU_DOMAIN
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
