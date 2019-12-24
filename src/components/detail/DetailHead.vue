<template>
  <div class="w-full flex items-center mb-3">
    <div class="font-bold text-2xl text-gray-700 uppercase">
      {{ $route.meta.Title }}
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{ title }}?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
    <div class="ml-auto flex items-center">
      <slot />
      <el-button
        title="恢复"
        @click="open(1)"
        v-if="authorizedToRestore && deletedAt"
        size="small"
        class="hover:bg-gray-100 hover:text-gray-500 rounded-lg"
        style="border-style:none;"
      >
        <IIcon viewBox="0 0 20 20" class="h-6 w-6" type="i-restore" />
      </el-button>
      <el-button
        title="删除"
        @click="open(2)"
        v-if="authorizedToDelete"
        size="small"
        class="hover:bg-gray-100 hover:text-gray-500 mr-2 rounded-lg"
        style="border-style:none;"
      >
        <IIcon viewBox="0 0 20 20" class="h-6 w-6" type="i-delete" />
      </el-button>
      <router-link
        title="编辑"
        v-if="authorizedToUpdate"
        :to="{ name: meta.EditRouterName }"
        class="el-button--small rounded-lg hover:opacity-75 inline-block bg-blue-500 text-white"
      >
        <IIcon type="i-edit" class="h-6 w-6" />
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['meta'],
  inject: ['resource'],
  data() {
    return {
      dialogVisible: false,
      action: 'on-delete',
      title: '确定需要删除该资源吗？'
    }
  },
  methods: {
    open(flag) {
      if (flag === 1) {
        this.action = 'on-restore'
        this.title = '确定需要恢复该资源吗？'
      }
      if (flag === 2) {
        this.action = this.deletedAt ? 'on-force-delete' : 'on-delete'
        this.title = this.deletedAt
          ? '确定永久删除该资源吗？'
          : '确定需要删除该资源吗？'
      }
      this.dialogVisible = true
    },
    confirm() {
      this.dialogVisible = false
      this.$emit(this.action)
    }
  },
  computed: {
    authorizedToUpdate() {
      return (
        _.get(this, 'meta.AuthorizedToUpdate', false) &&
        _.get(this, 'meta.EditRouterName')
      )
    },
    authorizedToDelete() {
      return _.get(this, 'meta.AuthorizedToDelete', false)
    },
    authorizedToRestore() {
      return _.get(this, 'meta.AuthorizedToRestore', false)
    },
    item() {
      return this.resource()
    },
    deletedAt() {
      return _.get(this, 'item.deleted_at', null)
    }
  }
}
</script>

<style></style>
