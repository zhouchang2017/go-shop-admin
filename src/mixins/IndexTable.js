import debounce from 'lodash/debounce'

export default {
  data: () => ({
    // search
    searchParameter: 'search',
    search: '',

    // pagination
    pageParameter: 'page',
    perPageParameter: 'per_page',
    page: 1,
    perPage: 15,
    resourceTotal: 0,

    // sort
    orderBy: '',
    orderByParameter: 'order_by',
    orderByDirection: -1,
    orderDirectionParameter: 'order_direction',

    // filters
    filters: {},

    // trashed
    trashedParameter: 'trashed',
    withTrashed: false
  }),

  methods: {
    /**
     * Debounce function for the search handler
     */
    debouncer: debounce(callback => callback(), 500),

    // Pagination
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

    // 排序方法
    setSort(data) {
      const { prop, order } = data
      this.orderBy = prop
      this.orderByDirection =
        order === 'descending' ? -1 : order === 'ascending' ? 1 : null
    },

    // Filters
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

    // Trashed
    /**
     * Toggle the trashed state of the search
     */
    toggleWithTrashed() {
      this.withTrashed = !this.withTrashed
    },

    /**
     * Enable searching for trashed resources
     */
    enableWithTrashed() {
      this.withTrashed = true
    },

    /**
     * Disable searching for trashed resources
     */
    disableWithTrashed() {
      this.withTrashed = false
    }
  }
}
