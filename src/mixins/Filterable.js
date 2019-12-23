export default {
  data: () => ({
    filters: {}
  }),

  methods: {
    filtersChanged() {
      this.updateQueryString({ filters: this.toBase64() })
    },

    toBase64() {
      return btoa(encodeURIComponent(JSON.stringify(this.filters)))
    },
    b64Decode(str) {
      return JSON.parse(decodeURIComponent(atob(str)))
    },

    /**
     * Sync the filters values from the query string.
     */
    initializeFiltersFromQueryString() {
      this.filters = this.currentFilters
    }
  },

  computed: {
    currentFilters() {
      let filters = _.get(this, '$route.query.filters')
      if (_.isNil(filters)) {
        return this.filters
      }
      return this.b64Decode(filters)
    }
  },

  created() {
    this.initializeFiltersFromQueryString()

    this.$watch(
      () => this.filters,
      () => {
        this.filtersChanged()
      },
      { deep: true }
    )
  }
}
