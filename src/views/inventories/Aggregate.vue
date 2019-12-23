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
          <z-search-input
            placeholder="请输入货号进行搜索"
            v-model.trim="search"
          />
        </div>
        <div class="flex items-center ml-auto pr-3 text-gray-500">
          <FilterBox zIndex="100">
            <FilterBoxItem name="状态">
              <el-select
                v-model="filters.options.status"
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
            <FilterBoxItem name="门店">
              <el-select
                v-model="filters.options.shops"
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
            </FilterBoxItem>
          </FilterBox>
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
        v-on:sort-change="sortChange"
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
          :formatter="() => 'qty'"
        >
          <template slot-scope="{ row }">
            <div class="font-bold">
              {{ row.total }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed label="状态">
          <template slot-scope="{ row }">
            <InventoryStatus :value="row.status" />
          </template>
        </el-table-column>

        <el-table-column
          :formatter="() => 'inventories.qty'"
          align="center"
          label="小计"
          sortable="custom"
          prop="qty"
        >
          <template slot-scope="{ row }">
            <div :class="{ 'text-red-500': row.qty <= 1 && row.status === 2 }">
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
              {{ getStock(shop.id, row.shops) }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div class="flex justify-center rounded-b-lg bg-gray-100 py-3 px-2">
        <el-pagination
          @size-change="setPerPage"
          @current-change="setPage"
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
import { aggregate } from '@/api/inventory'

import { getResources as getShops } from '@/api/shop'
import InteractsWithQueryString from '@/mixins/InteractsWithQueryString'
import Paginatable from '@/mixins/Paginatable'
import PerformsSearches from '@/mixins/PerformsSearches'
import Sortable from '@/mixins/Sortable'
import Filterable from '@/mixins/Filterable'
import Inventory from './inventory'
export default {
  name: 'resource-aggregate-page',
  mixins: [
    InteractsWithQueryString,
    Paginatable,
    PerformsSearches,
    Sortable,
    Filterable,
    Inventory
  ],
  components: {
    FilterBox: () => import('@/components/FilterBox'),
    FilterBoxItem: () => import('@/components/FilterBoxItem'),
    // Dropdown: () => import('@/components/Dropdown')
    // 'filter-box-item': () => import('@/components/FilterBoxItem'),
    InventoryStatus: () => import('@/views/inventories/Status')
  },
  data() {
    return {
      tableName: 'aggregate-table',
      loading: false,
      // 资源列表
      resources: [],
      isOpen: false,
      shops: [],
      shopMap: {},
      filters: {
        options: {
          shops: [],
          status: []
        }
      },
      spanArr: [],
      pos: 0,
      mergeCols: [
        'code',
        'total',
        'product.brand.name',
        'product.category.name'
      ]
    }
  },
  watch: {
    $route: function(v) {
      this.fetchResources(v.query)
    },
    resources: function(v) {
      this.getSpanArr(v)
    }
  },
  methods: {
    // 获取列表方法
    fetchResources(query = {}) {
      this.loading = true
      aggregate(this.mergeQueryString(query))
        .then(res => {
          if (res.status === 200) {
            if (_.isNil(res.data.data)) {
              this.resources = []
              this.resourceTotal = 0
              this.loading = false
            } else {
              this.$set(
                this,
                'resources',
                res.data.data.reduce((t, item) => {
                  const { inventories, qty, ...root } = item
                  let items = _.get(item, 'inventories', []).map(inventory => {
                    return Object.assign({}, root, inventory, { total: qty })
                  })
                  t.push(...items)
                  return t
                }, [])
              )
              this.resourceTotal = res.data.pagination.total
              this.loading = false
            }
          }
        })
        .catch(({ response }) => {
          // this.$message.error(JSON.stringify(response.data))
          this.loading = false
        })
    },
    // 获取门店列表
    fetchShops() {
      getShops({ page: -1, only: '_id,name' }).then(data => {
        if (data.status === 200) {
          this.shops = _.get(data, 'data.data', []).map(item => {
            return _.tap(
              {
                id: _.get(item, 'data.id'),
                name: _.get(item, 'data.name')
              },
              shop => {
                this.$set(this.shopMap, shop.id, shop)
              }
            )
          })
        }
      })
    },
    // 获取库存数量
    getStock(id, shops) {
      return _.get(
        shops.find(item => item.id === id),
        'qty',
        0
      )
    },
    sortChange({ column, prop, order }) {
      let field = !_.isNil(column.formatter) ? column.formatter() : prop
      this.setSort({ prop: field, order })
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
    title() {
      return _.get(this.$route, 'meta.Title', this.$route.name)
    },
    indexTitle() {
      return _.get(this.$route, 'meta.IndexTitle', false)
    },
    shopsCount() {
      return this.shops.length
    },
    availableShops() {
      let filterStores = _.get(this.filters, 'options.shops', [])
      if (filterStores.length === 0) {
        return this.shops
      }
      return filterStores.map(id => this.shopMap[id])
    }
  },
  created() {
    this.fetchShops()
  },
  mounted() {
    this.$nextTick(() => {
      //   this.$refs[this.tableName].sort(this.tableSortParameter)
      // this.filters = _.defaults(this.filterStruct, this.filters)
      this.fetchResources()
    })
  }
}
</script>
