<template>
  <div class="rounded-lg shadow-lg">
    <div
      class="flex rounded-t-lg bg-white items-center py-3 border-b border-gray-200"
    >
      <div class="flex items-center w-full md:w-3/5 pl-3 mr-10">
        <z-search-input
          :placeholder="searchInputPlaceholder"
          v-model.trim="search"
        />
      </div>
      <div class="flex items-center ml-auto pr-3 text-gray-500">
        <!-- Lenses -->
        <div class="flex mr-3" v-show="hasLenses">
          <Dropdown placement="r" class="w-full">
            <button
              slot="trigger"
              slot-scope="isOpen"
              @click="isOpen = true"
              class="hidden sm:flex sm:items-center sm:w-full outline-none focus:outline-none"
            >
              <span class="text-sm font-bold text-gray-500 uppercase"
                >More</span
              >
              <svg
                class="ml-1 h-6 w-6 fill-current text-gray-400 lg:ml-auto"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7.293 9.293a1 1 0 011.414 0L12 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                ></path>
              </svg>
            </button>
            <div class="w-64 bg-white rounded-lg shadow-lg overflow-hidden">
              <slot name="lenses" />
            </div>
          </Dropdown>
        </div>
        <FilterBox zIndex="100">
          <slot name="filters" v-bind:filters.sync="filters" />
          <FilterBoxItem name="Trashed" v-if="filterWithTrashed">
            <el-checkbox v-model="withTrashed">显示软删除资源</el-checkbox>
          </FilterBoxItem>
        </FilterBox>
      </div>
    </div>
    <el-table
      :ref="tableName"
      v-loading="loading"
      :data="resources"
      :row-key="rowKey"
      tooltip-effect="dark"
      v-on:sort-change="sortChange"
      @select="handleSelection"
      @select-all="handleSelectionAll"
    >
      <el-table-column v-if="selection" type="selection" width="55" />
      <el-table-column v-if="showId" label="Id" prop="data.id" />
      <slot />
      <el-table-column
        v-if="showCreatedAt"
        label="创建时间"
        prop="data.created_at"
        sortable="custom"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.data.created_at | timeStr }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showUpdatedAt"
        label="更新时间"
        prop="data.updated_at"
        sortable="custom"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.data.updated_at | timeStr }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="currentTrashed"
        label="删除时间"
        prop="data.deleted_at"
        sortable="custom"
        align="left"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.data.deleted_at | timeStr }}</span>
        </template>
      </el-table-column>
      <!-- Resource Action -->
      <el-table-column
        v-if="showActions"
        label="Actions"
        align="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <div class="flex justify-end items-center">
            <button
              title="恢复"
              v-if="
                row.meta.AuthorizedToRestore &&
                  row.data.deleted_at &&
                  restoreResourceFun
              "
              @click="restoreResourceHandler(row.data)"
              class="text-gray-500 hover:text-blue-500 mr-3"
            >
              <icons-icon viewBox="0 0 24 20" type="i-restore" />
            </button>
            <router-link
              v-if="row.meta.AuthorizedToView"
              :to="{
                name: viewRouteName,
                params: { id: row.data[pk] },
                query: withTrashedToQueryString(row.data.deleted_at)
              }"
              class="cursor-pointer inline-block text-gray-500 hover:text-blue-500 mr-3 focus:outline-none"
              title="查看"
            >
              <icons-icon width="22" height="18" viewBox="0 0 22 16" type="i-view" />
            </router-link>
            <router-link
              v-if="row.meta.AuthorizedToUpdate"
              :to="{
                name: editRouteName,
                params: { id: row.data[pk] },
                query: withTrashedToQueryString(row.data.deleted_at)
              }"
              class="cursor-pointer inline-block text-gray-500 hover:text-blue-500 mr-3 focus:outline-none"
              title="编辑"
            >
              <icons-icon type="i-edit" />
            </router-link>
            <button
              title="删除"
              v-if="row.meta.AuthorizedToDelete && deleteResourceFun"
              @click="indexDeleteResourceHandler(row.data)"
              class="text-gray-500 hover:text-blue-500"
            >
              <icons-icon viewBox="0 0 24 20" type="i-delete" />
            </button>
          </div>
        </template>
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
</template>

<script>

