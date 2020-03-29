<template>
  <div class="flex flex-col">
    <div class="flex items-center mb-3">
      <heading :level="1" class="flex-no-shrink">{{
        $route.meta.Title
      }}</heading>
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
            @keydown.stop="performSearch"
            @input="performSearch"
          />
        </div>
        <div class="flex items-center ml-auto pr-3 text-gray-500">
          <filter-box zIndex="100" :count="activeFilterCount">
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
        :data="resources"
        tooltip-effect="dark"
        class="border-none"
      >
        <el-table-column min-width="150" label="商品" prop="images">
          <template slot-scope="{ row }">
            <div class="flex items-center">
              <el-image
                class="h-12 w-12 rounded"
                fit="cover"
                width="100%"
                :src="row.order_item.item.avatar"
                lazy
              />
              <div class="ml-3">
                <router-link
                  :to="{
                    name: 'products.detail',
                    params: { id: row.order_item.item.product.id }
                  }"
                  class="leading-tight hover:text-blue-500 hover:font-bold"
                  >{{ row.order_item.item.code }}</router-link
                >
                <div class="text-xs">
                  {{
                    row.order_item.item.option_values
                      .map(value => value.name)
                      .join('/')
                  }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="品牌"
          prop="order_item.item.product.brand.name"
        />
        <el-table-column
          show-overflow-tooltip
          label="类目"
          prop="order_item.item.product.category.name"
        />
        <el-table-column min-width="150" label="订单号" prop="order_no">
          <template slot-scope="{ row }">
            <router-link
              :to="{
                name: 'orders.detail',
                params: { id: row.order_id }
              }"
              class="leading-tight hover:text-blue-500 hover:font-bold"
              >{{ row.order_no }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column label="数量" sortable="custom" prop="order_item.count">
        </el-table-column>
        <el-table-column label="金额" prop="order_item.amount">
          <template slot-scope="{ row }">
            {{ row.order_item.amount | money }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="发货门店" prop="shop.name">
        </el-table-column>

        <el-table-column align="center" label="最后更新日期" prop="updated_at">
          <template slot-scope="{ row }">
            {{ row.updated_at | timeStr }}
          </template>
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
import Minimum from '@/utils/minimum'
import Index from '@/mixins/Index'
import StandardFilterable from '@/mixins/StandardFilterable'
export default {
  name: 'order-shipment',
  mixins: [Index, StandardFilterable],
  inject: ['reload'],
  provide() {
    return {
      order: this
    }
  },
  data() {
    return {
      resource: null,
      initialLoading: true,
      loading: true,
      isWorking: false,
      shops: [],
      filters: {
        shops: []
      }
    }
  },
  watch: {
    filters: {
      handler: function(v) {
        this.filterChanged()
      },
      deep: true
    }
  },
  async created() {
    await this.getShops()
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
      data.forEach(item => {
        let shopId = _.get(item, 'logistics.items.shop_id')
        if (shopId) {
          item.shop = _.find(this.shops, ['id', shopId])
        }
      })
      this.resources = data
    },
    getShops() {
      return Minimum(axios.get('/api/shops?page=-1'))
        .then(({ data }) => {
          this.shops = data.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    resourceId() {
      return _.get(this, '$route.params.id')
    },
    resourcesEndpoint() {
      return `/aggregate/${this.resourceName}/unit`
    }
  }
}
</script>

<style></style>
