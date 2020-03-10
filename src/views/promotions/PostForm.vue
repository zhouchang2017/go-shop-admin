<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <div class="card overflow-hidden mb-6 shadow-none">
      <div class="w-full p-6">
        <el-form-item v-if="updating" label="ID" prop="id">
          <el-input v-model="resource.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="resource.name"
            placeholder="请输入活动名称"
          ></el-input>
          <div class="text-gray-500 text-xs">
            活动名称尽量简短，如换季特惠、1111、618大促
          </div>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-radio-group v-model="resource.type">
            <el-radio :label="0">单品活动</el-radio>
            <el-radio :label="1">复合活动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input
            type="textarea"
            :rows="2"
            v-model="resource.description"
            placeholder="请输入活动描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否互斥" prop="mutex">
          <el-switch v-model="resource.mutex"> </el-switch>
          <div class="text-gray-500 text-xs">
            单品活动无视互斥，只要活动开启，优惠就生效
          </div>
        </el-form-item>

        <div
          v-if="resource.type === 1"
          class="card shadow-none bg-gray-200 mb-6"
        >
          <div class="card-head">
            <div class="card-head__title">
              规则
            </div>
          </div>
          <div class="p-6">
            <el-form-item label="规则类型" prop="mutex">
              <el-radio-group v-model="resource.rule.type">
                <el-radio :label="0">不限</el-radio>
                <el-radio :label="1">金额大于</el-radio>
                <el-radio :label="2">数量大于</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="resource.rule.type > 0"
              label="规则条件"
              prop="mutex"
            >
              <form-currency
                v-if="resource.rule.type == 1"
                v-model="resource.rule.value"
                placeholder="请输入规则条件"
              ></form-currency>
              <el-input-number
                v-if="resource.rule.type == 2"
                v-model="resource.rule.value"
                :min="1"
                :max="100"
                label="购买数量大于"
              ></el-input-number>
            </el-form-item>
          </div>
        </div>

        <div
          v-if="resource.type === 1"
          class="card shadow-none bg-gray-200 mb-6"
        >
          <div class="card-head">
            <div class="card-head__title">
              策略
            </div>
          </div>
          <div class="p-6">
            <el-form-item label="优惠类型" prop="policy.type">
              <el-radio-group
                v-model="resource.policy.type"
                @change="policyTypeChange"
              >
                <el-radio :label="1">打折</el-radio>
                <el-radio :label="2">值减</el-radio>
                <el-radio :label="3" disabled="">免邮</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="resource.policy.type < 3"
              :label="policyType"
              prop="policy.value"
            >
              <el-slider
                v-if="resource.policy.type == 1"
                v-model="resource.policy.value"
                :format-tooltip="formatTooltip"
              ></el-slider>
              <form-currency
                v-if="resource.policy.type == 2"
                v-model="resource.policy.value"
                placeholder="请输入优惠金额"
              ></form-currency>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="活动时间">
          <el-date-picker
            v-model="rangeTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="促销商品" class="full">
          <product-selection-table
            :extendRequestQueryParams="extendRequestQueryParams"
            @change="onChange"
            :items="resource.items"
          />
        </el-form-item>

        <el-form-item
          :label="`已选商品(${countSelectionItem})`"
          prop="items"
          class="full"
        >
          <div>
            <div class="flex items-center py-1">
              <div class="whitespace-no-wrap font-mono text-gray-700 mr-1">
                批量打折
              </div>
              <el-input-number
                v-model="discount"
                size="mini"
                :min="1"
                :max="10"
                :precision="2"
                :step="0.1"
                controls-position="right"
                class="mr-1"
              ></el-input-number>

              <!-- <el-input v-model="discount" size="mini" class="mr-1" /> -->
              <el-button type="primary" @click="fillDiscount" size="mini"
                >确认</el-button
              >
              <div class="flex items-center py-1">
                <el-button-group>
                  <el-button @click="fillRoundedUnit(2)" size="mini"
                    >抹角</el-button
                  >
                  <el-button @click="fillRoundedUnit(1)" size="mini"
                    >抹分</el-button
                  >
                </el-button-group>
              </div>
            </div>
          </div>

          <el-table
            class="rounded-lg shadow-lg"
            max-height="550"
            :data="resource.items"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="缩略图" prop="product.avatar">
              <template slot-scope="{ row }">
                <el-image
                  class="h-12 w-12 rounded"
                  fit="cover"
                  width="100%"
                  :src="row.product.avatar"
                  lazy
                />
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="product.code"
              min-width="150"
              label="货号"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="product.price"
              min-width="150"
              label="吊牌价"
            >
              <template slot-scope="{ row }">{{
                row.product.price | money
              }}</template>
            </el-table-column>

            <el-table-column
              label="操作"
              align="right"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <div
                  class="flex flex-row justify-end items-center text-gray-500"
                >
                  <sku-edit-dialog
                    :value="row"
                    @submit="units => onSkuEditSubmit(units, row)"
                    :productId="row.product_id"
                  />
                  <el-popover placement="top" v-model="row.visible">
                    <div class="flex p-3">
                      <p>是否确定删除{{ row.product.code }}？</p>
                    </div>

                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="row.visible = false"
                        >取消</el-button
                      >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="removeItem(row)"
                        >确定</el-button
                      >
                    </div>
                    <div
                      slot="reference"
                      title="删除"
                      class="appearance-none cursor-pointer text-70 hover:text-primary"
                    >
                      <button
                        title="删除"
                        type="button"
                        class="text-gray-500 hover:text-blue-500"
                      >
                        <icons-icon viewBox="0 0 24 20" type="icons-delete" />
                      </button>
                    </div>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="启用" prop="enable">
          <el-switch v-model="resource.enable"> </el-switch>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
