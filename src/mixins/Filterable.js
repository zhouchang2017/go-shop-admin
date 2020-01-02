export default {
  methods: {
    // filter组件名称
    resolveFilterComponentName(filter) {
      if (filter.prefix_component) {
        return `filters-${filter.component}`
      }
      return filter.component
    },

    /**
     * Clear filters and reset the resource table
     */
    async clearSelectedFilters(lens) {
      if (lens) {
        await this.$store.dispatch(`${this.resourceName}/resetFilterState`, {
          resourceName: this.resourceName,
          lens
        })
      } else {
        await this.$store.dispatch(`${this.resourceName}/resetFilterState`, {
          resourceName: this.resourceName
        })
      }

      this.updateQueryString({
        [this.pageParameter]: 1,
        [this.filterParameter]: ''
      })
    },

    /**
     * Handle a filter state change.
     */
    filterChanged() {
      this.updateQueryString({
        [this.pageParameter]: 1,
        [this.filterParameter]: this.$store.getters[
          `${this.resourceName}/currentEncodedFilters`
        ]
      })
    },

    /**
     * Set up filters for the current view
     */
    async initializeFilters(lens) {
      // Clear out the filters from the store first
      this.$store.commit(`${this.resourceName}/clearFilters`)

      await this.$store.dispatch(`${this.resourceName}/fetchFilters`, {
        resourceName: this.resourceName,
        lens
      })
      await this.initializeState(lens)
    },

    /**
     * Initialize the filter state
     */
    async initializeState(lens) {
      this.initialEncodedFilters
        ? await this.$store.dispatch(
            `${this.resourceName}/initializeCurrentFilterValuesFromQueryString`,
            this.initialEncodedFilters
          )
        : await this.$store.dispatch(`${this.resourceName}/resetFilterState`, {
            resourceName: this.resourceName,
            lens
          })
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

    /**
     * Return the currently encoded filter string from the store
     */
    encodedFilters() {
      return this.$store.getters[`${this.resourceName}/currentEncodedFilters`]
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
      return this.$store.getters[`${this.resourceName}/hasFilters`]
    },

    /**
     * Return the filters from state
     */
    filters() {
      return this.$store.getters[`${this.resourceName}/filters`]
    },

    /**
     * Determine via state whether filters are applied
     */
    filtersAreApplied() {
      return this.$store.getters[`${this.resourceName}/filtersAreApplied`]
    },

    /**
     * Return the number of active filters
     */
    activeFilterCount() {
      return this.$store.getters[`${this.resourceName}/activeFilterCount`]
    }
  }
}
