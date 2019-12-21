<template>
  <div class="flex">
    <div class="w-full mx-auto lg:ml-0 lg:mr-auto xl:mx-0 xl:w-3/4">
      <DetailHead
        :meta="meta"
        @on-delete="onDelete"
        @on-restore="onRestore"
        @on-force-delete="onForceDelete"
      />

      <div class="card mb-6" v-loading="loading">
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
          <div class="card-item" v-if="resource.deleted_at">
            <div class="card-item__label">删除时间</div>
            <div class="card-item__content">
              {{ resource.deleted_at | timeStr }}
            </div>
          </div>
        </div>
      </div>
      <div id="地址" class="font-bold text-2xl text-gray-700 uppercase mb-3">
        地址
      </div>
      <div class="card mb-6">
        <div class="card-body">
          <div class="card-item">
            <div class="card-item__label">省份</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'address.province') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">城市</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'address.city') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">区/县</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'address.areas') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">详细地址</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'address.addr') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">联系人</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'address.name') }}
            </div>
          </div>
          <div class="card-item">
            <div class="card-item__label">联系电话</div>
            <div class="card-item__content">
              {{ getAttr(resource, 'address.phone') }}
            </div>
          </div>
        </div>
      </div>
      <div id="位置" class="font-bold text-2xl text-gray-700 uppercase mb-3">
        位置
      </div>
      <div class="card mb-6">
        <MapView :location="resource.location" />
      </div>

      <div id="成员" class="font-bold text-2xl text-gray-700 uppercase mb-3">
        成员
      </div>
      <div class="card mb-6" v-loading="loading">
        <el-table
          :data="resource.members"
          class="rounded-lg overflow-hidden"
          fit
          highlight-current-row
          style="width: 100%;"
        >
          <el-table-column label="ID" prop="id" align="left"> </el-table-column>

          <el-table-column label="昵称" prop="nickname" sortable align="left">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="hidden xl:text-sm xl:block xl:w-1/4 xl:px-6">
      <HashNav>
        <HashNavItem name="门店详情" />
        <HashNavItem name="地址" />
        <HashNavItem name="位置" />
        <HashNavItem name="成员" />
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
} from '@/api/shop'
import Detail from '@/mixins/Detail'
export default {
  mixins: [Detail],
  components: {
    MapView: () => import('@/components/baidu/MapView'),
    HashNav: () => import('@/components/HashNav'),
    HashNavItem: () => import('@/components/HashNavItem')
  },
  methods: {
    getResource,
    deleteResource,
    forceDeleteResource,
    restoreResource
  }
}
</script>

<style></style>
