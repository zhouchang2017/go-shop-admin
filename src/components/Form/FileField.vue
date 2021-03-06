<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
    <div class="flex flex-wrap">
      <draggable v-model="images" class="flex flex-wrap">
        <div
          class="w-24 h-24 relative  hover-trigger rounded overflow-hidden mr-2 mb-2"
          v-for="file in images"
          :key="file.uid"
        >
          <el-image
            fit="cover"
            class="h-full w-full"
            :src="remoteUrl(file.url)"
            lazy
          >
            <div
              slot="placeholder"
              class="flex items-center justify-center h-full w-full"
            >
              <icons-loader class="text-gray-500" />
            </div>
          </el-image>
          <div
            class="absolute hover-target w-full h-full top-0 hover-target__actions"
          >
            <div class="flex h-full items-center justify-center text-30">
              <div
                @click="handlePictureCardPreview(file)"
                class="flex1 mr-2 appearance-none cursor-pointer text-gray-300 hover:text-white"
              >
                <icons-icon
                  class="h-6 w-6"
                  viewBox="0 2 24 24"
                  type="icons-zoom"
                />
              </div>

              <div
                class="flex1 appearance-none cursor-pointer text-gray-300 hover:text-white"
              >
                <el-popconfirm
                  title="确定删除吗？"
                  @onConfirm="handleRemove(file)"
                >
                  <icons-icon
                    slot="reference"
                    class="h-6 w-6"
                    type="icons-delete"
                  />
                </el-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </draggable>
      <el-upload
        :id="field.attribute"
        ref="elUpload"
        :disabled="disabled"
        :multiple="multiple"
        :drag="drag"
        :list-type="listType"
        :on-preview="handlePreview"
        :on-success="onSuccessHandle"
        :on-progress="onProgress"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :before-upload="onBeforeUploadHandle"
        :data="{ token: field.token }"
        :on-error="onErrorHandle"
        :on-exceed="onExceed"
        :file-list="images"
        :limit="limit"
        action=""
        :http-request="uploadFile"
        v-bind="$attrs"
        :show-file-list="!!listType"
        class="flex"
      >
        <!-- drag -->
        <div v-if="drag">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div>

        <!-- listType === 'text' -->
        <button
          v-if="!drag && listType === 'text'"
          type="button"
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded inline-flex items-center"
          slot="default"
        >
          <div class="flex items-center">
            <icons-icon type="icons-upload" class="w-4 h-4 mr-2" />
            <span class="font-bold">{{ `选择需要上传的${field.name}` }}</span>
          </div>
        </button>
        <!-- listType=picture-card -->
        <div
          class="w-24 h-24 rounded overflow-hidden flex items-center justify-center border text-gray-500 hover:text-blue-500 hover:border-blue-500"
          v-if="!drag && listType === null"
        >
          <i slot="default" class="flex h-full justify-center items-center ">
            <svg
              class="block"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </i>
        </div>
      </el-upload>
    </div>
    <div class="text-gray-500 text-xs">
      {{ tips }}
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <el-image fit="cover" width="100%" :src="dialogImageUrl" lazy></el-image>
    </el-dialog>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
import * as qiniu from 'qiniu-js'