import { mapGetters } from 'vuex'

import { SKUOptions, SKUTable } from '@/3rd-components/sku'
import { deflate } from 'zlib'

export default {
  name: 'post-form',
  mixins: [ResourceForm],
  components: {
    'product-selection-table': () => import('./ProductSelectionTable'),
    'sku-edit-dialog': () => import('./SkuEditDialog')
  },

  provide() {
    return {
      promotion: this
    }
  },

  data() {
    return {
      extendRequestQueryParams: {
        with: 'item',
        hidden: 'attributes,options,description,sort'
      },
      loaded: false,
      resource: {
        id: null,
        name: '',
        type: 0,
        rule: { type: 0, value: 0 },
        policy: { type: 1, value: 0 },
        description: '',
        mutex: false,
        enable: true,
        begin_at: '',
        ended_at: '',
        items: []
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
      discount: 8
    }
  },
  methods: {
    // 重置表单
    reset() {
      this.$refs[this.formName].resetFields()
      this.resource = _.cloneDeep(this.cloneResource)
      // this.initOptionChecked()
    },
    async ctestProductApi() {
      let { data } = await axios.get('/promotions/5e621c70ed02ced785f1d257/api')
      console.log(data)
    },
    formatTooltip(value) {
      return `${value}%`
    },
    policyTypeChange() {
      this.resource.policy.value = 0
    },
    removeItem(obj) {
      let index = this.resource.items.findIndex(item => item.id === obj.id)
      if (index >= 0) {
        // obj.visible = false
        this.resource.items.splice(index, 1)
      }
    },
    onChange({ checked, obj }) {
      if (checked) {
        let productId = obj.id

        let units = []
        if (this.isUnitSale) {
          if (obj.items && obj.items.length) {
            obj.items.forEach(item => {
              units.push({
                item_id: item.id,
                item: item,
                price: item.price
              })
            })
          }
        }

        this.resource.items.push({
          visible: false,
          product_id: productId,
          product: obj,
          units
        })
      } else {
        let index = this.resource.items.findIndex(
          item => item.product_id === obj.id
        )
        if (index >= 0) {
          this.items.splice(index, 1)
        }
      }
    },
    onSkuEditSubmit(units, row) {},
    // 批量折扣
    fillDiscount() {
      this.data.forEach(item => {
        if (item.checked) {
          item.price = (item.item.price * this.discount) / 10
        }
      })
    },
    // 抹角/抹分
    fillRoundedUnit(num) {
      this.data.forEach(item => {
        if (item.checked) {
          if (item.price) {
            let unit = Math.pow(10, num)

            item.price = Math.ceil(item.price / unit) * unit
          }
        }
      })
    }
  },
  computed: {
    ...mapGetters(['appConfig']),
    rangeTime: {
      get() {
        return [this.resource.begin_at, this.resource.ended_at]
      },
      set(value) {
        this.resource.begin_at = value[0]
        this.resource.ended_at = value[1]
      }
    },
    policyType() {
      let type = _.get(this, 'resource.policy.type')
      switch (type) {
        case 1:
          return '折扣比例'
        case 2:
          return '直减金额'
        default:
          return '策略金额'
      }
    },
    isUnitSale() {
      return this.resource.type === 0
    },
    countSelectionItem() {
      return _.get(this, 'resource.items', []).length
    }
  },
  async created() {
    await this.ctestProductApi()
  }
}
</script>

<style></style>
