<template>
  <div class="flex flex-col">
    <!-- Head Title -->
    <div class="w-full flex items-center mb-3">
      <div class="font-bold text-2xl text-gray-700 uppercase">{{ title }}</div>
      <div class="ml-auto" v-if="$route.meta.AuthorizedToCreate">
        <router-link
          :to="{ name: $route.meta.CreateRouterName }"
          class="inline-flex cursor-pointer text-center items-center px-3 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:opacity-75 focus:outline-none focus:shadow-outline"
        >
          {{ $route.meta.CreateButtonText }}
        </router-link>
      </div>
    </div>

    <!-- Body -->
    <div class="rounded-lg shadow-lg">
      <!-- Table Head -->
      <div
        class="flex rounded-t-lg bg-white items-center py-3 border-b border-gray-200"
      >
        <div class="flex items-center w-full md:w-3/5 pl-3 mr-10">
          <form-search-input
            :placeholder="searchInputPlaceholder"
            v-model.trim="search"
            @keydown.stop="performSearch"
            @input="performSearch"
          />
        </div>
        <div class="flex items-center ml-auto pr-3 text-gray-500">
          <!-- Lenses -->
          <div class="flex mr-3" v-show="shouldShowLenses">
            <dropdown placement="r" class="w-full">
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
                <router-link
                  v-for="lense in lenses"
                  :key="lense.title"
                  :to="{ name: lense.router_name }"
                  class="block px-6 py-3 leading-tight hover:bg-gray-200"
                  >{{ lense.title }}</router-link
                >
                <router-link
                  v-for="link in links"
                  :key="link.title"
                  :to="{ name: link.router_name }"
                  class="block px-6 py-3 leading-tight hover:bg-gray-200"
                  >{{ link.title }}</router-link
                >
              </div>
            </dropdown>
          </div>
          <filter-box zIndex="100">
            <slot name="filters" v-bind:filters.sync="filters" />
            <filter-box-item name="Trashed">
              <el-checkbox v-model="trashed">显示软删除资源</el-checkbox>
            </filter-box-item>
          </filter-box>
        </div>
      </div>
      <el-table
        :ref="tableName"
        v-loading="loading"
        :data="resources"
        tooltip-effect="dark"
        v-on:sort-change="sortChange"
        @select="handleSelection"
        @select-all="handleSelectionAll"
      >
        <el-table-column v-if="selection" type="selection" width="55" />
        <el-table-column
          v-for="(field, index) in headings"
          :key="field.attribute"
          :label="field.name"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <component
              :is="resolveComponentName(index, row.fields)"
              :field="row.fields[index]"
              :resourceName="resourceName"
            />
          </template>
        </el-table-column>
        <slot />

        <!-- Resource Action -->
        <el-table-column
          v-if="shouldShowActions"
          label="Actions"
          align="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <div class="flex justify-end items-center">
              <button
                title="恢复"
                v-if="row.AuthorizedToRestore && row.SoftDeleted"
                @click="restoreResourceHandler(row.id)"
                class="text-gray-500 hover:text-blue-500 mr-3"
              >
                <icons-icon viewBox="0 0 24 20" type="icons-restore" />
              </button>
              <router-link
                v-if="row.AuthorizedToView"
                :to="{
                  name: row.DetailRouterName,
                  params: { id: row.id.value },
                  query: withTrashedToQueryString(row.SoftDeleted)
                }"
                class="cursor-pointer inline-block text-gray-500 hover:text-blue-500 mr-3 focus:outline-none"
                title="查看"
              >
                <icons-icon
                  width="22"
                  height="18"
                  viewBox="0 0 22 16"
                  type="icons-view"
                />
              </router-link>
              <router-link
                v-if="row.AuthorizedToUpdate"
                :to="{
                  name: row.EditRouterName,
                  params: { id: row.id.value },
                  query: withTrashedToQueryString(row.SoftDeleted)
                }"
                class="cursor-pointer inline-block text-gray-500 hover:text-blue-500 mr-3 focus:outline-none"
                title="编辑"
              >
                <icons-icon type="icons-edit" />
              </router-link>
              <button
                title="删除"
                v-if="row.AuthorizedToDelete"
                @click="indexDeleteResourceHandler(row)"
                class="text-gray-500 hover:text-blue-500"
              >
                <icons-icon viewBox="0 0 24 20" type="icons-delete" />
              </button>
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
  </div>
</template>

<script>
import InteractsWithQueryString from '@/mixins/InteractsWithQueryString'
import Filterable from '@/mixins/Filterable'
import Minimum from '@/utils/minimum'
import { now } from '@/utils/time'

