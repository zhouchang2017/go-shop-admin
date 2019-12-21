<template>
  <div class="flex flex-col">
    <div class="w-full flex items-center mb-3">
      <div class="font-bold text-2xl text-gray-700 uppercase">{{ title }}</div>
      <div class="ml-auto">
        <router-link
          :to="{ name: $route.meta.CreateRouterName }"
          class="inline-flex cursor-pointer text-center items-center px-3 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:opacity-75 focus:outline-none focus:shadow-outline"
        >
          {{ $route.meta.CreateButtonText }}
        </router-link>
      </div>
    </div>
    <!-- index table -->
    <index-resource-table
      showCreatedAt
      :fetchResourceFun="getResources"
      :deleteResourceFun="deleteResource"
      :deleteForceResourceFun="forceDeleteResource"
      :restoreResourceFun="restoreResource"
      :resourceName="$route.meta.ResourceName"
      :detailResourceRouteName="$route.meta.DetailRouterName"
      :editResourceRouteName="$route.meta.EditRouterName"
    >
      <template slot="filters" slot-scope="{ filters }">
        <filter-box-item name="创建时间">
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="filters.created_at"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </filter-box-item>
      </template>
      <el-table-column label="名称" prop="data.name" />
    </index-resource-table>
  </div>
</template>

<script>
import {
  getResources,
  deleteResource,
  forceDeleteResource,
  restoreResource
} from '@/api/category'
import Index from '@/mixins/Index'
export default {
  mixins: [Index],
  data() {
    return {}
  },
  methods: {
    getResources,
    deleteResource,
    forceDeleteResource,
    restoreResource
  }
}
</script>

<style></style>