import { now } from '@/utils/time'
export default {
  name: 'resource-table',
  components: {
    FilterBox: () => import('@/components/FilterBox'),
    FilterBoxItem: () => import('@/components/FilterBoxItem'),
    Dropdown: () => import('@/components/Dropdown')
  },
  props: {
    // 已选定项
    items: {
      type: Array,
      default: () => []
    },
    tableName: {
      type: String,
      default: 'selectionTable'
    },
    // 表格行key
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    searchPlaceholder: String, // 搜索框提示文字
    selection: Boolean, // 是否开启首列选择框
    showId: Boolean, // 是否显示id字段
    showCreatedAt: Boolean, // 是否显示创建时间
    showUpdatedAt: Boolean, // 是否显示更新时间
    fetchResourceFun: Function, // 获取资源方法
    deleteResourceFun: Function, // 删除资源方法
    deleteForceResourceFun: Function, // 永久删除资源方法
    restoreResourceFun: Function, // 恢复方法
    searchable: Boolean, // 是否允许搜索
    detailResourceRouteName: String, // 详情页路由名称
    editResourceRouteName: String, // 编辑页路由名称
    filterWithTrashed: {
      type: Boolean,
      default: true
    },
    resourceName: {
      type: String,
      required: true
    },
    pk: {
      type: String,
      default: 'id'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    hiddenAction: Boolean
  },
  watch: {
    resources: {
      handler: function() {
        this.toggleSelection()
      },
      deep: true
    },
    items: function() {
      this.toggleSelection()
    }
  },
  data: () => ({
    loading: false,
    // 资源列表
    resources: [],
    isOpen: false,

    // pagination
    pageParameter: 'page',
    perPageParameter: 'per_page',
    page: 1,
    perPage: 15,
    resourceTotal: 0
  }),

  methods: {
    // 获取列表方法
    fetchResources(query = {}) {
      this.loading = true
      this.fetchResourceFun(this.mergeQueryString(query))
        .then(res => {
          if (res.status === 200) {
            if (_.isNil(res.data.data)) {
              this.resources = []
              this.resourceTotal = 0
              this.loading = false
            } else {
              this.$set(this, 'resources', res.data.data)
              this.$emit('on-load-resources', res.data.data)
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

    async indexDeleteResourceHandler(resource) {
      try {
        if (resource.deleted_at) {
          // 硬删除
          await this.forceDeleteResourceHandler(resource)
          let index = this.resources.findIndex(
            item => item.data[this.pk] == resource[this.pk]
          )
          if (index > -1) {
            this.resources.splice(index, 1)
            // 从数组移除
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.resourceTotal--
          }
        } else {
          // 软删除
          await this.deleteResourceHandler(resource)
          let index = this.resources.findIndex(
            item => item.data[this.pk] == resource[this.pk]
          )
          if (index > -1) {
            if (this.withTrashed) {
              resource.deleted_at = now()
            } else {
              // 从数组移除
              this.resources.splice(index, 1)
              this.resourceTotal--
            }

            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        }
      } catch (e) {
        console.error(e)
      }
    },

    // 删除资源处理函数
    deleteResourceHandler(resource) {
      return new Promise((resolve, reject) => {
        this.$confirm(`是否删除${_.get(resource, this.nameKey)}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteResourceFun(resource[this.pk])
              .then(() => {
                resolve()
              })
              .catch(e => {
                // 资源不存在
                reject(e.response)
              })
          })
          .catch(() => {})
      })
    },

    // 永久删除资源处理函数
    forceDeleteResourceHandler(resource) {
      return new Promise((resolve, reject) => {
        this.$confirm(`是否永久删除${_.get(resource, this.nameKey)}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.deleteForceResourceFun(resource[this.pk])
              .then(() => {
                resolve()
              })
              .catch(e => {
                // 资源不存在
                reject(e.response)
              })
          })
          .catch(e => {})
      })
    },
    // 恢复资源处理函数
    restoreResourceHandler(resource) {
      this.$confirm(`是否恢复${_.get(resource, this.nameKey)}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          this.restoreResourceFun(resource[this.pk])
            .then(() => {
              resource.deleted_at = null
            })
            .catch(({ response }) => {
              console.error(response)
            })
        })
        .catch(() => {})
    },
    // 排序方法
    sortChange({ column, prop, order }) {
      let field = !_.isNil(column.formatter) ? column.formatter() : prop
      this.setSort({ prop: field, order })
    },

    tableRowClassName({ row }) {
      return this.items.includes(row.data.id) ? 'selection-row' : ''
    },
    handleSelection(selections, row) {
      let item = selections.find(item => item.data.id === row.data.id)
      this.$emit('change', { checked: !_.isNil(item), obj: row.data })
    },
    handleSelectionAll(selection) {
      if (selection.length === 0) {
        // 清空
        this.resources.forEach(item => {
          this.$emit('change', { checked: false, obj: item.data })
        })
      } else {
        // 全选
        selection.forEach(item => {
          if (!this.items.map(i => i.id).includes(item.data.id)) {
            this.$emit('change', { checked: true, obj: item.data })
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
              this.items.map(item => item.id).includes(_.get(row, 'data.id'))
            )
          })
        } else {
          this.$refs[this.tableName].clearSelection()
        }
      })
    }
  },
  computed: {
    hasResources() {
      return Boolean(this.resources.length > 0)
    },
    // 创建资源路由名称
    createRouteName() {
      return this.createResourceRouteName || `${this.resourceName}.create`
    },

    // 资源详情路由名称
    viewRouteName() {
      return this.detailResourceRouteName || `${this.resourceName}.detail`
    },

    // 编辑资源路由名称
    editRouteName() {
      return this.editResourceRouteName || `${this.resourceName}.edit`
    },

    searchInputPlaceholder() {
      return this.searchPlaceholder
        ? this.searchPlaceholder
        : this.resourceLabel
        ? `请输入${this.resourceLabel}名称`
        : '请输入关键词'
    },

    hasLenses() {
      return _.get(this, '$slots.lenses', []).length > 0
    },

    // 是否显示action列
    showActions() {
      return (
        !!this.deleteResourceFun ||
        !!this.restoreResourceFun ||
        !!this.detailResourceRouteName ||
        (!!this.editResourceRouteName && !hiddenAction)
      )
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs[this.tableName].sort(this.tableSortParameter)
      // this.filters = _.defaults(this.filterStruct, this.filters)
      this.fetchResources()
    })
  }
}
</script>

<style></style>
