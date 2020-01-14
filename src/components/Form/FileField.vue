<template>
  <el-form-item :required="isRequired" :error="firstError" :label="field.name">
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
      :file-list="value"
      :limit="limit"
      :action="field.action"
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
      <i
        v-if="!drag && listType === 'picture-card'"
        slot="default"
        class="flex h-full justify-center items-center hover:text-blue-500"
      >
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

      <div class="el-upload__tip" slot="tip">
        {{ tips }}
      </div>

      <div
        v-if="listType === 'picture-card'"
        class="w-full h-full"
        slot="file"
        slot-scope="{ file }"
      >
        <el-image
          fit="cover"
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          lazy
        ></el-image>
        <span
          class="el-upload-list__item-actions flex flex-row items-center justify-center w-full text-10"
        >
          <div
            v-if="shouldShowPreview"
            @click="handlePictureCardPreview(file)"
            class="flex1 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <icons-icon class="h-6 w-6" type="icons-zoom" />
          </div>

          <div
            @click="handleRemove(file)"
            class="flex1 ml-3 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <icons-icon
              class="h-6 w-6"
              viewBox="0 0 24 20"
              type="icons-delete"
            />
          </div>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <el-image fit="cover" width="100%" :src="dialogImageUrl" lazy></el-image>
    </el-dialog>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
export default {
  mixins: [FormField, HandlesValidationErrors],

  data: () => ({
    value: [],
    dialogImageUrl: '',
    dialogVisible: false
  }),

  methods: {
    // 初始化
    setInitialValue() {
      // 仅为一个字符串，则视为外链
      if (_.isString(this.field.value)) {
        this.value = [this.resolverStringValue(this.field.value)]
        return
      }
      if (_.isArray(this.field.value)) {
        this.value = this.field.value.map(item =>
          _.isString(item) ? this.resolverStringValue(item) : item
        )
        return
      }
      this.value = []
    },
    /**
     * Provide a function that fills a passed FormData object with the
     * field's internal value attribute
     */
    fill(formData) {
      _.set(
        formData,
        this.field.attribute,
        this.limit > 1 ? this.value : this.value[0]
      )
    },

    resolverValue(value) {},

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

      index = this.value.findIndex(item => item.url === file.url)
      this.value.splice(index, 1)
    },
    // 前置删除钩子
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
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
        console.log(file)
        const { domain, key } = response
        file.url = `${domain}/${key}`
        this.value.push({
          ...response,
          url: `${domain}/${key}`,
          status: file.status,
          uid: file.uid
        })
      }, 500)
    },
    //
    onProgress(event, file, fileList) {}
  },

  computed: {
    // 上传类型
    type() {
      return _.get(this, 'field.type', 'file')
    },
    // 列表显示类型
    listType() {
      return _.get(this, 'field.list_type', 'text')
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
    }
  }
}
</script>