export default {
  data: () => ({
    // 选定资源集合
    selectedResources: []
  }),

  methods: {
    // 批量删除
    deleteSelectionResources() {
      console.log(this.selectedResources)
    },

    // 选定资源变化处理函数
    handleSelectionChange(val) {
      this.selectedResources = val
    },

    // 切换选定资源，无参数则取消所有选择
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.indexTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.indexTable.clearSelection()
      }
    }
  },

  computed: {
    // 是否有选定资源
    hasSelectionResource() {
      return this.selectedResources.length > 0
    }
  }
}