export default {
  mixins: [FormField, HandlesValidationErrors],
  inheritAttrs: false,
  components: {
    draggable: () => import('vuedraggable')
  },

  data: () => ({
    value: [],
    dialogImageUrl: '',
    dialogVisible: false,
    images: []
  }),

  methods: {
    // 初始化
    setInitialValue() {
      // 仅为一个字符串，则视为外链
      if (_.isString(this.field.value)) {
        this.images = [this.resolverStringValue(this.field.value)]
        return
      }
      if (_.isArray(this.field.value)) {
        this.images = this.field.value.map(item =>
          _.isString(item)
            ? this.resolverStringValue(item)
            : this.resolverValue(item)
        )
        return
      }
      if (_.isObject(this.field.value)) {
        this.images = [this.resolverValue(this.field.value)]
      }
      this.images = []
    },
    /**
     * Provide a function that fills a passed FormData object with the
     * field's internal value attribute
     */
    fill(formData) {
      _.set(
        formData,
        this.field.attribute,
        this.limit > 1 ? this.resourceValues : this.resourceValues[0]
      )
    },

    resolverValue(value) {
      return { url: value }
    },

    resolverStringValue(value) {
      return { url: value }
    },
    handlePreview(file) {
      console.log(file)
    },
    // 删除列表文件
    handleRemove(file) {
      let index = this.uploadFiles.findIndex(item => item.uid === file.uid)
      this.uploadFiles.splice(index, 1)

      index = this.images.findIndex(item => item.url === file.url)
      this.images.splice(index, 1)
    },
    // 前置删除钩子
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.remoteUrl(file.url)
      this.dialogVisible = true
    },
    // 超出数量限制提示
    onExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    // 异常处理
    onErrorHandle(err, file, fileList) {
      // 401 token 过期
      console.log(err)
      console.log(file)
      console.log(fileList)
      this.$message.error('token过期，请刷新本页')
    },
    // 上传前置钩子
    onBeforeUploadHandle(file) {
      const allowType = this.validateFileType(file)
      const allowSize = this.validateFileSize(file)

      if (!allowType) {
        this.$message.error(`上传文件类型必须为${this.accept}`)
      }
      if (!allowSize) {
        this.$message.error(
          `上传文件最大体积不允许超出${this.maxSize / 1024 / 1024}MB`
        )
      }
      return allowType && allowSize
    },
    // 验证文件类型
    validateFileType(file) {
      if (this.accept) {
        return this.accept.split(',').some(reg => {
          return new RegExp(reg).test(file.type)
        })
      }
      return true
    },
    // 验证文件大小
    validateFileSize(file) {
      if (this.maxSize) {
        return file.size < this.maxSize
      }
      return true
    },
    // 上传成功回调函数
    onSuccessHandle(response, file) {
      setTimeout(() => {
        const { key } = response
        file.url = key
        this.images.push({
          ...response,
          url: file.url,
          status: file.status,
          uid: file.uid
        })
      }, 500)
    },
    //
    onProgress(event, file, fileList) {
      if (event.total) {
        this.$set(file, 'percent', event.total.percent)
      }
    },
    remoteUrl(key) {
      key = key.replace(this.appConfig.qiniu_cdn_domain, '')
      return `${this.appConfig.qiniu_cdn_domain}/${key}`
    },
    uploadFile(option) {
      const fileName = this.changeFileName(option.file.name)

      const observable = qiniu.upload(
        option.file,
        fileName,
        this.field.token,
        this.qnPutextra,
        this.qnConfig
      )
      observable.subscribe({
        next: option.onProgress,
        error: option.onError,
        complete: option.onSuccess
      })
    },
    // 修改原文件名，给文件名添加一个时间戳
    changeFileName(filename) {
      return filename.replace(/.[a-zA-Z0-9]+$/, match => {
        return `-${Date.now()}${match}`
      })
    }
  },

  computed: {
    qnConfig() {
      return {
        useCdnDomain: true,
        disableStatisticsReport: false,
        retryCount: 6,
        region: qiniu.region.z2
      }
    },
    qnPutextra() {
      return {
        fname: '',
        params: {},
        mimeType: null
      }
    },
    // 上传类型
    type() {
      return _.get(this, 'field.type', 'file')
    },
    // 列表显示类型
    listType() {
      let type = _.get(this, 'field.list_type', 'text')
      if (type === 'picture-card') {
        return null
      }
      return type
    },
    // 允许最大上传文件体积
    maxSize() {
      return _.get(this, 'field.limit_max_size')
    },
    // 最大允许上传个数
    limit() {
      return _.get(this, 'field.limit')
    },
    // 是否disable
    disabled() {
      if (this.field.readonly) {
        return true
      }
      return _.get(this, 'value.length', 0) >= this.limit
    },
    // 是否允许多选
    multiple() {
      return _.get(this, 'field.multiple', false)
    },
    // 限定类型
    accept() {
      return _.get(this, 'field.accept')
    },
    // 提示文字
    tips() {
      let str = [`最多上传${this.limit}个文件`]
      if (this.accept) {
        str.push(`只能上传${this.accept}类型文件`)
      }
      if (this.maxSize) {
        str.push(`文件大小不能超过${this.maxSize / 1024 / 1024}mb`)
      }
      return str.join(',')
    },

    drag() {
      return _.get(this, 'field.drag', false)
    },

    uploadFiles() {
      return _.get(this.$refs, 'elUpload.uploadFiles', [])
    },

    shouldShowPreview() {
      return _.get(this, 'field.should_show_preview', false)
    },

    shouldShowDownload() {
      return _.get(this, 'field.should_show_download', false)
    },

    resourceValues() {
      if (_.get(this, 'field.type') === 'image') {
        return this.images.map(item => item.url)
      }
      return this.images
    }
  }
}
</script>
