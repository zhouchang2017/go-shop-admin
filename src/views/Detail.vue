<template>
  <div>detail</div>
</template>

<script>
import Minimum from '@/utils/minimum'
export default {
  methods: {
    /**
     * Get the resource information.
     */
    getResource() {
      this.resource = null

      return Minimum(axios.get('/' + this.resourceName + '/' + this.resourceId))
        .then(({ data: { panels, resource } }) => {
          this.panels = panels
          this.resource = resource
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

          this.$toasted.show(this.__('This resource no longer exists'), {
            type: 'error'
          })

          this.$router.push({
            name: 'index',
            params: { resourceName: this.resourceName }
          })
        })
    },
    resolveFieldComponent(index, fields) {
      if (fields[index].prefix_component) {
        return `index-${fields[index].component}`
      }
      return fields[index].component
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
