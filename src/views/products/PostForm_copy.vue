<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <div class="card overflow-hidden mb-6 shadow-none">
      <div class="card-head">
        <div class="card-head__title">
          基本
        </div>
        <import-from-taobao
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

        <ProductAttributes v-model="resource.attributes" />

        <el-form-item label="图集" prop="images">
          <ImageUpload
            ref="imageUpload"
            v-if="loaded"
            multiple
            :token="token"
            v-model="resource.images"
          />
        </el-form-item>
      </div>
    </div>

    <div class="card overflow-hidden mb-6 shadow-none">
      <div class="card-head">
        <div class="card-head__title">
          销售属性
        </div>
      </div>
      <div class="w-full p-6">
        <el-form-item
          v-show="availableOptions.length"
          label="选项"
          prop="selectionOptions"
        >
          <el-checkbox-group
            v-model="resource.selectionOptions"
            @change="optionsChange"
          >
            <el-checkbox
              :disabled="optionIsSelected(option[pk]) && updating"
              v-for="option in availableOptions"
              :key="option[pk]"
              :label="option[pk]"
            >
              {{ option.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <CustomOptionValueForm
          v-model="dialogVisible"
          :option.sync="currentAddCustomOption"
          :token="token"
        ></CustomOptionValueForm>

        <!--可选属性-->
        <el-form-item
          v-for="(option, index) in resource.options"
          :key="option[pk]"
          :prop="'options.' + index + '.selectionValues'"
          :label="`可选${option.name}`"
          :rules="{
            type: 'array',
            min: 1,
            required: true,
            message: '至少选择一项' + option.name,
            trigger: 'change'
          }"
        >
          <el-checkbox-group
            v-model="option.selectionValues"
            @change="optionValuesChange(option)"
          >
            <el-checkbox
              :disabled="
                optionValueIsSelected(option[pk], value.code) && updating
              "
              v-for="value in option.availableOptionValues"
              :key="value.code"
              :label="value.code"
            >
              <div class="flex flex-col items-center">
                <el-image
                  v-if="option.thumbnail && value.thumbnail_url"
                  fit="cover"
                  class="h-12 w-12 rounded mb-1"
                  :src="value.thumbnail_url"
                  lazy
                ></el-image>
                <div>
                  <span>{{ value.value }}</span>
                  <code
                    class="markdown text-60 p-1 bg-gray-300 rounded ml-1 text-xs"
                    >{{ value.code }}</code
                  >
                </div>
              </div>
            </el-checkbox>

            <el-button
              class="ml-3"
              size="mini"
              @click="showCustomOptionValueForm(option)"
              >添加自定义{{ option.name }}
            </el-button>
          </el-checkbox-group>
        </el-form-item>
        <!-- 商品列表 -->
        <Sku v-if="loaded" :resource="resource" editable />
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

export default {
  name: 'post-form',
  mixins: [ResourceForm],
  components: {
    ProductAttributes: () => import('./ProductAttributes'),
    CustomOptionValueForm: () => import('./CustomOptionValueForm'),
    Sku: () => import('./Sku'),
    ImageUpload: () => import('@/components/Form/ImageUpload'),
    'quill-editor': () => import('@/3rd-components/Quill'),
    'import-from-taobao': () => import('./ImportFromTaobao')
  },
  data() {
    return {
      loaded: false,
      option: '',
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
      token: null
    }
  },
  methods: {
    fillFromTaobao(resource) {
      this.resource.name = resource.name
      this.resource.attributes = resource.attributes
      this.resource.price = resource.price
      this.$set(this.resource, 'images', resource.images)
      this.resource.description = resource.description
      this.$refs.imageUpload.fill(resource.images)
    },
    // 获取七牛云token
    async fetchQiniuToken() {
      let data = await axios.get('/qiniu')
      if (data.status === 200) {
        this.token = data.data.token
      }
    },
    // 当前销售属发生变化
    optionsChange(optionIds) {
      // 更新resource.options
      const options = optionIds
        .map(id => {
          let option = this.resource.options.find(
            option => option[this.pk] === id
          )

          if (!option) {
            // push new option
            option = _.cloneDeep(
              this.availableOptions.find(option => option[this.pk] === id)
            )
            option.availableOptionValues = option.values || []
            option.selectionValues = []
            option.values = []
          }
          return option
        })
        .sort((a, b) => b.sort - a.sort)
      this.$set(this.resource, 'options', options)
    },

    // 当前销售属性值发生变化
    optionValuesChange(option = {}) {
      if (_.isEmpty(option)) {
        this.$set(option, 'values', [])
        return
      }
      // 更新 values 数组，与selectionValues保持一致
      const { selectionValues, availableOptionValues } = option
      this.$set(
        option,
        'values',
        selectionValues.map(
          code => availableOptionValues.find(value => value.code === code) || []
        )
      )
    },

    // 当前类目发生变化
    categoryChange() {
      // reset
      this.optionsChange([])
      this.resource.selectionOptions.splice(0)
      this.optionValuesChange()
    },

    // 点击添加自定义属性按钮处理方法
    showCustomOptionValueForm(option) {
      this.dialogVisible = true
      this.$set(this, 'currentAddCustomOption', option)
    },

    // 从resource.options 提取 option._id 写入 resource.selectionOptions
    initOptionChecked() {
      this.resource.options.forEach(option => {
        this.resource.selectionOptions.push(option[this.pk])
        // 为option 对象添加 availableOptionValues, 自定义属性值一同合并
        const categoryOption = _.find(this.availableOptions, [
          this.pk,
          option[this.pk]
        ])

        let values =
          _.unionBy(
            [..._.get(categoryOption, 'values', []), ...option.values],
            'code'
          ) || []
        this.$set(option, 'availableOptionValues', values)

        // 为option 对象添加 selectionValues
        this.$set(
          option,
          'selectionValues',
          option.values.map(value => value.code)
        )
      })
    },
    async getCreationInfo() {
      let {
        data: { brands, categories }
      } = await axios.get('/creation-info/products')
      this.brands = brands
      this.categories = categories
    },

    // 重置表单
    reset() {
      this.$refs[this.formName].resetFields()
      this.resource = _.cloneDeep(this.cloneResource)
      this.initOptionChecked()
    },
    init() {
      this.fillResource()
      this.initOptionChecked()
      this.cloneResource = _.cloneDeep(this.resource)
      this.loaded = true
    }
  },
  computed: {
    ...mapGetters(['appConfig']),
    availableOptions() {
      let category = _.find(this.categories, [
        'id',
        _.get(this, 'resource.category.id')
      ])

      return _.get(category, 'options', []).sort((a, b) => b.sort - a.sort)
    },
    optionIsSelected() {
      return id =>
        _.get(this, 'cloneResource.selectionOptions', []).includes(id)
    },

    optionValueIsSelected() {
      return (optId, code) => {
        const option = _.find(_.get(this, 'cloneResource.options', []), [
          this.pk,
          optId
        ])
        if (option) {
          return option.selectionValues.includes(code)
        }
        return false
      }
    }
  },
  async created() {
    await this.fetchQiniuToken()
    this.getCreationInfo()
  }
}
</script>

<style></style>
