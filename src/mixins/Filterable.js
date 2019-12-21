export default {
  data: () => ({
    filters: {}
  }),

  methods: {
    filtersChanged() {
      this.updateQueryString(this.optionsToBase64())
    },

    optionsToBase64() {
      let cloneFilter = _.cloneDeep(this.filters)
      if (!_.isEmpty(this.filters.options)) {
        console.log(JSON.stringify(cloneFilter.options))
        cloneFilter.options = btoa(
          encodeURIComponent(JSON.stringify(cloneFilter.options))
        )
      }
      return cloneFilter
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
      let filters = {}
      _.each(this.filters, (v, k) => {
        if (k === 'options') {
          filters[k] = !_.isEmpty(this.$route.query[k])
            ? this.b64Decode(this.$route.query[k])
            : v
        } else {
          filters[k] = this.$route.query[k] || v
        }
      })
      return filters
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
