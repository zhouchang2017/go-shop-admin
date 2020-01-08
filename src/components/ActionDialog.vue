<template>
  <div>
    <button
      @click="dialogVisible = true"
      class="block transition-fast hover:translate-r-2px hover:text-gray-900 text-gray-600 font-medium"
    >
      {{ action.name }}
    </button>
    <el-dialog
      append-to-body
      :title="action.name"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>{{ action.confirm_text }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{
          action.cancel_button_text
        }}</el-button>
        <el-button type="primary" @click="dialogVisible = false">{{
          action.confirm_button_text
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    resourceName: String,
    action: {
      type: Object,
      default: () => ({})
    },
    selectedResources: {
      type: [Array, String],
      default: () => []
    }
  },
  data: () => ({
    dialogVisible: false
  })
}
</script>
