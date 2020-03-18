<template>
  <div class="flex flex-col">
    <div class="w-full">
      <div class="font-bold text-2xl text-gray-700 mb-3 uppercase">
        {{ title }}
      </div>
    </div>

    <div class="flex min-h-500" v-loading="loading">
      <component
        :updating="true"
        :originalResource="resource"
        v-if="!initialLoading"
        :is="resolveComponentName()"
      />
    </div>
  </div>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  name: 'resource-update-page',
  data: () => ({
    loading: true,
    initialLoading: true,
    submittedViaUpdateResource: false,
    isWorking: false,
    resource: null
  }),

  components: {
    'put-form': () => import('./Put'),
    'take-form': () => import('./Take')
  },

  /**
   * Mount the component.
   */
  mounted() {
    this.initializeComponent()
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
        axios.get(
          '/api/' + this.resourceName + '/' + this.resourceId + '/inventories'
        )
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

          this.$message({
            message: 'This resource no longer exists',
            type: 'error'
          })

          this.$router.push({
            name: 'index',
            params: { resourceName: this.resourceName }
          })
        })
    },

    /**
     * Resolve the component name.
     */
    resolveComponentName() {
      return this.resource.type === 1 ? 'take-form' : 'put-form'
    }
  },

  computed: {
    resourceId() {
      return _.get(this, '$route.params.id')
    },
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },

    title() {
      return _.get(this, '$route.meta.Title', this.resourceName)
    }
  }
}
</script>

<style></style>
