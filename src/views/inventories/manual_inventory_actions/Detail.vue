<template>
  <div class="flex">
    <div class="w-full mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
      <DetailHead
        id="库存操作详情"
        :meta="meta"
        @on-delete="onDelete"
        @on-restore="onRestore"
        @on-force-delete="onForceDelete"
      >
        <el-button>提交</el-button>
      </DetailHead>

      <div class="card mb-6" v-loading="loading">
        <div class="card-body">
          <div class="card-item">
            <div class="card-item__label">ID</div>
            <div class="card-item__content">{{ resource.id }}</div>
          </div>
          <div class="card-item">
            <div class="card-item__label">门店</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'shop.name') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">操作类型</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'type') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">状态</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'status') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">操作者</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'user.nickname') }}
            </div>
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
          <div class="card-item" v-if="resource.deleted_at">
            <div class="card-item__label">删除时间</div>
            <div class="card-item__content">
              {{ resource.deleted_at | timeStr }}
            </div>
          </div>
        </div>
      </div>
      <div
        id="商品列表"
        class="font-bold text-2xl text-gray-700 uppercase mb-3"
      >
        商品列表
      </div>
      <div class="card mb-6 rounded-lg overflow-hidden">
        <el-table
          v-loading="loading"
          :data="resource.items"
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="货号" prop="code" align="left">
          </el-table-column>
          <el-table-column label="品牌" prop="product.brand.name" align="left">
          </el-table-column>
          <el-table-column
            label="类目"
            prop="product.category.name"
            align="left"
          >
          </el-table-column>

          <el-table-column label="属性值" prop="values" align="left">
            <template slot-scope="{ row }">
              <div class="flex flex-row">
                <div v-for="value in row.option_values" :key="value.id">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="value.code"
                    placement="top"
                  >
                    <code
                      class="markdown text-gray-700 p-1 bg-30 hover:bg-gray-300 hover:font-bold  rounded mr-3 text-xs"
                      >{{ value.value }}</code
                    >
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="status">
            <template slot-scope="{ row }">
              <InventoryStatus :value="row.status" />
            </template>
          </el-table-column>

          <el-table-column label="数量" prop="qty" sortable align="right">
          </el-table-column>
        </el-table>
        <div
          class="flex justify-center rounded-b-lg bg-gray-100 py-3 px-2 text-gray-600 font-bold"
        >
          <div class="ml-auto mr-3">总计数量</div>
          <div>{{ sumQty }}</div>
        </div>
      </div>
    </div>
    <div class="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
      <HashNav>
        <HashNavItem name="库存操作详情" />
        <HashNavItem name="商品列表" />
      </HashNav>
    </div>
  </div>
</template>

<script>
import {
  getResource,
  deleteResource,
  forceDeleteResource,
  restoreResource
} from '@/api/manualInventoryAction'
import Detail from '@/mixins/Detail'
export default {
  mixins: [Detail],
  components: {
    HashNav: () => import('@/components/HashNav'),
    HashNavItem: () => import('@/components/HashNavItem'),
    InventoryStatus: () => import('@/views/inventories/Status')
  },
  methods: {
    getResource,
    deleteResource,
    forceDeleteResource,
    restoreResource
  },
  computed: {
    sumQty() {
      return _.sumBy(this.resource.items, 'qty')
    }
  }
}
</script>

<style></style>
