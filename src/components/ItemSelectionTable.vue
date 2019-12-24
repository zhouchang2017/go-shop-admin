<template>
  <index-resource-table
    :filterWithTrashed="false"
    selection
    @change="payload => $emit('change', payload)"
    :items="items"
    resourceName="Item"
    :fetchResourceFun="getResources"
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
    <el-table-column label="货号" prop="data.code" />
    <el-table-column label="品牌" prop="data.product.brand.name" />
    <el-table-column label="类目" prop="data.product.category.name" />
    <el-table-column label="价格" prop="data.price" sortable align="left">
    </el-table-column>
    <el-table-column label="属性值" align="left">
      <template slot-scope="{ row }">
        <div class="flex flex-row">
          <div v-for="value in row.data.option_values" :key="value.id">
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
  </index-resource-table>
</template>

<script>
import { getResources } from '@/api/item'
export default {
  components: {
    'index-resource-table': () =>
      import('@/components/index/ResourceIndexTable'),
    'filter-box-item': () => import('@/components/FilterBoxItem')
  },
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      resources: {}
    }
  },

  methods: {
    getResources
  }
}
</script>
