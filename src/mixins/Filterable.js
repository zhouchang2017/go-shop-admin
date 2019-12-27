export default {
  data: () => ({
    filters: {}
  }),

  methods: {
    filtersChanged() {
      this.updateQueryString({ filters: this.encodedFilters })
    },

    toBase64() {
      return btoa(encodeURIComponent(JSON.stringify(this.filters)))
    },
    b64Decode(str) {
      return JSON.parse(decodeURIComponent(atob(str)))
    },

    setFilter(key, value) {
      this.$set(this.filters, key, value)
    },

    removeFilter(key) {
      let obj = {}
      _.each(this.filters, (v, k) => {
        if (k !== key) {
          obj[k] = v
        }
      })
      this.$set(this, 'filters', obj)
    },

    /**
     * Sync the filters values from the query string.
     */
    initializeFiltersFromQueryString() {
      this.filters = this.currentFilters
    }
  },

  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    /**
     * Get the name of the filter query string variable.
     */
    filterParameter() {
      return this.resourceName + '_filter'
    },
    currentFilters() {
      let filters = _.get(this, `$route.query.${this.filterParameter}`)
      if (_.isNil(filters)) {
        return this.filters
      }
      return this.b64Decode(filters)
    },
    /**
     * Return the currently encoded filter string
     */
    encodedFilters() {
      return btoa(encodeURIComponent(JSON.stringify(this.filters)))
    },
    /**
     * Return the initial encoded filters from the query string
     */
    initialEncodedFilters() {
      return this.$route.query[this.filterParameter] || ''
    }
  }

  // created() {
  //   this.initializeFiltersFromQueryString()

  //   this.$watch(
  //     () => this.filters,
  //     () => {
  //       this.filtersChanged()
  //     },
  //     { deep: true }
  //   )
  // }
}
