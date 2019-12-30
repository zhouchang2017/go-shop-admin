<template>
  <div class="flex">
    <div class="w-full mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
      <DetailHead
        :meta="meta"
        @on-delete="onDelete"
        @on-restore="onRestore"
        @on-force-delete="onForceDelete"
      />

      <div
        id="产品类目详情"
        class="card mb-6"
        v-loading="loading"
      >
        <div class="card-body">
          <div class="card-item">
            <div class="card-item__label">ID</div>
            <div class="card-item__content">{{ resource.id }}</div>
          </div>
          <div class="card-item">
            <div class="card-item__label">名称</div>
            <div class="card-item__content">{{ resource.name }}</div>
          </div>
          <div class="card-item">
            <div class="card-item__label">创建时间</div>
            <div class="card-item__content">
              {{ resource.created_at | timeStr }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">更新时间</div>
            <div class="card-item__content">
              {{ resource.updated_at | timeStr }}
            </div>
          </div>
          <div
            class="card-item"
            v-if="resource.deleted_at"
          >
            <div class="card-item__label">删除时间</div>
            <div class="card-item__content">
              {{ resource.deleted_at | timeStr }}
            </div>
          </div>
        </div>
      </div>

      <OptionForm
        :option="option"
        v-on:on-close="onClose"
        v-on:on-add-option="onAddOption"
        v-on:on-update-option="onUpdateOption"
        v-model="createDialogVisible"
        :resource="resource"
      />

      <div class="w-full flex items-center mb-3">
        <div
          class="font-bold text-2xl text-gray-700 uppercase"
          id="销售属性"
        >
          销售属性
        </div>

        <div class="ml-auto flex items-center">
          <el-button
            @click="createDialogVisible = true"
            type="primary"
            class="rounded-lg"
          >
            添加
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="resource.options"
        class="rounded-lg overflow-hidden text-80"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="ID"
          prop="id"
          sortable
          align="left"
        >
          <template slot-scope="scope">
            <span class="font-bold">{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="名称"
          prop="name"
          align="left"
        >
          <template slot-scope="scope">
            <span class="font-bold">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="权重"
          prop="sort"
          sortable
          align="left"
        >
          <template slot-scope="scope">
            <span class="font-bold">{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="属性值"
          prop="values"
          align="left"
        >
          <template slot-scope="{ row }">
            <div class="flex flex-row">
              <div
                v-for="value in row.values"
                :key="value.id"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="value.code"
                  placement="top"
                >
                  <code class="markdown inline-block whitespace-no-wrap text-80 p-1 bg-30 hover:bg-white hover:font-bold hover:text-primary rounded mr-3 text-xs">{{ value.value }}</code>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
        <!--Resource Action-->
        <el-table-column
          label="Actions"
          align="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row }">
            <div class="flex flex-row justify-end items-center text-gray-500">
              <!-- Go Resource Edit -->
              <button
                @click="showEdit(row)"
                class="text-gray-500 hover:text-blue-500 mr-3"
                title="编辑"
              >
                <icons-icon type="i-edit" />
              </button>
              <button
                @click="deleteOptionHandle(row)"
                class="text-gray-500 hover:text-blue-500"
              >
                <icons-icon
                  viewBox="0 0 24 20"
                  type="i-delete"
                />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
      <HashNav>
        <HashNavItem name="产品类目详情" />
        <HashNavItem name="销售属性" />
      </HashNav>
    </div>
  </div>
</template>

<script>
import {
  getResource,
  deleteResource,
  forceDeleteResource,
  restoreResource,
  deleteOption
} from '@/api/category'
import Detail from '@/mixins/Detail'

export default {
  mixins: [Detail],
  components: {
    OptionForm: () => import('./OptionForm'),
    HashNav: () => import('@/components/HashNav'),
    HashNavItem: () => import('@/components/HashNavItem')
  },
  data () {
    return {
      createDialogVisible: false,
      option: null
    }
  },
  methods: {
    getResource,
    deleteResource,
    forceDeleteResource,
    restoreResource,
    showEdit (option) {
      this.option = option
      this.createDialogVisible = true
    },
    async deleteOptionHandle (option) {
      this.$confirm(`是否删除[${option.name}]销售属性`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteOption(this.$route.params.id, option.id)
            .then(res => {
              if (res.status === 204) {
                // 删除成功
                this.$message.success('删除成功')
                let index = this.resource.options.findIndex(
                  item => item.id === option.id
                )
                if (index >= 0) {
                  this.resource.options.splice(index, 1)
                }
              }
            })
            .catch(({ response }) => {
              // 资源不存在
              this.$message.error(JSON.stringify(response.data))
            })
        })
        .catch(() => { })
    },
    onAddOption (option) {
      if (!_.has(this, 'resource')) {
        this.$set(this, 'resource.options', [])
      }
      this.resource.options.push(option)
    },
    onUpdateOption (option) {
      let index = this.resource.options.findIndex(item => item.id === option.id)
      if (index >= 0) {
        this.resource.options.splice(index, 1, option)
      }
    },
    onClose () {
      this.option = null
    }
  }
}
</script>

<style></style>
