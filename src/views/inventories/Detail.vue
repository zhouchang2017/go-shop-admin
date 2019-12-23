<template>
  <div>
    <DetailHead
      :meta="meta"
      @on-delete="onDelete"
      @on-restore="onRestore"
      @on-force-delete="onForceDelete"
    />

    <div class="card" v-loading="loading">
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
  </div>
</template>

<script>
import {
  getResource,
  deleteResource,
  forceDeleteResource,
  restoreResource
} from '@/api/brand'
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
