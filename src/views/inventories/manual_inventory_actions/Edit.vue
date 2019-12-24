<template>
  <div class="flex flex-col">
    <div class="w-full">
      <div class="font-bold text-2xl text-gray-700 mb-3 uppercase">
        {{ $route.meta.Title }}
      </div>
    </div>

    <template v-if="loaded" v-loading="loading">
      <post-form :ref="formRef" :value="resource" />
      <div class="mb-6"></div>

      <div class="fixed bottom-0 left-0 w-full sm:pl-64">
        <div class="flex w-full bg-white p-3">
          <div class="ml-auto"></div>
          <el-button @click="reset">Reset</el-button>
          <el-button @click="submit" type="primary">Submit</el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { getResource, updateResource } from '@/api/brand'

export default {
  name: 'resource-update-page',
  components: {
    'post-form': () => import('@/views/brands/PostForm')
  },
  data() {
    return {
      loaded: false,
      formRef: 'post-form',
      resource: {
        name: ''
      },
      meta: {},
      loading: false
    }
  },
  methods: {
    async fetchResource() {
      try {
        const { data } = await getResource(
          this.$route.params.id,
          this.$route.query
        )
        this.resource = data.data
        this.meta = data.meta
        this.loaded = true
      } catch ({ response }) {
        console.error(response)
        this.loaded = true
      }
    },
    async submit() {
      const data = await this.$refs[this.formRef].submit()
      try {
        this.loading = true
        let res = await updateResource(this.$route.params.id, data)
        if (res.status === 200) {
          this.$router.push({
            name: this.$route.meta.DetailRouterName,
            params: { id: this.$route.params.id },
            query: { with_trashed: this.withTrashed }
          })
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        }
        this.loading = false
      } catch ({ response }) {
        console.error(response)
        this.loading = false
      }
    },
    reset() {
      this.$refs[this.formRef].reset()
    }
  },
  async created() {
    await this.fetchResource()
  }
}
</script>

<style></style>
