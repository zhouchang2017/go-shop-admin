<template>
  <div class="flex flex-wrap">
    <draggable v-model="images" class="flex">
      <div
        class="w-24 h-24 relative  hover-trigger rounded overflow-hidden mr-2 mb-2"
        v-for="file in images"
        :key="file.uid"
      >
        <el-image
          fit="cover"
          class="h-full w-full"
          :src="file.url"
          lazy
        ></el-image>
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
      ref="elUpload"
      class="w-24 h-24 rounded overflow-hidden flex items-center justify-center border"
      :on-success="onSuccessHandle"
      :before-upload="onBeforeUploadHandle"
      :data="{ token: token }"
      :show-file-list="false"
      :on-error="onErrorHandle"
      :file-list="images"
      :action="appConfig.qiniu_upload_action"
      multiple
    >
      <div class="w-24 h-24 rounded">
        <i
          slot="default"
          class="flex h-full justify-center items-center text-gray-500 hover:text-blue-500"
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
import { mapGetters } from 'vuex'

// eslint-disable-next-line no-unused-vars
export default {
  name: 'ImageUpload',
  components: {
    draggable: () => import('vuedraggable')
  },
  props: {
    token: String,
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
      // 已存在图片
      images: []
    }
  },

  watch: {
    images(value, oldValue) {
      this.onUploadFilesChange()
    }
  },

  methods: {
    handleRemove(file) {
      let index = this.images.findIndex(item => item.uid === file.uid)
      this.images.splice(index, 1)
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
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    onSuccessHandle(response, file) {
      setTimeout(() => {
        const { domain, key } = response
        file.url = `${domain}/${key}`

        this.images.push({
          ...response,
          url: `${domain}/${key}`,
          status: file.status,
          uid: file.uid
        })
      }, 500)
    },
    onUploadFilesChange() {
      this.$emit(
        'input',
        _.isArray(this.value) || _.isNull(this.value)
          ? this.images
          : this.images[0]
      )
    },
    resolverValue(value) {
      return {
        url: `${_.get(value, 'domain')}/${_.get(value, 'key')}`,
        ...value
      }
    },
    valueInit(value = null) {
      if (!value) {
        value = this.value
      }
      // 仅为一个字符串，则视为外链
      if (_.isString(value)) {
        this.images = [this.resolverStringValue(value)]
        return
      }
      if (_.isArray(value)) {
        this.images = value.map(item =>
          _.isString(item)
            ? this.resolverStringValue(item)
            : this.resolverValue(item)
        )
        return
      }
      if (_.isObject(value)) {
        this.images = [this.resolverValue(value)]
      }
    },
    fill(value) {
      this.valueInit(value)
    },
    resolverStringValue(value) {
      return { url: value }
    }
  },
  computed: {
    ...mapGetters(['appConfig'])
  },
  async mounted() {
    this.valueInit()
  }
}
</script>
