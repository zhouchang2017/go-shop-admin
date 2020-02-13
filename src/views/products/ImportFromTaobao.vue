<template>
  <div>
    <el-dialog
      title="从淘宝抓取"
      :visible.sync="fetchTaobaoDialog"
      class="overflow-y-auto"
      width="80%"
    >
      <div
        v-loading="loading"
        class="overflow-y-scroll"
        :style="{ maxHeight: autoHeight + 'px' }"
      >
        <el-input id="taobaoUrl" v-model="taobaoUrl">
          <template slot="prepend">淘宝链接</template>
          <el-button
            slot="append"
            @click="fetchTaobaoDetail"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-form
          v-if="loaded"
          class="mt-6"
          ref="taobaoProductForm"
          :model="resource"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="resource.name"></el-input>
          </el-form-item>

          <el-form-item label="图集" prop="images">
            <draggable v-model="resource.images" class="flex flex-wrap">
              <div
                class="w-24 h-24 relative  hover-trigger rounded overflow-hidden mr-2 mb-2"
                v-for="(image, index) in resource.images"
                :key="index"
              >
                <el-image
                  fit="cover"
                  class="h-full"
                  :src="resolveUrl(image)"
                  lazy
                ></el-image>
                <div
                  class="absolute hover-target w-full h-full top-0 hover-target__actions"
                >
                  <div class="flex h-full items-center justify-center text-30">
                    <div
                      @click="handleDelete(index)"
                      class="flex1 appearance-none cursor-pointer text-gray-300 hover:text-white"
                    >
                      <icons-icon class="h-6 w-6" type="icons-delete" />
                    </div>
                  </div>
                </div>
              </div>
            </draggable>
          </el-form-item>
          <el-form-item label="吊牌价" prop="price">
            <el-input
              v-model.number="resource.price"
              placeholder="请输入填充价格"
            />
          </el-form-item>

          <product-attributes v-model="resource.attributes" />

          <el-form-item label="详情" prop="description">
            <quill-editor
              v-model="resource.description"
              :action="appConfig.qiniu_upload_action"
              :token="token"
            >
            </quill-editor>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fetchTaobaoDialog = false">取消</el-button>
        <el-button :loading="toQiniu" type="primary" @click="fill"
          >填充</el-button
        >
      </span>
    </el-dialog>
    <slot>
      <div
        class="text-gray-500 text-sm cursor-pointer"
        @click="fetchTaobaoDialog = true"
      >
        从淘宝抓取
      </div>
    </slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
    'product-attributes': () => import('./ProductAttributes'),
    'quill-editor': () => import('@/3rd-components/Quill'),
    draggable: () => import('vuedraggable')
  },
  props: {
    pk: {
      type: String,
      default: 'id'
    },
    token: String
  },
  data() {
    return {
      fetchTaobaoDialog: false,
      taobaoUrl: '',
      loading: false,
      resource: {
        name: '',
        code: '',
        brand: {},
        category: {},
        options: [],
        selectionOptions: [], // 双向绑定辅助
        items: [],
        description: '',
        price: 0,
        attributes: [],
        images: [],
        on_sale: true, // 是否可售
        fake_sales_qty: 0, // 虚拟销量
        sort: 0 // 权重
      },
      response: {
        options: [],
        selectionOptions: []
      },
      loaded: false,
      toQiniu: false,
      id: null
    }
  },
  methods: {
    paserUrl(urlStr) {
      if (urlStr === '') {
        this.$message.error('缺少url参数')
        return null
      }
      var url = decodeURI(urlStr)
      var res = {}
      var url_data = _.split(url, '?').length > 1 ? _.split(url, '?')[1] : null
      if (!url_data) return null
      var params_arr = _.split(url_data, '&')
      _.forEach(params_arr, function(item) {
        var key = _.split(item, '=')[0]
        var value = _.split(item, '=')[1]
        res[key] = value
      })
      return res
    },
    // 从淘宝抓取商品详情
    async fetchTaobaoDetail() {
      // 处理url
      let params = this.paserUrl(this.taobaoUrl)
      if (params) {
        if (_.has(params, 'id')) {
          try {
            this.loading = true
            this.loaded = false
            this.id = params.id
            let res = await axios.get(`/taobao/products/${params.id}`)
            this.$set(this, 'response', res.data)
            this.loaded = true
            this.resource.name = res.data.name
            this.resource.price = res.data.price
            this.resource.attributes = res.data.attributes

            // this.resource.options.
            if (_.get(res, 'data.Meta.images', []).length > 0) {
              this.resource.images = res.data.Meta.images
            }
            if (res.data.description.length > 0) {
              this.resource.description = res.data.description
            }
            this.loading = false
          } catch (error) {
            let message = _.get(error, 'response.data.message')
            if (message !== '') {
              this.$message.error(message)
            } else {
              console.error(error)
            }
            this.loading = false
          }
        } else {
          this.$message.error('url有误')
        }
      }
    },
    // 第三方url转码
    async paser3rdUrl() {
      this.toQiniu = true
      try {
        let res = await axios.post(`/taobao/products/parse-url`, {
          id: this.id,
          images: this.resource.images,
          description: this.resource.description
        })
        this.toQiniu = false
        this.resource.images = res.data.images
        this.resource.description = res.data.description
      } catch (error) {
        this.$message.error('转码错误')
        this.toQiniu = false
      }
    },
    handleDelete(index) {
      this.resource.images.splice(index, 1)
    },
    async fill() {
      try {
        await this.paser3rdUrl()
        this.$emit('fill', this.resource)
        let element = '<div><div class="mb-3">参考销售属性</div>'
        this.response.options.forEach(option => {
          element += `<div class="text-gray-700 font-bold">${option.name}</div>`
          if (_.has(option, 'values')) {
            element += `<div class="ml-3 text-xs text-gray-500 flex flex-row flex-wrap">`
            option.values.forEach(value => {
              element += `<div class="rounded bg-gray-200 mr-2 px-2 py-1 my-1">${value.value}</div>`
            })
            element += `</div>`
          }
        })
        element += '</div>'
        this.$notify({
          title: '填充成功',
          duration: 0,
          dangerouslyUseHTMLString: true,
          message: element
        })
        this.fetchTaobaoDialog = false
      } catch (error) {
        this.$message.error('填充错误')
      }
    },
    resolveUrl(file) {
      if (_.isString(file)) {
        return file
      }
      if (_.has(file, 'url')) {
        return file.url
      }
      if (_.has(file, 'domain') && _.has(file, 'key')) {
        return `${file.domain}/${file.key}`
      }
      return file
    }
  },
  computed: {
    ...mapGetters(['appConfig']),
    autoHeight() {
      if (!this.loaded) {
        return 150
      }
      return window.innerHeight - 200
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
