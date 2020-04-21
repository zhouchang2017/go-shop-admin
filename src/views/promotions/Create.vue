<template>
  <div class="flex flex-col">
    <div class="w-full">
      <div class="font-bold text-2xl text-gray-700 mb-3 uppercase">
        {{ $route.meta.Title }}
      </div>
    </div>

    <post-form :ref="formRef" :value.sync="resource" />
    <div class="flex w-full">
      <div class="ml-auto"></div>
      <el-button @click="reset">重置</el-button>
      <el-button
        @click="submitViaCreateResource"
        :loading="isWorking"
        type="primary"
        >创建</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'promotionNew',

  components: {
    'post-form': () => import('./PostForm')
  },

  data() {
    return {}
  },
  data() {
    return {
      formRef: 'post-form',
      resource: {
        name: ''
      },
      isWorking: false
    }
  },
  methods: {
    async submitViaCreateResource(e) {
      await this.createResource()
    },
    /**
     * Send a create request for this resource
     */
    createRequest(data) {
      return axios.post(`/${this.resourceName}`, data)
    },

    async createResource() {
      this.isWorking = true
      try {
        const formData = await this.$refs[this.formRef].submit()

        const {
          data: { redirect }
        } = await this.createRequest(formData)

        this.$message({
          message: '创建成功',
          type: 'success'
        })

        this.$router.push({ path: redirect })
      } catch (error) {
        this.isWorking = false

        if (_.get(error, 'response.status') == 422) {
          // this.validationErrors = new Errors(error.response.data.errors)
          this.$message({
            message: 'There was a problem submitting the form.',
            type: 'error'
          })
        }
      }

      this.isWorking = false
    },
    reset() {
      this.$refs[this.formRef].reset()
    }
  },
  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    }
  }
}
</script>

<style></style>
