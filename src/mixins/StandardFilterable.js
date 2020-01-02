// 用于手动过滤
export default {
  data: () => ({
    filters: {},
    originalFilters: {}
  }),
  created() {
    this.originalFilters = _.cloneDeep(this.filters)
  },
  methods: {
    /**
     * Handle a filter state change.
     */
    filterChanged() {
      this.updateQueryString({
        [this.pageParameter]: 1,
        [this.filterParameter]: this.encodedFilters
      })
    },

    /**
     * Sync the filters values from the query string.
     */
    initializeFiltersFromQueryString() {
      if (this.initialEncodedFilters == '') {
        return
      }
      this.filters = JSON.parse(
        decodeURIComponent(atob(this.initialEncodedFilters))
      )
    }
  },

  computed: {
    /**
     * Get the name of the filter query string variable.
     */
    filterParameter() {
      return this.resourceName + '_filter'
    },

    /**
     * Return the currently encoded filter string from the store
     */
    encodedFilters() {
      return btoa(encodeURIComponent(JSON.stringify(this.filters)))
    },

    /**
     * Return the initial encoded filters from the query string
     */
    initialEncodedFilters() {
      return this.$route.query[this.filterParameter] || ''
    },

    /**
     * Determine if the resource has any filters
     */
    hasFilters() {
      return Object.keys(this.filters).length > 0
    },

    activeFilterCount() {
      return _.reduce(
        this.filters,
        (count, item, key) => {
          if (
            JSON.stringify(_.get(this, `originalFilters.${key}`)) !=
            JSON.stringify(item)
          ) {
            count++
          }
          return count
        },
        0
      )
    }
  }
}