export default {
  name: 'Index',
  mixins: [Filterable, InteractsWithQueryString],

  props: {
    // 表格行key
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    // 已选定项
    items: {
      type: Array,
      default: () => []
    },
    selection: Boolean, // 是否开启首列选择框
    showId: {
      type: Boolean,
      default: true
    }, // 是否显示id字段
    showCreatedAt: Boolean, // 是否显示创建时间
    showUpdatedAt: Boolean, // 是否显示更新时间
    hiddenAction: Boolean,
    nameKey: {
      type: String,
      default: 'name'
    }
  },
  data: () => ({
    initialLoading: true,
    loading: true,
    resourceResponse: null,
    resources: [],
    actions: [],
    lenses: [],
    links: [],
    cards: [],
    search: '',
    filters: {},
    orderBy: '',
    orderByDirection: '',
    trashed: false,
    page: 1,
    perPage: 15,
    resourceTotal: 0
  }),

  /**
   * Mount the component and retrieve its initial data.
   */
  async created() {
    this.initializeSearchFromQueryString()
    this.initializePerPageFromQueryString()
    this.initializeTrashedFromQueryString()
    this.initializeOrderingFromQueryString()
    this.initializeFiltersFromQueryString()

    await this.getResources()

    this.initialLoading = false

    await this.getLenses()

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
     * Get the resources based on the current page, search, filters, etc.
     */
    getResources() {
      this.$nextTick(() => {
        return Minimum(
          axios.get('/' + this.resourceName, {
            params: this.resourceRequestQueryString
          }),
          300
        )
          .then(res => {
            if (res.status === 200) {
              if (_.isNil(res.data.data)) {
                this.resources = []
                this.resourceResponse = null
                this.resourceTotal = 0
              } else {
                this.resources = res.data.data
                this.resourceResponse = res.data
                this.perPage = _.get(
                  res,
                  'data.pagination.per_page',
                  this.currentPerPage
                )
                this.resourceTotal = res.data.pagination.total
              }
            }

            this.loading = false

            //   this.getAllMatchingResourceCount()
            this.$Bus.$emit('resources-loaded')
          })
          .catch(({ response }) => {
            this.$message.error(JSON.stringify(response.data))
            this.loading = false
          })
      })
    },

    /**
     * Execute a search against the resource.
     */
    performSearch(event) {
      this.debouncer(() => {
        console.log(event)
        // Only search if we're not tabbing into the field
        if (event.which != 9) {
          this.updateQueryString({
            [this.pageParameter]: 1,
            [this.searchParameter]: this.search
          })
        }
      })
    },

    debouncer: _.debounce(callback => callback(), 500),

    /**
     * Get the lenses available for the current resource.
     */
    getLenses() {
      this.lenses = []
      return axios.get(this.lensesEndpoint).then(response => {
        this.lenses = response.data
      })
    },
    /**
     * Sync the current search value from the query string.
     */
    initializeSearchFromQueryString() {
      this.search = this.currentSearch
    },

    /**
     * Sync the current order by values from the query string.
     */
    initializeOrderingFromQueryString() {
      this.orderBy = this.currentOrderBy
      this.orderByDirection = this.currentOrderByDirection
    },

    /**
     * Sync the trashed state values from the query string.
     */
    initializeTrashedFromQueryString() {
      this.trashed = this.currentTrashed
    },

    /**
     * Update the trashed constraint for the resource listing.
     */
    trashedChanged(trashedStatus) {
      this.trashed = trashedStatus
      this.updateQueryString({ [this.trashedParameter]: this.trashed })
    },

    /**
     * Update the per page parameter in the query string
     */
    updatePerPageChanged(perPage) {
      this.perPage = perPage
      this.perPageChanged()
    },

    /**
     * Update the desired amount of resources per page.
     */
    perPageChanged() {
      this.updateQueryString({ [this.perPageParameter]: this.perPage })
    },

    // 携带软删除显示参数
    withTrashedToQueryString(withTrashed) {
      return withTrashed ? { [this.trashedParameter]: this.trashed } : {}
    },

    /**
     * Select the next page.
     */
    selectPage(page) {
      this.page = page
      this.updateQueryString({ [this.pageParameter]: page })
    },

    // 排序方法
    sortChange({ column, prop, order }) {
      let field = !_.isNil(column.formatter) ? column.formatter() : prop

      this.orderBy = prop
      this.orderByDirection =
        order === 'descending' ? -1 : order === 'ascending' ? 1 : null
      this.updateQueryString({
        [this.orderByParameter]: this.orderBy,
        [this.orderByDirectionParameter]: this.orderByDirection
      })
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
    },

    /**
     * Sync the per page values from the query string.
     */
    initializePerPageFromQueryString() {
      this.perPage = this.$route.query[this.perPageParameter] || 15
    },
    /**
     * Sync the filters values from the query string.
     */
    initializeFiltersFromQueryString() {
      this.filters = this.currentFilters
    },

    async indexDeleteResourceHandler(resource) {
      try {
        if (resource.SoftDeleted) {
          // 硬删除
          await this.forceDeleteResourceHandler(resource)
          let index = this.resources.findIndex(
            item => item.id.value == resource.id.value
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
            item => item.id.value == resource.id.value
          )
          if (index > -1) {
            if (this.trashed) {
              let deletedAt = _.find(resource.fields, [
                'attribute',
                'deleted_at'
              ])
              if (deletedAt) {
                deletedAt.value = now()
              }
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
        this.$confirm(`是否删除id[${_.get(resource, 'id.value')}]`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            axios
              .delete(this.deleteResourceEndpoint(resource.id.value))

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
        this.$confirm(
          `是否永久删除id[${_.get(resource, 'id.value')}]`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            axios
              .delete(this.forceDeleteResourceEndpoint(resource.id.value))
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
      this.$confirm(`是否恢复id[${_.get(resource, 'id.value')}]`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          axios
            .put(this.restoreResourceEndpoint(resource.id.value))
            .then(() => {
              let deletedAt = _.find(resource.fields, [
                'attribute',
                'deleted_at'
              ])
              if (deletedAt) {
                deletedAt.value = null
              }
            })
            .catch(({ response }) => {
              console.error(response)
            })
        })
        .catch(() => {})
    },

    resolveComponentName(index, fields) {
      if (fields[index].prefix_component) {
        return `index-${fields[index].component}`
      }
      return fields[index].component
    },

    colKey(field) {
      return _.uniqueId(field.attribute)
    }
  },
  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },

    title() {
      return _.get(this, '$route.meta.Title', this.resourceName)
    },

    tableName() {
      return this.resourceName + '_table'
    },

    /**
     * Build the resource request query string.
     */
    resourceRequestQueryString() {
      return {
        search: this.currentSearch,
        filters: this.encodedFilters,
        order_by: this.currentOrderBy,
        order_direction: this.currentOrderByDirection,
        per_page: this.currentPerPage,
        trashed: this.currentTrashed,
        page: this.currentPage
      }
    },
    /**
     * Determine if the resource should show any cards
     */
    shouldShowCards() {
      // Don't show cards if this resource is beings shown via a relations
      return this.cards.length > 0
    },
    // 是否显示Lenses
    shouldShowLenses() {
      return this.lenses.length > 0 || this.links.length > 0
    },
    shouldShowActions() {
      return !!!this.hiddenAction
    },
    /**
     * Get the endpoint for this resource's metrics.
     */
    cardsEndpoint() {
      return `/cards/${this.resourceName}`
    },
    /**
     * Get the endpoint for this resource's lenses.
     */
    lensesEndpoint() {
      return `/lenses/${this.resourceName}`
    },
    // 删除资源api
    deleteResourceEndpoint() {
      return id => `/${this.resourceName}/${id}`
    },
    // 硬删除资源api
    forceDeleteResourceEndpoint() {
      return id => `/${this.resourceName}/${id}/force`
    },
    // 恢复资源api
    restoreResourceEndpoint() {
      return id => `/${this.resourceName}/${id}/restore`
    },
    /**
     * Get the current search value from the query string.
     */
    currentSearch() {
      return this.$route.query[this.searchParameter] || ''
    },

    /**
     * Get the current order by value from the query string.
     */
    currentOrderBy() {
      return this.$route.query[this.orderByParameter] || ''
    },

    /**
     * Get the current order by direction from the query string.
     */
    currentOrderByDirection() {
      return this.$route.query[this.orderByDirectionParameter] || -1
    },

    /**
     * Get the current trashed constraint value from the query string.
     */
    currentTrashed() {
      return this.$route.query[this.trashedParameter] || false
    },

    /**
     * Get the current per page value from the query string.
     */
    currentPerPage() {
      return parseInt(this.$route.query[this.perPageParameter] || this.perPage)
    },

    /**
     * Get the current page from the query string.
     */
    currentPage() {
      return parseInt(this.$route.query[this.pageParameter] || 1)
    },

    /**
     * Get the name of the search query string variable.
     */
    searchParameter() {
      return this.resourceName + '_search'
    },

    /**
     * Get the name of the order by query string variable.
     */
    orderByParameter() {
      return this.resourceName + '_order'
    },

    /**
     * Get the name of the order by direction query string variable.
     */
    orderByDirectionParameter() {
      return this.resourceName + '_direction'
    },

    /**
     * Get the name of the trashed constraint query string variable.
     */
    trashedParameter() {
      return this.resourceName + '_trashed'
    },

    /**
     * Get the name of the per page query string variable.
     */
    perPageParameter() {
      return this.resourceName + '_per_page'
    },

    /**
     * Get the name of the page query string variable.
     */
    pageParameter() {
      return this.resourceName + '_page'
    },

    // 搜索框提示
    searchInputPlaceholder() {
      return this.searchPlaceholder
        ? this.searchPlaceholder
        : this.title
        ? `请输入${this.title}名称`
        : '请输入关键词'
    },

    headings() {
      return _.get(this, '$route.meta.Headings', [])
    }
  }
}
</script>
