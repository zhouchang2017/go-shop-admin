export default {
  data: () => ({
    orderBy: '',
    orderByDirection: -1
  }),

  methods: {
    // 排序方法
    setSort(data) {
      const { prop, order } = data
      this.orderBy = prop
      this.orderByDirection =
        order === 'descending' ? -1 : order === 'ascending' ? 1 : null
    },

    sortChanged() {
      this.updateQueryString({
        [this.orderByParameter]: this.orderBy,
        [this.orderByDirectionParameter]: this.orderByDirection
      })
    },

    /**
     * Sync the order by values from the query string.
     */
    initializeOrderByFromQueryString() {
      this.orderBy = this.currentOrderBy
    },

    /**
     * Sync the order by direction from the query string.
     */
    initializeOrderByDirectionFromQueryString() {
      this.orderByDirection = this.currentOrderByDirection
    },

    toDirection() {
      return this.currentOrderByDirection === -1
        ? 'descending'
        : this.currentOrderByDirection === 1
        ? 'ascending'
        : null
    }
  },

  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    /**
     * Get the name of the order by query string variable.
     */
    orderByParameter() {
      return this.resourceName + '_order'
    },

    /**
     * Get the name of the order by direction query string variable.
     */
    orderByDirectionParameter() {
      return this.resourceName + '_direction'
    },
    /**
     * Get the current order by from the query string.
     */
    currentOrderBy() {
      return this.$route.query[this.orderByParameter] || ''
    },
    /**
     * Get the current order direction value from the query string.
     */
    currentOrderByDirection() {
      return parseInt(this.$route.query[this.orderByDirectionParameter] || -1)
    },

    tableSortParameter() {
      return { prop: this.currentOrderBy, order: this.toDirection() }
    }
  },

  created() {
    this.initializeOrderByFromQueryString()
    this.initializeOrderByDirectionFromQueryString()
  },

  mounted() {
    this.$watch(
      () => this.orderBy + this.orderByDirection,
      (value, oldValue) => {
        if (value !== oldValue) {
          this.sortChanged()
        }
      }
    )
  }
}
