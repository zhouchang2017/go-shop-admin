<template>
  <div class="flex flex-col">
    <div class="w-full flex items-center mb-3">
      <div class="font-bold text-2xl text-gray-700 uppercase">{{ title }}</div>
      <div class="ml-auto" v-if="$route.meta.AuthorizedToCreate">
        <router-link
          :to="{ name: $route.meta.CreateRouterName }"
          class="inline-flex cursor-pointer text-center items-center px-3 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:opacity-75 focus:outline-none focus:shadow-outline"
          >{{ $route.meta.CreateButtonText }}</router-link
        >
      </div>
    </div>
    <!-- index table -->
    <index-resource-table
      showUpdatedAt
      searchPlaceholder="请输入货号进行搜索"
      :fetchResourceFun="getResources"
      :deleteResourceFun="deleteResource"
      :deleteForceResourceFun="forceDeleteResource"
      :restoreResourceFun="restoreResource"
      :resourceName="$route.meta.ResourceName"
      :detailResourceRouteName="$route.meta.DetailRouterName"
      :editResourceRouteName="$route.meta.EditRouterName"
    >
      <template slot="lenses">
        <div class="py-1">
          <router-link
            v-for="lense in lenses"
            :key="lense.name"
            :to="{ name: lense.routerName }"
            class="block px-6 py-3 leading-tight hover:bg-gray-200"
            >{{ lense.name }}</router-link
          >
        </div>
      </template>
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
        <FilterBoxItem name="门店">
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
        </FilterBoxItem>
      </template>
      <el-table-column min-width="80" label="货号" prop="data.item.code" />
      <el-table-column
        show-overflow-tooltip
        label="品牌"
        prop="data.item.product.brand.name"
      />
      <el-table-column
        show-overflow-tooltip
        label="类目"
        prop="data.item.product.category.name"
      />
      <el-table-column label="存量" sortable="custom" prop="qty">
        <template slot-scope="{ row }">
          {{ row.data.qty }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="data.status">
        <template slot-scope="{ row }">
          <InventoryStatus :value="row.data.status" />
        </template>
      </el-table-column>
      <el-table-column label="门店" prop="data.shop.name" />
    </index-resource-table>
  </div>
</template>

<script>
import {
  getResources,
  deleteResource,
  forceDeleteResource,
  restoreResource
} from '@/api/inventory'
import Inventory from './inventory'
import { getResources as getShops } from '@/api/shop'
export default {
  name: 'resource-index-page',
  mixins: [Inventory],
  components: {
    'index-resource-table': () =>
      import('@/components/index/ResourceIndexTable'),
    FilterBoxItem: () => import('@/components/FilterBoxItem'),
    InventoryStatus: () => import('@/views/inventories/Status')
  },
  data() {
    return {
      shops: []
    }
  },
  methods: {
    getResources,
    deleteResource,
    forceDeleteResource,
    restoreResource,
    // 获取门店列表
    fetchShops() {
      getShops({ page: -1, only: '_id,name' }).then(data => {
        if (data.status === 200) {
          this.shops = _.get(data, 'data.data', []).map(item => {
            return {
              id: _.get(item, 'data.id'),
              name: _.get(item, 'data.name')
            }
          })
        }
      })
    }
  },
  computed: {
    title() {
      return _.get(this.$route, 'meta.Title', this.$route.name)
    },
    lenses() {
      return _.get(this.$route, 'meta.Lenses', [])
    }
  },
  mounted() {
    this.fetchShops()
  }
}
</script>

<style></style>
