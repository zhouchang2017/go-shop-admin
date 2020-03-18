<template>
  <div class="flex flex-col">
    <div class="w-full flex items-center mb-3">
      <router-link
        v-if="indexTitle"
        :to="{ name: $route.meta.IndexRouterName }"
        class="font-bold text-2xl text-gray-500 hover:text-blue-500 uppercase mr-1"
        >{{ indexTitle }}</router-link
      >
      <div
        v-if="indexTitle"
        class="font-bold text-2xl text-gray-700 uppercase mr-1"
      >
        /
      </div>
      <div class="font-bold text-2xl text-gray-700 uppercase">{{ title }}</div>
      <div class="ml-auto"></div>
    </div>
    <!-- table -->
    <div class="rounded-lg shadow-lg">
      <div
        class="flex rounded-t-lg bg-white items-center py-3 border-b border-gray-200"
      >
        <div class="flex items-center w-full md:w-3/5 pl-3 mr-10">
          <form-search-input
            placeholder="请输入货号进行搜索"
            v-model.trim="search"
          />
        </div>
        <div class="flex items-center ml-auto pr-3 text-gray-500">
          <filter-box zIndex="100" :count="activeFilterCount">
            <filter-box-item name="状态">
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
            </filter-box-item>
            <filter-box-item name="门店">
              <el-select
                v-model="filters.shops"
                multiple
                class="w-full"
                placeholder="请选择门店"
              >
                <el-option
                  v-for="item in shops"
                  value-key="id"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </filter-box-item>
          </filter-box>
        </div>
      </div>
      <el-table
        :ref="tableName"
        v-loading="loading"
        border
        :data="resources"
        tooltip-effect="dark"
        :span-method="objectSpanMethod"
        class="border-none"
      >
        <el-table-column min-width="80" fixed label="货号" prop="code" />
        <el-table-column
          show-overflow-tooltip
          fixed
          label="品牌"
          prop="product.brand.name"
        />
        <el-table-column
          show-overflow-tooltip
          fixed
          label="类目"
          prop="product.category.name"
        />
        <el-table-column
          fixed
          label="合计"
          align="center"
          sortable="custom"
          prop="total"
        >
          <template slot-scope="{ row }">
            <div class="font-bold">
              {{ row.total }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed label="状态" prop="status">
          <template slot-scope="{ row }">
            <InventoryStatus :value="row.status" />
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          fixed
          align="center"
          label="可用/锁定"
          prop="tag"
        >
          <template slot-scope="{ row }">
            <div class="flex justify-center">
              <icons-icon
                class="text-orange-400"
                v-if="row.tag === '锁定'"
                type="icons-lock-close"
              />
              <icons-icon v-else type="icons-lock-open" />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :formatter="() => 'inventories.total'"
          align="center"
          label="小计"
          prop="qty"
        >
          <template slot-scope="{ row }">
            <div
              :class="{
                'text-red-500':
                  row.qty <= 1 && row.status === 0 && row.tag === '可用'
              }"
            >
              {{ row.qty }}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="门店" v-if="shops.length > 0">
          <el-table-column
            align="center"
            v-for="shop in availableShops"
            :key="shop.id"
            :label="shop.name"
          >
            <template slot-scope="{ row }">
              {{ getStock(shop.id, row.shops, row.tag) }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div class="flex justify-center rounded-b-lg bg-gray-100 py-3 px-2">
        <el-pagination
          @size-change="updatePerPageChanged"
          @current-change="selectPage"
          :current-page="page"
          :page-sizes="[5, 10, 15, 100]"
          :page-size="perPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="resourceTotal"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Inventory from './inventory'
import Index from '@/mixins/Index'
import StandardFilterable from '@/mixins/StandardFilterable'
export default {
  name: 'resource-aggregate-page',
  mixins: [Inventory, Index, StandardFilterable],
  components: {
    InventoryStatus: () => import('@/views/inventories/Status')
  },
  data: () => ({
    filters: {
      shops: [],
      status: []
    },
    spanArr: [],
    pos: 0,
    mergeCols: ['code', 'total', 'product.brand.name', 'product.category.name']
  }),
  watch: {
    filters: {
      handler: function(v) {
        this.filterChanged()
      },
      deep: true
    },
    resources: function(v) {
      this.getSpanArr(v)
    }
  },
  async created() {
    this.initializeSearchFromQueryString()
    this.initializePerPageFromQueryString()
    this.initializeTrashedFromQueryString()
    this.initializeOrderingFromQueryString()
    this.initializeFiltersFromQueryString()

    await this.getResources()

    this.initialLoading = false

    this.$watch(
      () => {
        return (
          this.resourceName +
          this.encodedFilters +
          this.currentSearch +
          this.currentPage +
          this.perPage +
          this.currentOrderBy +
          this.currentOrderByDirection +
          this.currentTrashed
        )
      },
      () => {
        this.getResources()
      }
    )
  },
  methods: {
    /**
     * 设置Resource
     */
    setResources(data) {
      this.$set(
        this,
        'resources',
        data.reduce((t, item) => {
          const { inventories, ...root } = item
          let items = _.get(item, 'inventories', []).map(inventory => {
            return Object.assign({}, root, inventory)
          })

          t.push(
            ...items.reduce((res, item) => {
              res.push({ ...item, tag: '可用', qty: item.qty })
              res.push({ ...item, tag: '锁定', qty: item.locked_qty })
              return res
            }, [])
          )
          return t
        }, [])
      )
    },

    // 获取库存数量
    getStock(id, shops, tag) {
      return _.get(
        shops.find(item => item.id === id),
        tag === '可用' ? 'qty' : 'locked_qty',
        0
      )
    },
    getSpanArr(data, key = 'id') {
      this.pos = 0
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i][key] === data[i - 1][key]) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.mergeCols.includes(column.property)) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        }
      }
    }
  },
  computed: {
    resourcesEndpoint() {
      return `/aggregate/${this.resourceName}`
    },
    indexTitle() {
      return _.get(this.$route, 'meta.IndexTitle', false)
    },
    shopsCount() {
      return this.shops.length
    },
    availableShops() {
      let filterStores = _.get(this.filters, 'shops', [])
      if (filterStores.length === 0) {
        return this.shops
      }
      return filterStores.map(id => this.shopMap[id])
    },
    shops() {
      return _.get(this, '$route.meta.shops', [])
    },
    shopMap() {
      return this.shops.reduce((res, shop) => {
        res[shop.id] = shop
        return res
      }, {})
    }
  }
}
</script>
