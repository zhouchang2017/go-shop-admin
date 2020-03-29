<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <div class="card overflow-hidden mb-6 shadow-none">
      <div class="card-head">
        <div class="card-head__title">
          基本
        </div>
        <import-from-taobao
          v-if="creating"
          class="ml-auto"
          @fill="fillFromTaobao"
          :token="token"
        />
      </div>
      <div class="w-full p-6">
        <el-form-item v-if="updating" label="ID" prop="id">
          <el-input v-model="resource.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="resource.name"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input
            :disabled="updating"
            v-model.trim="resource.code"
          ></el-input>
        </el-form-item>

        <el-form-item label="品牌" prop="brand">
          <el-select
            v-model="resource.brand"
            filterable
            reserve-keyword
            :value-key="pk"
            placeholder="请选择品牌名称"
          >
            <el-option
              v-for="item in brands"
              :key="item[pk]"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="category">
          <el-select
            v-model="resource.category"
            filterable
            reserve-keyword
            :value-key="pk"
            placeholder="请选择类别名称"
          >
            <el-option
              v-for="item in categories"
              :key="item[pk]"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="吊牌价" prop="price">
          <form-currency
            v-model.number="resource.price"
            placeholder="请输入填充价格"
          />
        </el-form-item>

        <el-form-item label="排序权重" prop="sort">
          <el-input-number
            v-model="resource.sort"
            :min="0"
            :max="9999"
            label="排序权重"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="虚拟销量" prop="fake_sales_qty">
          <el-input-number
            v-model="resource.fake_sales_qty"
            :min="0"
            label="虚拟销量"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="上架" prop="on_sale">
          <el-switch v-model="resource.on_sale"> </el-switch>
        </el-form-item>

        <el-form-item label="基本属性" prop="attributes">
          <ProductAttributes v-model="resource.attributes" />
        </el-form-item>

        <el-form-item label="图集" prop="images">
          <ImageUpload
            ref="imageUpload"
            v-if="loaded"
            multiple
            :token="token"
            v-model="resource.images"
          />
        </el-form-item>

        <el-form-item label="销售属性" prop="options" class="full">
          <sku-options
            :onFetchOptions="fetchAvailableOptionNames"
            ref="skuOptions"
            v-model="resource.options"
            :token="token"
          />
        </el-form-item>

        <el-form-item label="销售规格" prop="items" class="full">
          <sku-table
            class="mt-3"
            :data="resource.options"
            :items="items"
            @on-change-data="handleChangeData"
          />
        </el-form-item>
      </div>
    </div>

    <div class="card overflow-hidden mb-6 shadow-none">
      <div class="card-head">
        <div class="card-head__title">
          产品详情
        </div>
      </div>
      <div class="w-full p-6">
        <quill-editor
          v-model="resource.description"
          :action="appConfig.qiniu_upload_action"
          :token="token"
        >
        </quill-editor>
      </div>
    </div>
  </el-form>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
import { mapGetters } from 'vuex'

import { SKUOptions, SKUTable } from '@/3rd-components/sku'

export default {
  name: 'post-form',
  mixins: [ResourceForm],
  components: {
    ProductAttributes: () => import('./ProductAttributes'),
    'sku-options': SKUOptions,
    'sku-table': SKUTable,
    ImageUpload: () => import('@/components/Form/ImageUpload'),
    'quill-editor': () => import('@/3rd-components/Quill'),
    'import-from-taobao': () => import('./ImportFromTaobao')
  },
  data() {
    return {
      loaded: false,
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
      rules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
        category: [
          { required: true, message: '请选择产品类别', trigger: 'change' }
        ],
        selectionOptions: [
          {
            type: 'array',
            min: 1,
            required: true,
            message: '请选择产品销售属性',
            trigger: 'change'
          }
        ],
        price: [{ required: true, message: '请输入产品价格', trigger: 'blur' }]
      },
      categories: [],

      brands: [],

      dialogVisible: false,

      currentAddCustomOption: {},
      token: null,
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
    fillFromTaobao(resource) {
      this.$nextTick(() => {
        this.resource.name = resource.name
        this.resource.attributes = resource.attributes
        this.resource.price = resource.price
        this.$set(this.resource, 'images', resource.images)
        this.$set(this.resource, 'options', resource.options)
        // this.$set(this.resource, 'items', resource.items)
        this.items = resource.items
        this.resource.description = resource.description
        this.$refs.imageUpload.fill(resource.images)
      })
    },
    // 获取七牛云token
    async fetchQiniuToken() {
      let data = await axios.get('/qiniu')
      if (data.status === 200) {
        this.token = data.data.token
      }
    },

    async getCreationInfo() {
      let {
        data: { brands, categories }
      } = await axios.get('/creation-info/products')
      this.brands = brands
      this.categories = categories
    },

    handleChangeData(data) {
      this.resource.items = data
    },

    // 重置表单
    reset() {
      this.$refs[this.formName].resetFields()
      this.resource = _.cloneDeep(this.cloneResource)
      // this.initOptionChecked()
    },
    init() {
      this.fillResource()
      this.items = _.get(this, 'resource.items', [])
      // this.initOptionChecked()
      this.cloneResource = _.cloneDeep(this.resource)
      this.loaded = true
    }
  },
  computed: {
    ...mapGetters(['appConfig'])
  },
  async created() {
    await this.fetchQiniuToken()
    this.getCreationInfo()
  }
}
</script>

<style></style>
