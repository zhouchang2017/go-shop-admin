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
          @keydown.stop="performSearch"
          @input="performSearch"
        />
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
      <el-table-column show-overflow-tooltip label="货号" prop="code" />
      <el-table-column show-overflow-tooltip label="品牌" prop="brand.name" />
      <el-table-column
        show-overflow-tooltip
        label="类目"
        prop="category.name"
      />
      <el-table-column label="价格" prop="price" sortable align="left">
        <template slot-scope="{ row }">
          <div>{{ row.price | money }}</div>
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
  name: 'ProductSelectionTable',
  mixins: [Index, StandardFilterable],
  props: {
    items: {
      type: Array,
      default: () => []
    },
    itemKey: {
      type: String,
      default: 'product_id'
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
    resources: {
      handler: function(v) {
        this.toggleSelection()
      },
      immediate: true
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
      let product = selections.find(product => product.id === row.id)
      const checked = !_.isNil(product)
      this.$emit('change', { checked: checked, obj: row })
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
          if (!this.items.map(i => i[this.itemKey]).includes(item.id)) {
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
              this.items.map(item => item[this.itemKey]).includes(row.id)
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
      return '/api/products'
    }
  }
}
</script>
