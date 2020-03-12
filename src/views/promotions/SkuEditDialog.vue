<template>
  <div
    title="编辑"
    class="appearance-none cursor-pointer text-70 hover:text-primary mr-3"
  >
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="80%"
      class="cursor-default"
    >
      <div slot="title" class="flex items-center text-xl font-bold">
        {{ promotionType === 0 ? 'SKU促销价格设置' : '选择参加促销SKU' }}
      </div>
      <div v-loading="loading">
        <el-alert
          v-if="promotionType === 1"
          class="mb-3"
          title="一个都不选择的话，则视为全部参加"
          type="info"
          :closable="false"
        >
        </el-alert>
        <div class="flex-col" v-if="promotionType === 0">
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
          </div>

          <div class="flex items-center py-1 max-w-xs">
            <div class="whitespace-no-wrap mr-1 font-mono text-gray-700">
              批量减价
            </div>
            <form-currency
              v-model="preferentialPrice"
              class="mr-1"
              :extraProps="{
                size: 'mini'
              }"
            />
            <el-button type="primary" @click="fillPreferentialPrice" size="mini"
              >确认</el-button
            >
          </div>
          <div class="flex items-center py-1 max-w-xs">
            <div class="whitespace-no-wrap mr-1 font-mono text-gray-700">
              批量填充
            </div>
            <form-currency
              class="mr-1"
              v-model="price"
              :extraProps="{
                size: 'mini'
              }"
            />
            <el-button type="primary" @click="fillPrice" size="mini"
              >确认</el-button
            >
          </div>
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

        <div class="flex items-center">
          <el-table
            :data="data"
            :ref="tableName"
            @select="handleSelection"
            @select-all="handleSelectionAll"
            class="rounded-lg overflow-hidden"
            fit
            highlight-current-row
            style="width: 100%;"
            :max-height="maxHeight"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column label="缩略图" prop="avatar">
              <template slot-scope="{ row }">
                <el-image
                  class="h-8 w-8 rounded"
                  fit="cover"
                  width="100%"
                  :src="row.item.avatar"
                  lazy
                />
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="item.code"
              min-width="150"
              label="货号"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="属性值"
              align="left"
              min-width="150"
            >
              <template slot-scope="{ row }">
                {{ row.item.option_values.map(value => value.name).join('/') }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="price"
              min-width="100"
              label="吊牌价"
            >
              <template slot-scope="{ row }">{{
                row.origin_price | money
              }}</template>
            </el-table-column>
            <el-table-column
              v-if="promotionType === 0"
              min-width="150"
              label="促销价"
            >
              <template slot-scope="{ row }">
                <form-currency
                  :extraClass="
                    `outline-none
          focus:outline-none w-full rounded ${row.error ? 'error' : ''}`
                  "
                  v-model.number="row.price"
                  :extraProps="{
                    size: 'mini',
                    disabled: !row.checked
                  }"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button :disabled="loading" type="primary" @click="submit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <button
      title="编辑"
      type="button"
      @click="dialogVisible = true"
      class="text-gray-500 hover:text-blue-500"
    >
      <icons-icon type="icons-edit" />
    </button>
  </div>
</template>

<script>
export default {
  inject: ['promotion'],
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    productId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableName: 'sku-table',
      itemKey: 'item_id',
      dialogVisible: false,
      price: 0,
      preferentialPrice: 0,
      discount: 8,
      data: [],
      loading: false
    }
  },
  async mounted() {
    // await this.fetchItems()
    // this.valueInit()
    // this.toggleSelection()
  },
  watch: {
    async dialogVisible(value) {
      if (value) {
        await this.itemsInit()
        this.valueInit()
        this.toggleSelection()
      }
    },
    data: {
      handler: function(value) {
        value.forEach(item => {
          item.error = item.price <= 0 ? true : false
        })
      },
      deep: true
    }
  },
  methods: {
    async submit() {
      try {
        let res = await this.validateForm()
        this.$emit('submit', res)
        this.dialogVisible = false
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        let units = this.data.filter(item => item.checked)
        let ifErr = units.some(item => item.error)
        return ifErr
          ? reject(new Error('促销价格不得低于0'))
          : resolve(
              units.map(item => {
                return _.tap({}, res => {
                  if (_.has(item, 'price')) {
                    res.price = item.price
                  }
                  if (_.has(item, 'origin_price')) {
                    res.origin_price = item.origin_price
                  }
                  res.item = item.item
                  res.item_id = item.item_id
                })
              })
            )
      })
    },
    // 初始化数据格式
    valueInit() {
      // 合并units
      this.data = this.items.reduce((res, item) => {
        let unit = this.units.find(unit => unit.item_id === item.id)
        if (unit) {
          const error = unit.price <= 0 ? true : false
          res.push({
            ...unit,
            item,
            checked: true,
            error
          })
        } else {
          res.push({
            item_id: item.id,
            price: item.price,
            origin_price: item.price,
            checked: false,
            item: item,
            error: false
          })
        }
        return res
      }, [])
    },
    async itemsInit() {
      if (!_.has(this.value, 'product.items')) {
        try {
          this.loading = true
          let { data } = await this.fetchItems()
          this.value.product.items = data.data
          this.loading = false
        } catch (error) {
          this.loading = false
          console.error(error)
        }
      }
    },
    fetchItems() {
      return axios.get(`/api/items?page=-1&filters=${this.filterParams}`)
    },
    // 批量设置价格
    fillPrice() {
      this.data.forEach(item => {
        if (item.checked) {
          item.price = this.price
        }
      })
    },
    // 批量折扣
    fillDiscount() {
      this.data.forEach(item => {
        if (item.checked) {
          item.price = (item.origin_price * this.discount) / 10
        }
      })
    },
    // 批量减价
    fillPreferentialPrice() {
      this.data.forEach(item => {
        if (item.checked) {
          item.price = item.origin_price - this.preferentialPrice
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
    },
    toggleSelection() {
      this.$nextTick(() => {
        if (this.data) {
          //let hasCheckedIds = this.units.map(item => item[this.itemKey])
          _.get(this, 'data', []).forEach(row => {
            this.$refs[this.tableName].toggleRowSelection(row, row.checked)
          })
        } else {
          this.$refs[this.tableName].clearSelection()
        }
      })
    },
    handleSelection(selections, row) {
      let item = selections.find(
        item => item[this.itemKey] === row[this.itemKey]
      )
      const checked = !_.isNil(item)
      row.checked = checked
      //   this.$emit('change', { checked: checked, obj: row })
    },
    handleSelectionAll(selection) {
      if (selection.length === 0) {
        // 清空
        this.data.forEach(item => {
          item.checked = false
        })
      } else {
        // 全选
        selection.forEach(item => {
          item.checked = true
        })
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？直接关闭不进行保存')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  },
  computed: {
    maxHeight() {
      return window.innerHeight - 200
    },
    items() {
      return _.get(this, 'value.product.items', [])
    },
    units() {
      return _.get(this, 'value.units', [])
    },
    filterParams() {
      return btoa(
        encodeURIComponent(JSON.stringify({ 'product.id': this.productId }))
      )
    },
    promotionType() {
      return this.promotion.resource.type
    }
  }
}
</script>
