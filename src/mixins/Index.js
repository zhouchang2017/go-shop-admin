import InteractsWithQueryString from '@/mixins/InteractsWithQueryString'
import Filterable from '@/mixins/Filterable'
import Minimum from '@/utils/minimum'
export default {
  mixins: [Filterable, InteractsWithQueryString],
  data: () => ({
    initialLoading: true,
    loading: true,
    resourceResponse: null,
    resources: [],
    actions: [],
    lenses: [],
    pages: [],
    cards: [],
    search: '',
    filters: {},
    orderBy: '',
    orderByDirection: '',
    trashed: false,
    page: 1,
    perPage: 15,
    resourceTotal: 0
  }),
  methods: {
    /**
     * Get the resources based on the current page, search, filters, etc.
     */
    getResources() {
      this.$nextTick(() => {
        return Minimum(
          axios.get(this.resourcesEndpoint, {
            params: this.resourceRequestQueryString
          }),
          300
        )
          .then(res => {
            if (res.status === 200) {
              if (_.isNil(res.data.data)) {
                this.resources = []
                this.resourceResponse = null
                this.resourceTotal = 0
              } else {
                this.setResources(res.data.data)
                this.resourceResponse = res.data
                this.perPage = _.get(
                  res,
                  'data.pagination.per_page',
                  this.currentPerPage
                )
                this.resourceTotal = res.data.pagination.total
              }
            }

            this.loading = false

            this.$Bus.$emit('resources-loaded')
          })
          .catch(({ response }) => {
            this.$message.error(JSON.stringify(response.data))
            this.loading = false
          })
      })
    },
    /**
     * 设置Resource
     */
    setResources(data) {
      this.resources = data
    },
    /**
     * Execute a search against the resource.
     */
    performSearch(event) {
      this.debouncer(() => {
        console.log(event)
        // Only search if we're not tabbing into the field
        if (event.which != 9) {
          this.updateQueryString({
            [this.pageParameter]: 1,
            [this.searchParameter]: this.search
          })
        }
      })
    },

    debouncer: _.debounce(callback => callback(), 500),

    /**
     * Get the lenses available for the current resource.
     */
    getPages() {
      this.pages = []
      return axios.get(this.pagesEndpoint).then(response => {
        this.pages = response.data
      })
    },

    /**
     * Sync the current search value from the query string.
     */
    initializeSearchFromQueryString() {
      this.search = this.currentSearch
    },

    /**
     * Sync the current order by values from the query string.
     */
    initializeOrderingFromQueryString() {
      this.orderBy = this.currentOrderBy
      this.orderByDirection = this.currentOrderByDirection
    },

    /**
     * Sync the trashed state values from the query string.
     */
    initializeTrashedFromQueryString() {
      this.trashed = this.currentTrashed
    },

    /**
     * Sync the per page values from the query string.
     */
    initializePerPageFromQueryString() {
      this.perPage = this.$route.query[this.perPageParameter] || 15
    },
    /**
     * Sync the filters values from the query string.
     */
    initializeFiltersFromQueryString() {
      this.filters = this.currentFilters
    },

    /**
     * Update the trashed constraint for the resource listing.
     */
    trashedChanged(trashedStatus) {
      this.trashed = trashedStatus
      this.updateQueryString({ [this.trashedParameter]: this.trashed })
    },

    /**
     * Update the per page parameter in the query string
     */
    updatePerPageChanged(perPage) {
      this.perPage = perPage
      this.perPageChanged()
    },

    /**
     * Update the desired amount of resources per page.
     */
    perPageChanged() {
      this.updateQueryString({ [this.perPageParameter]: this.perPage })
    },

    // 携带软删除显示参数
    withTrashedToQueryString(withTrashed) {
      return withTrashed ? { [this.trashedParameter]: this.trashed } : {}
    },

    /**
     * Select the next page.
     */
    selectPage(page) {
      this.page = page
      this.updateQueryString({ [this.pageParameter]: page })
    },

    // 排序方法
    sortChange({ column, prop, order }) {
      let field = !_.isNil(column.formatter) ? column.formatter() : prop

      this.orderBy = prop
      this.orderByDirection =
        order === 'descending' ? -1 : order === 'ascending' ? 1 : null
      this.updateQueryString({
        [this.orderByParameter]: this.orderBy,
        [this.orderByDirectionParameter]: this.orderByDirection
      })
    }
  },
  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },

    resourcesEndpoint() {
      return `/${this.resourceName}`
    },

    title() {
      return _.get(this, '$route.meta.Title', this.resourceName)
    },

    tableName() {
      return this.resourceName + '_table'
    },
    /**
     * Build the resource request query string.
     */
    resourceRequestQueryString() {
      return {
        search: this.currentSearch,
        filters: this.encodedFilters,
        order_by: this.currentOrderBy,
        order_direction: this.currentOrderByDirection,
        per_page: this.currentPerPage,
        trashed: this.currentTrashed,
        page: this.currentPage
      }
    },
    /**
     * Determine if the resource should show any cards
     */
    shouldShowCards() {
      // Don't show cards if this resource is beings shown via a relations
      return this.cards.length > 0
    },
    // 是否显示Lenses
    shouldShowLenses() {
      return this.lenses.length > 0 || this.pages.length > 0
    },
    shouldShowActions() {
      return !!!this.hiddenAction
    },
    /**
     * Get the endpoint for this resource's metrics.
     */
    cardsEndpoint() {
      return `/cards/${this.resourceName}`
    },
    /**
     * Get the endpoint for this resource's lenses.
     */
    lensesEndpoint() {
      return `/lenses/${this.resourceName}`
    },
    pagesEndpoint() {
      return `/pages/${this.resourceName}`
    },
    // 删除资源api
    deleteResourceEndpoint() {
      return id => `/${this.resourceName}/${id}`
    },
    // 硬删除资源api
    forceDeleteResourceEndpoint() {
      return id => `/${this.resourceName}/${id}/force`
    },
    // 恢复资源api
    restoreResourceEndpoint() {
      return id => `/${this.resourceName}/${id}/restore`
    },
    /**
     * Get the current search value from the query string.
     */
    currentSearch() {
      return this.$route.query[this.searchParameter] || ''
    },

    /**
     * Get the current order by value from the query string.
     */
    currentOrderBy() {
      return this.$route.query[this.orderByParameter] || ''
    },

    /**
     * Get the current order by direction from the query string.
     */
    currentOrderByDirection() {
      return this.$route.query[this.orderByDirectionParameter] || -1
    },

    /**
     * Get the current trashed constraint value from the query string.
     */
    currentTrashed() {
      return this.$route.query[this.trashedParameter] || false
    },

    /**
     * Get the current per page value from the query string.
     */
    currentPerPage() {
      return parseInt(this.$route.query[this.perPageParameter] || this.perPage)
    },

    /**
     * Get the current page from the query string.
     */
    currentPage() {
      return parseInt(this.$route.query[this.pageParameter] || 1)
    },

    /**
     * Get the name of the search query string variable.
     */
    searchParameter() {
      return this.resourceName + '_search'
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
     * Get the name of the trashed constraint query string variable.
     */
    trashedParameter() {
      return this.resourceName + '_trashed'
    },

    /**
     * Get the name of the per page query string variable.
     */
    perPageParameter() {
      return this.resourceName + '_per_page'
    },

    /**
     * Get the name of the page query string variable.
     */
    pageParameter() {
      return this.resourceName + '_page'
    },
    // 搜索框提示
    // searchInputPlaceholder() {
    //   return this.searchPlaceholder
    //     ? this.searchPlaceholder
    //     : this.title
    //     ? `请输入${this.title}名称`
    //     : '请输入关键词'
    // },
    // 表头
    headings() {
      return _.get(this, '$route.meta.Headings', [])
    }
  }
}
