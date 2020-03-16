<template>
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
    </div>
    <el-table
      v-loading="loading"
      :data="resources"
      tooltip-effect="dark"
      class="border-none"
    >
      <el-table-column label="缩略图" prop="images">
        <template slot-scope="{ row }">
          <el-image
            class="h-12 w-12 rounded"
            fit="cover"
            width="100%"
            :src="row.avatar"
            lazy
          />
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="货号"
        min-width="150"
        prop="code"
      />
      <el-table-column
        show-overflow-tooltip
        label="属性值"
        align="left"
        min-width="150"
      >
        <template slot-scope="{ row }">
          {{ row.option_values.map(value => value.name).join('/') }}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="库存" sortable prop="qty" />
      <el-table-column label="价格" prop="price" sortable align="left">
        <template slot-scope="{ row }">
          <div>{{ row.price | money }}</div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="unitSale"
        label="促销价格"
        align="left"
        min-width="150"
        prop="sale_price"
        sortable
      >
        <template slot-scope="{ row }">
          <div class="inline-flex">
            <router-link
              :to="{
                name: 'promotions.detail',
                params: { id: row.unit_sale_id }
              }"
              class="inline-block bg-red-500 whitespace-no-wrap text-white px-1 font-bold rounded text-xs mr-1"
              >{{ row.unit_sale_name }}</router-link
            >

            <div>{{ row.sale_price | money }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="hasRecombinationSales"
        label="促销活动"
        align="left"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            v-for="(item, index) in getRecombinationSales(row.id)"
            :key="index"
            effect="dark"
            :content="item.promotion.description"
            placement="top"
          >
            <router-link
              :to="{
                name: 'promotions.detail',
                params: { id: item.promotion.id }
              }"
              tag="div"
              class="bg-gray-300 cursor-pointer overflow-hidden flex items-center whitespace-no-wrap  text-gray-700 px-1 font-bold rounded text-xs"
              :class="{ 'mb-1': getRecombinationSales(row.id).length >= index }"
            >
              <status-field
                class="mr-1"
                :type="item.promotion.mutex ? 'success' : 'error'"
              />
              <div>{{ item.promotion.name }}</div>
            </router-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-center rounded-b-lg bg-gray-100 py-3 px-2">
      <el-pagination
        @size-change="updatePerPageChanged"
        @current-change="selectPage"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 100]"
        :page-size="perPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="resourceTotal"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Index from '@/mixins/Index'
import StandardFilterable from '@/mixins/StandardFilterable'
export default {
  props: ['resource', 'resourceId', 'field'],
  mixins: [Index, StandardFilterable],
  data() {
    return {
      perPage: 15,
      promotions: []
    }
  },
  async created() {
    this.$set(this.filters, 'product.id', this.resourceId)
    await this.fetchUnitPromotion()
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
    // 设置Resource
    setResources(data) {
      data.forEach(item => {
        if (this.unitSale) {
          let price = this.getUnitSalePrice(item.id)
          item.sale_price = price !== -1 ? price : item.price
          if (price !== -1) {
            item.sale_price = price
            item.unit_sale_name = this.unitSaleName
            item.unit_sale_id = this.unitSaleId
          }
        }
      })
      this.resources = data
    },
    // 获取单品促销价
    async fetchUnitPromotion() {
      try {
        let { data } = await axios.get(
          `/api/products/${this.resourceId}/promotions`
        )
        this.promotions = data
      } catch (error) {
        console.error(error)
      }
    },
    getUnitSalePrice(id) {
      let item = this.unitSale.units.find(unit => unit.item_id === id)
      if (item) {
        return item.price
      }
      return -1
    },
    getRecombinationSales(id) {
      return this.recombinationSales.filter(item => {
        if (item.units.length === 0) {
          return true
        }
        if (item.units.findIndex(unit => unit.item_id === id) >= 0) {
          return true
        }
        return false
      })
    }
  },
  computed: {
    // 资源api
    resourcesEndpoint() {
      return '/api/items'
    },
    unitSale() {
      let unitSale = _.get(this, 'promotions[0]')
      if (unitSale && unitSale.promotion && unitSale.promotion.type === 0) {
        return unitSale
      }
      return false
    },
    unitSaleId() {
      return this.unitSale ? this.unitSale.promotion.id : '-'
    },
    unitSaleName() {
      return this.unitSale ? this.unitSale.promotion.name : '-'
    },
    hasRecombinationSales() {
      return this.recombinationSales.length > 0
    },
    recombinationSales() {
      return this.promotions.filter(item => item.promotion.type === 1)
    }
  }
}
</script>
