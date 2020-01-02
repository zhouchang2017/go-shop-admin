<template>
  <div class="flex flex-col">
    <div class="w-full">
      <div class="font-bold text-2xl text-gray-700 mb-3 uppercase">
        {{ $route.meta.Title }}
      </div>
    </div>

    <card class="p-6 flex">
      <div class="flex items-center justify-center w-full">
        <el-tabs v-model="type" class="w-full">
          <el-tab-pane label="入库" name="1">
            <div v-if="type == 1">
              <put-form />
            </div>
          </el-tab-pane>
          <el-tab-pane label="出库" name="2">
            <div v-if="type == 2">
              <take-form />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </card>
  </div>
</template>

<script>
export default {
  name: 'inventoryActionNew',

  components: {
    'put-form': () => import('./Put'),
    'take-form': () => import('./Take')
  },

  data() {
    return {
      type: '1'
    }
  },
  methods: {}
}
</script>

<style></style>
