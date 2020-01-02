<template>
  <el-form :ref="formName" :model="resource" :rules="rules">
    <div class="card overflow-hidden mb-6">
      <div class="w-full p-6">
        <el-form-item v-if="updating" label="ID" prop="id">
          <el-input v-model="resource.id" disabled></el-input>
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
      </div>
    </div>
  </el-form>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
export default {
  name: 'post-form',
  mixins: [ResourceForm],

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
