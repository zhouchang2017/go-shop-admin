<template>
  <div>
    <el-upload
      ref="elUpload"
      list-type="picture-card"
      :on-success="onSuccessHandle"
      :before-upload="onBeforeUploadHandle"
      :data="qn"
      :on-error="onErrorHandle"
      :file-list="images"
      v-bind="$props"
    >
      <i
        slot="default"
        class="flex h-full justify-center items-center hover:text-indigo-500"
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
      <!-- <i slot="default" class="el-icon-plus"></i> -->
      <div class="w-full h-full" slot="file" slot-scope="{ file }">
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
            @click="handlePictureCardPreview(file)"
            class="flex1 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <IIcon class="h-6 w-6" type="i-zoom" />
          </div>
          <div
            @click="handleDownload(file)"
            class="flex1 ml-3 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <IIcon class="h-6 w-6" type="i-download" />
          </div>
          <div
            @click="handleRemove(file)"
            class="flex1 ml-3 appearance-none cursor-pointer text-gray-500 hover:text-white"
          >
            <IIcon class="h-6 w-6" viewBox="0 0 24 20" type="i-delete" />
          </div>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <el-image fit="cover" width="100%" :src="dialogImageUrl" lazy></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { Upload } from 'element-ui'
import { getQiniuToken } from '@/api/app'
// eslint-disable-next-line no-unused-vars
let { fileList, ...props } = Upload.props
export default {
  name: 'ImageUpload',
  props: {
    ...props,
    action: {
      type: String,
      default: process.env.VUE_APP_QINIU_UPLOAD_URL
    },
    value: {}
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      qn: {
        token: ''
        // key: ''
      },
      // 已存在图片
      images: []
    }
  },

  methods: {
    handleRemove(file) {
      let index = this.uploadFiles.findIndex(item => item.uid === file.uid)
      this.uploadFiles.splice(index, 1)
      this.onUploadFilesChange()
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
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
    async setToken() {
      let data = await getQiniuToken()
      if (data.status === 200) {
        this.qn.token = data.data.token
      }
    },
    onErrorHandle(err, file, fileList) {
      // 401 token 过期
      console.log(err)
      console.log(file)
      console.log(fileList)
    },
    onBeforeUploadHandle(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt10M) {
        error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    onSuccessHandle(response, file) {
      _.each(response, (value, key) => {
        if (key !== 'url') {
          file[key] = value
        }
      })
      this.onUploadFilesChange()
    },
    onUploadFilesChange() {
      // key bucket drive
      let values = this.uploadFiles.map(item => {
        let obj = { key: item.key }
        if (_.has(item, 'bucket')) {
          obj.bucket = item.bucket
        }
        if (_.has(item, 'drive')) {
          obj.drive = item.drive
        }
        return obj
      })

      this.$emit(
        'input',
        _.isArray(this.value) || _.isNull(this.value) ? values : values[0]
      )
    },

    itemTransfar(item) {
      if (!_.has(item, 'key')) {
        return new Error('图片列表元素项必须包含key字段')
      }
      let cloneItem = _.cloneDeep(item)
      if (!_.has(item, 'url') && _.has(item, 'key')) {
        cloneItem.url = `${this.$qiniuUrl}/${item.key}`
      }
      if (!_.has(item, 'name')) {
        cloneItem.name = item.key
      }
      return cloneItem
    },
    valueInit() {
      if (_.isArray(this.value)) {
        this.images = this.value.map(item => this.itemTransfar(item))
        return
      }
      if (_.isObject(this.value)) {
        this.images.push(this.itemTransfar(this.value))
        return
      }
    }
  },
  computed: {
    uploadFiles() {
      return _.get(this.$refs, 'elUpload.uploadFiles', [])
    },
    $qiniuUrl() {
      return process.env.VUE_APP_QINIU_DOMAIN
    }
  },
  async mounted() {
    this.valueInit()
    await this.setToken()
  }
}
</script>
