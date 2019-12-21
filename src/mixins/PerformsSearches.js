import debounce from 'lodash/debounce'

export default {
  data: () => ({
    searchParameter: 'search',
    search: ''
  }),

  watch: {
    search: function(value, oldValue) {
      if (value !== oldValue) {
        this.searchChanged()
      }
    }
  },

  methods: {
    /**
     * Update the desired amount of resources search.
     */
    searchChanged() {
      this.debouncer(() => {
        this.updateQueryString({
          [this.searchParameter]: this.search,
          [this.pageParameter]: 1
        })
      }, 500)
    },

    /**
     * Debounce function for the search handler
     */
    debouncer: debounce(callback => callback(), 500),

    /**
     * Sync the search values from the query string.
     */
    initializeSearchFromQueryString() {
      this.search = this.currentSearch
    }
  },

  computed: {
    /**
     * Get the current search value from the query string.
     */
    currentSearch() {
      return this.$route.query[this.searchParameter] || ''
    }
  },

  created() {
    this.initializeSearchFromQueryString()
  }
}
