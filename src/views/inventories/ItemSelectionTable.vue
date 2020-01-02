<template>
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
        </filter-box>
      </div>
    </div>
    <el-table
      :ref="tableName"
      v-loading="loading"
      :data="resources"
      tooltip-effect="dark"
      class="border-none"
      max-height="350"
      @select="handleSelection"
      @select-all="handleSelectionAll"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column show-overflow-tooltip label="货号" prop="code" />
      <el-table-column
        show-overflow-tooltip
        label="品牌"
        prop="product.brand.name"
      />
      <el-table-column
        show-overflow-tooltip
        label="类目"
        prop="product.category.name"
      />
      <el-table-column label="价格" prop="price" sortable align="left">
      </el-table-column>
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
                  class="markdown block whitespace-no-wrap text-gray-700 p-1 bg-30 hover:bg-gray-300 hover:font-bold  rounded mr-3 text-xs"
                  >{{ value.value }}</code
                >
              </el-tooltip>
            </div>
          </div>
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
</template>

<script>
import Index from '@/mixins/Index'
import StandardFilterable from '@/mixins/StandardFilterable'
export default {
  name: 'ItemSelectionTable',
  mixins: [Index, StandardFilterable],
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      perPage: 10
    }
  },
  watch: {
    filters: {
      handler: function(v) {
        this.filterChanged()
      },
      deep: true
    },
    items: function() {
      this.toggleSelection()
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
    handleSelection(selections, row) {
      console.log(row)
      let item = selections.find(item => item.id === row.id)
      this.$emit('change', { checked: !_.isNil(item), obj: row })
    },
    handleSelectionAll(selection) {
      if (selection.length === 0) {
        // 清空
        this.resources.forEach(item => {
          this.$emit('change', { checked: false, obj: item })
        })
      } else {
        // 全选
        selection.forEach(item => {
          if (!this.items.map(i => i.id).includes(item.id)) {
            this.$emit('change', { checked: true, obj: item })
          }
        })
      }
    },
    toggleSelection() {
      this.$nextTick(() => {
        if (this.resources) {
          _.get(this, 'resources', []).forEach(row => {
            this.$refs[this.tableName].toggleRowSelection(
              row,
              this.items.map(item => item.id).includes(row.id)
            )
          })
        } else {
          this.$refs[this.tableName].clearSelection()
        }
      })
    }
  },

  computed: {
    // 资源api
    resourcesEndpoint() {
      return '/api/items'
    }
  }
}
</script>
