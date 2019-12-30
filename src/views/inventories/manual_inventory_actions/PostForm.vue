<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <div class="card overflow-hidden mb-6">
      <div class="w-full p-6">
        <el-form-item v-if="updating" label="ID" prop="id">
          <el-input v-model="resource.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="resource.type" placeholder="请选择操作类型">
            <el-option
              v-for="item in types"
              value-key="value"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店" prop="shop_id">
          <el-select v-model="resource.shop_id" placeholder="请选择门店">
            <el-option
              v-for="item in shops"
              value-key="id"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择商品" prop="items">
          <component
            :is="currentSelectionComponent"
            :items="resource.items"
            @change="onChange"
            >{{ tips }}</component
          >

          <!-- <ItemSelectionTable :items="resource.items" @change="onChange" /> -->
          <!-- <InventoryItemSelectionTable /> -->
          <div
            v-show="showResourceItems"
            class="mt-3 w-full rounded-lg shadow-lg"
          >
            <el-table :data="resource.items">
              <el-table-column type="index"> </el-table-column>
              <el-table-column prop="code" min-width="150" label="货号">
              </el-table-column>
              <el-table-column label="品牌" prop="product.brand.name" />
              <el-table-column label="类目" prop="product.category.name" />
              <el-table-column label="属性值" align="left">
                <template slot-scope="{ row }">
                  <div class="flex flex-col items-center">
                    <div v-for="value in row.option_values" :key="value.id">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="value.code"
                        placement="top"
                      >
                        <code
                          class="markdown block  text-center text-gray-700 p-1 bg-30 hover:bg-gray-300 hover:font-bold  rounded mr-3 text-xs"
                          >{{ value.value }}</code
                        >
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="qty" label="数量">
                <template slot-scope="{ row }">
                  <el-input
                    size="mini"
                    :min="1"
                    type="number"
                    v-model.number="row.qty"
                    placeholder="请输入数量"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="Actions"
                align="right"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="{ row }">
                  <div
                    class="flex flex-row justify-end items-center text-gray-500"
                  >
                    <el-popover placement="top" v-model="row.visible">
                      <div class="flex p-3">
                        <p>是否确定删除{{ row.code }}？</p>
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
                          <icons-icon viewBox="0 0 24 20" type="i-delete" />
                        </button>
                      </div>
                    </el-popover>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div
              class="flex justify-center rounded-b-lg bg-gray-100 py-3 px-2 text-gray-600 font-bold"
            >
              <div class="ml-auto mr-3">总计数量</div>
              <div>{{ sumQty }}</div>
            </div>
          </div>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
export default {
  name: 'post-form',
  mixins: [ResourceForm],
  components: {
    'item-selection-table': () => import('@/components/ItemSelectionTable'),
    'inventory-item-selection-table': () =>
      import('@/components/InventoryItemSelectionTable'),
    'place-choose-type': () => import('./PlaceChooseType')
  },
  data() {
    let checkItems = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请至少选择一个入库商品'))
      }
      if (value.some(item => item.qty <= 0)) {
        return callback(new Error('入库数量必须大于0'))
      }
      callback()
    }
    return {
      resource: {
        type: null,
        shop_id: '',
        items: []
      },
      items: {},
      rules: {
        shop_id: [{ required: true, message: '请选择门店', trigger: 'change' }],
        items: [
          { validator: checkItems, trigger: 'change' },
          {
            type: 'array',
            required: true,
            message: '请至少选择一个入库商品',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    'resource.shop_id': function(id) {
      this.$store.commit('manualInventoryAction/SET_SHOP_ID', id)
    },
    'resource.type': function(type) {}
  },
  methods: {
    removeItem(obj) {
      let index = this.resource.items.findIndex(item => item.id === obj.id)
      if (index >= 0) {
        // obj.visible = false
        this.resource.items.splice(index, 1)
      }
    },
    // 填充数据
    fillResource() {
      this.$set(this, 'resource', Object.assign({}, this.resource, this.value))
      _.get(this, 'resource.items', []).forEach(item => {
        this.$set(this.items, item.id, { qty: item.qty, status: item.status })
      })
    },
    onChange({ checked, obj }) {
      if (checked) {
        console.log(obj)
        this.resource.items.push({
          qty: 1,
          visible: false,
          ...obj
        })
      } else {
        let index = this.resource.items.findIndex(item => item.id === obj.id)
        if (index >= 0) {
          this.resource.items.splice(index, 1)
        }
      }
    }
  },
  computed: {
    currentSelectionComponent() {
      if (this.resource.type === 0) {
        return 'item-selection-table'
      }
      if (this.resource.type === 1 && this.selectedShop) {
        return 'inventory-item-selection-table'
      }
      return 'place-choose-type'
    },
    tips() {
      if (!this.selectedType) {
        return '请选择操作类型'
      }
      if (this.resource.type === 1 && !this.selectedShop) {
        return '请选择出库门店'
      }
      return ''
    },
    shops() {
      return _.get(this, '$user.shops', [])
    },
    types() {
      return _.get(this, '$route.meta.types', [])
    },
    sumQty() {
      return _.sumBy(this.resource.items, 'qty')
    },
    selectedType() {
      return !_.isNil(this.resource.type)
    },
    selectedShop() {
      return this.resource.shop_id !== '' && !_.isNil(this.resource.shop_id)
    },
    showResourceItems() {
      if (this.resource.type === 0) {
        return true
      }
      if (this.resource.type === 1 && this.selectedShop) {
        return true
      }
      return false
    }
  }
}
</script>

<style></style>
