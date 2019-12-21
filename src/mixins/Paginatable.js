export default {
  data: () => ({
    pageParameter: 'page',
    perPageParameter: 'per_page',
    page: 1,
    perPage: 15,
    resourceTotal: 0
  }),

  watch: {
    page: function(value, oldValue) {
      if (value !== oldValue) {
        this.pageChanged()
      }
    },
    perPage: function(value, oldValue) {
      if (value !== oldValue) {
        this.perPageChanged()
      }
    }
  },

  methods: {
    setPerPage(perPage) {
      this.perPage = perPage
    },

    setPage(page) {
      this.page = page
    },
    /**
     * 前一页
     */
    selectPreviousPage() {
      this.page = this.currentPage - 1
      // this.updateQueryString({page: this.currentPage - 1})
    },

    /**
     * 下一页
     */
    selectNextPage() {
      this.page = this.currentPage + 1
      // this.updateQueryString({page: this.currentPage + 1})
    },
    /**
     * Sync the per page values from the query string.
     */
    initializePerPageFromQueryString() {
      this.perPage = this.currentPerPage
    },

    /**
     * Sync the page values from the query string.
     */
    initializePageFromQueryString() {
      this.page = this.currentPage
    },

    /**
     * Update the desired amount of resources per page.
     */
    perPageChanged() {
      this.updateQueryString({ [this.perPageParameter]: this.perPage })
    },

    /**
     * Update the desired amount of resources page.
     */
    pageChanged() {
      this.updateQueryString({ [this.pageParameter]: this.page })
    }
  },

  computed: {
    /**
     * Get the current page from the query string.
     */
    currentPage() {
      return parseInt(this.$route.query[this.pageParameter] || 1)
    },
    /**
     * Get the current per page value from the query string.
     */
    currentPerPage() {
      return parseInt(this.$route.query[this.perPageParameter] || this.perPage)
    }
  },

  created() {
    this.initializePageFromQueryString()
    this.initializePerPageFromQueryString()
  }
}
