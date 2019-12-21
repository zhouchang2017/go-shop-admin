<template>
  <div class="flex flex-col">
    <div class="w-full">
      <div class="font-bold text-2xl text-gray-700 mb-3 uppercase">
        {{ $route.meta.Title }}
      </div>
    </div>

    <post-form :ref="formRef" :value="resource" />
    <div class="mb-6"></div>

    <div class="fixed bottom-0 left-0 w-full sm:pl-64">
      <div class="flex w-full bg-white p-3">
        <div class="ml-auto"></div>
        <el-button @click="reset">Reset</el-button>
        <el-button @click="submit" type="primary">Create</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createResource } from '@/api/shop'
export default {
  name: 'resource-create-page',
  components: {
    'post-form': () => import('./PostForm')
  },
  data() {
    return {
      formRef: 'post-form',
      resource: {
        name: ''
      }
    }
  },
  methods: {
    async submit() {
      const data = await this.$refs[this.formRef].submit()
      try {
        let res = await createResource(data)
        if (res.status === 201) {
          this.$router.push({
            name: this.$route.meta.DetailRouterName,
            params: { id: res.data.id }
          })
          this.$message({
            message: '创建成功',
            type: 'success'
          })
        }
      } catch ({ response }) {
        console.error(response)
      }
    },
    reset() {
      this.$refs[this.formRef].reset()
    }
  }
}
</script>

<style></style>
