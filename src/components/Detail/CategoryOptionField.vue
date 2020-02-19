<template>
  <el-table
    :data="field.value"
    class="rounded-lg overflow-hidden"
    fit
    highlight-current-row
    style="width: 100%;"
  >
    <el-table-column
      show-overflow-tooltip
      label="名称"
      prop="name"
      align="left"
    >
    </el-table-column>
    <el-table-column label="缩略图" prop="thumbnail" align="left">
      <template slot-scope="{ row }">
        <status-field :type="row.thumbnail ? 'success' : 'error'" />
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="权重"
      prop="sort"
      align="left"
    >
    </el-table-column>
    <el-table-column label="属性值" prop="values" align="left">
      <template slot-scope="{ row }">
        <div class="flex flex-row flex-wrap" v-if="row.values.length > 0">
          <div v-for="value in row.values" :key="value.id">
            <el-tooltip
              class="item"
              effect="dark"
              :content="value.code"
              placement="top"
            >
              <code
                class="inline-block bg-gray-100 whitespace-no-wrap text-gray-700 px-1 bg-30 hover:bg-white hover:font-bold hover:text-primary rounded mr-3 text-xs"
                >{{ value.value }}</code
              >
            </el-tooltip>
          </div>
        </div>
        <div v-else>-</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field']
}
</script>
