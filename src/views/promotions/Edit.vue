<template>
  <div class="flex flex-col">
    <div class="w-full">
      <div class="font-bold text-2xl text-gray-700 mb-3 uppercase">
        {{ $route.meta.Title }}
      </div>
    </div>

    <template v-if="!initialLoading" v-loading="loading">
      <post-form :ref="formRef" :value="resource" />
      <div class="flex w-full">
        <div class="ml-auto"></div>
        <el-button @click="reset">重置</el-button>
        <el-button
          :loading="isWorking"
          @click="submitViaUpdateResource"
          type="primary"
          >提交</el-button
        >
      </div>
    </template>
  </div>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  name: 'promotionUpdate',
  components: {
    'post-form': () => import('./PostForm')
  },
  data() {
    return {
      formRef: 'post-form',
      resource: {
        name: ''
      },
      meta: {},
      initialLoading: true,
      loading: true,
      isWorking: false
    }
  },
  methods: {
    /**
     * Initialize the compnent's data.
     */
    async initializeComponent() {
      await this.getResource()

      this.initialLoading = false
    },
    /**
     * Get the resource information.
     */
    getResource() {
      this.resource = null

      return Minimum(
        axios.get('/' + this.resourceName + '/' + this.resourceId + '/api')
      )
        .then(({ data }) => {
          this.resource = data
          this.loading = false
        })
        .catch(error => {
          if (error.response.status >= 500) {
            this.$Bus.$emit('error', error.response.data.message)
            return
          }

          if (error.response.status === 404 && this.initialLoading) {
            this.$router.push({ name: '404' })
            return
          }

          if (error.response.status === 403) {
            this.$router.push({ name: '403' })
            return
          }

          // this.$toasted.show(this.__('This resource no longer exists'), {
          //   type: 'error'
          // })

          this.$router.push({
            name: 'index',
            params: { resourceName: this.resourceName }
          })
        })
    },

    async submitViaUpdateResource(e) {
      await this.updateResource()
    },

    /**
     * Create a new resource instance using the provided data.
     */
    async updateResource() {
      this.isWorking = true

      try {
        const formData = await this.$refs[this.formRef].submit()
        console.log(formData)
        const {
          data: { redirect }
        } = await this.updateRequest(formData)

        this.$message({
          message: '更新成功',
          type: 'success'
        })

        this.$router.push({ path: redirect })
      } catch (error) {
        this.isWorking = false

        if (_.has(error, 'response.status') == 422) {
          // this.validationErrors = new Errors(error.response.data.errors)
          this.$message({
            message: 'There was a problem submitting the form.',
            type: 'error'
          })
        }
      }

      this.isWorking = false
    },

    /**
     * Send a create request for this resource
     */
    updateRequest(formData) {
      return axios.put(`/${this.resourceName}/${this.resourceId}`, formData)
    },

    reset() {
      this.$refs[this.formRef].reset()
    }
  },
  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    resourceId() {
      return _.get(this, '$route.params.id')
    }
  },
  /**
   * Mount the component.
   */
  mounted() {
    this.initializeComponent()
  }
}
</script>

<style></style>
