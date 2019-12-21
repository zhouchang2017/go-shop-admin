<template>
  <div>
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
          <div class="card-item__label">用户名</div>
          <div class="card-item__content">{{ resource.username }}</div>
        </div>
        <div class="card-item">
          <div class="card-item__label">昵称</div>
          <div class="card-item__content">{{ resource.nickname }}</div>
        </div>
        <div class="card-item">
          <div class="card-item__label">类型</div>
          <div class="card-item__content">{{ resource.type }}</div>
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
    <div id="所属门店" class="font-bold text-2xl text-gray-700 uppercase mb-3">
      所属门店
    </div>
    <div class="card mb-6" v-loading="loading">
      <el-table
        :data="resource.shops"
        class="rounded-lg overflow-hidden"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" prop="id" align="left"> </el-table-column>

        <el-table-column label="名称" prop="name" sortable align="left">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getResource,
  deleteResource,
  forceDeleteResource,
  restoreResource
} from '@/api/admin'
import Detail from '@/mixins/Detail'
export default {
  mixins: [Detail],
  methods: {
    getResource,
    deleteResource,
    forceDeleteResource,
    restoreResource
  }
}
</script>

<style></style>
