<template>
  <div class="ease-sku-group">
    <div class="group-title bg-gray-200 rounded">
      <el-button size="mini" @click="onClick">添加规格项目</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onClick: {
      type: Function
    }
  }
}
</script>

<style lang="scss">
.ease-sku-group {
  .group-title {
    padding: 7px 10px;
    color: #666;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
}
</style>
