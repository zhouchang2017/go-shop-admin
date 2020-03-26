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
          label-position="left"
          label-width="50px"
        >
          <el-form-item label="名称" prop="name" class="full">
            <el-input v-model="resource.name"></el-input>
          </el-form-item>

          <el-form-item label="图集" prop="images" class="full">
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
            <form-currency
              v-model.number="resource.price"
              placeholder="请输入填充价格"
            />
          </el-form-item>

          <el-form-item label="基本属性" prop="attributes" class="full">
            <product-attributes v-model="resource.attributes" />
          </el-form-item>

          <el-form-item label="销售属性" prop="options" class="full">
            <sku-options v-model="resource.options" :token="token" />
          </el-form-item>

          <el-form-item label="销售规格" prop="items" class="full">
            <sku-table
              :onFetchOptions="fetchAvailableOptionNames"
              @on-change-data="handleChangeData"
              :data="resource.options"
              :items="items"
            />
          </el-form-item>

          <el-form-item label="详情" prop="description" class="full">
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
import { SKUOptions, SKUTable } from '@/3rd-components/sku'

export default {
  components: {
    'product-attributes': () => import('./ProductAttributes'),
    'quill-editor': () => import('@/3rd-components/Quill'),
    draggable: () => import('vuedraggable'),
    'sku-options': SKUOptions,
    'sku-table': SKUTable
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
      id: null,
      items: []
    }
  },
  methods: {
    fetchAvailableOptionNames() {
      return new Promise(async resolve => {
        try {
          let { data } = await axios.get('/creation-info/products/options')
          resolve(data)
        } catch (error) {
          console.error(error)
          resolve([])
        }
      })
    },
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
            this.resource.name = _.get(res, 'data.name', '')
            this.resource.price = _.get(res, 'data.price', 1)
            this.resource.images = _.get(res, 'data.images', [])
            this.resource.attributes = _.get(res, 'data.attributes', [])
            this.resource.options = _.get(res, 'data.options', [])
            this.items = _.get(res, 'data.items', [])
            // this.resource.options.
            if (res.data.description.length !== '') {
              this.resource.description = res.data.description
            }
            this.loading = false
          } catch (error) {
            this.loaded = true
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
          description: this.resource.description,
          option_values: this.optionValues
        })
        this.toQiniu = false
        this.resource.images = res.data.images
        this.resource.description = res.data.description
        let optionValueMap = {}
        _.get(res, 'data.option_values', []).forEach(value => {
          if (value.image && value.image != '') {
            optionValueMap[value.id] = value.image
          }
        })
        this.resource.options.forEach(option => {
          _.get(option, 'values', []).forEach(value => {
            if (optionValueMap[value.id]) {
              value.image = optionValueMap[value.id]
            }
          })
        })
        // this.data
      } catch (error) {
        this.$message.error('转码错误')
        this.toQiniu = false
      }
    },
    handleChangeData(data) {
      if (data.length === 0) return
      this.resource.items = data
    },
    handleDelete(index) {
      this.resource.images.splice(index, 1)
    },
    async fill() {
      try {
        await this.paser3rdUrl()
        this.$emit('fill', this.resource)

        this.$notify({
          title: '填充成功',
          duration: 2000
        })
        this.fetchTaobaoDialog = false
      } catch (error) {
        this.$message.error('填充失败')
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
    },
    optionValues() {
      return _.get(this, 'resource.options', []).reduce((res, option) => {
        res.push(..._.get(option, 'values', []).filter(value => value.image))
        return res
      }, [])
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
