export default {
  methods: {
    deleteResource(resourceName, resourceId, callback = null) {
      return axios.delete(`/${resourceName}/${resourceId}`).then(callback)
    },

    /**
     * Force delete the given resources.
     */
    forceDeleteResource(resourceName, resourceId, callback = null) {
      return axios.delete(`/${resourceName}/${resourceId}/force`).then(callback)
    },

    /**
     * Restore the given resource.
     */
    restoreResource(resourceName, resourceId, callback = null) {
      return axios.put(`/${resourceName}/${resourceId}/restore`).then(callback)
    }
  }
}
