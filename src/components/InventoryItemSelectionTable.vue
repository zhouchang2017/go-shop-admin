<template>
  <index-resource-table
    v-loading="loading"
    ref="IndexResourceTable"
    :filterWithTrashed="false"
    selection
    @change="payload => $emit('change', payload)"
    :items="items"
    resourceName="Item"
    :fetchResourceFun="getResources"
  >
    <template slot="filters" slot-scope="{ filters }">
      <FilterBoxItem name="状态">
        <el-select
          v-model="filters.status"
          multiple
          class="w-full"
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
            <InventoryStatus :value="item.value" />
          </el-option>
        </el-select>
      </FilterBoxItem>
    </template>
    <el-table-column label="货号" prop="data.item.code" />
    <el-table-column label="品牌" prop="data.item.product.brand.name" />
    <el-table-column label="类目" prop="data.item.product.category.name" />
    <el-table-column label="门店" prop="data.shop.name" />
    <el-table-column label="属性值" align="left">
      <template slot-scope="{ row }">
        <div class="flex flex-row">
          <div v-for="value in row.data.item.option_values" :key="value.id">
            <el-tooltip
              class="item"
              effect="dark"
              :content="value.code"
              placement="top"
            >
              <code
                class="markdown block whitespace-no-wrap text-gray-700 p-1 bg-30 hover:bg-gray-300 hover:font-bold  rounded mr-3 text-xs"
                >{{ value.value }}</code
              >
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="{ row }">
        <InventoryStatus :value="row.data.status" />
      </template>
    </el-table-column>
    <el-table-column label="库存" prop="data.qty" />
  </index-resource-table>
</template>

<script>
import { getResources } from '@/api/inventory'
import Inventory from '@/views/inventories/inventory'
import { setTimeout } from 'timers'
export default {
  name: 'InventoryItemSelectionTable',
  components: {
    'index-resource-table': () =>
      import('@/components/Index/ResourceIndexTable'),
    FilterBoxItem: () => import('@/components/FilterBoxItem'),
    InventoryStatus: () => import('@/views/inventories/Status')
  },
  mixins: [Inventory],
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      resources: {},
      table: null
    }
  },
  watch: {
    shopId: {
      handler: function(v) {
        this.setFilter()
      }
    }
  },
  methods: {
    getResources,
    setFilter() {
      if (this.table) {
        this.table.setFilter('shops', [this.shopId])
      }
    },
    removeFilter() {
      this.table.removeFilter('shops')
    }
  },
  computed: {
    shopId() {
      return this.$store.getters['manualInventoryAction/shopId']
    }
  },
  beforeDestroy() {
    this.removeFilter()
  },
  mounted() {
    this.loading = true

    setTimeout(() => {
      this.$nextTick(() => {
        this.table = this.$refs['IndexResourceTable']
        if (this.shopId != '') {
          this.setFilter()
        }
      })
    }, 500)

    this.loading = false
  }
}
</script>
