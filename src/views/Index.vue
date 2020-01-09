<template>
  <div class="flex flex-col">
    <div v-if="shouldShowCards">
      <cards
        v-if="smallCards.length > 0"
        :cards="smallCards"
        class="mb-3"
        :resource-name="resourceName"
      />

      <cards
        v-if="largeCards.length > 0"
        :cards="largeCards"
        size="large"
        :resource-name="resourceName"
      />
    </div>

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
                  v-for="link in pages"
                  :key="link.title"
                  :to="{ name: link.router_name }"
                  class="block px-6 py-3 leading-tight hover:bg-gray-200"
                  >{{ link.title }}</router-link
                >
              </div>
            </dropdown>
          </div>
          <filter-box zIndex="100" :count="activeFilterCount" v-if="hasFilters">
            <component
              v-for="filter in filters"
              :key="filter.key"
              :is="resolveFilterComponentName(filter)"
              :resource-name="resourceName"
              :filter-key="filter.key"
              @change="filterChanged"
            />
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
                v-if="row.AuthorizedToView && row.id"
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
                v-if="row.AuthorizedToUpdate && row.id"
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
import Index from '@/mixins/Index'
import Filterable from '@/mixins/Filterable'
import HasCards from '@/mixins/HasCards'
import Minimum from '@/utils/minimum'
import { now } from '@/utils/time'

export default {
  name: 'Index',
  mixins: [Index, HasCards, Filterable],

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

  /**
   * Mount the component and retrieve its initial data.
   */
  async created() {
    this.initializeSearchFromQueryString()
    this.initializePerPageFromQueryString()
    this.initializeTrashedFromQueryString()
    this.initializeOrderingFromQueryString()

    await this.initializeFilters()
    await this.getResources()

    this.initialLoading = false

    await this.getLenses()

    await this.getPages()

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
  }
}
</script>
