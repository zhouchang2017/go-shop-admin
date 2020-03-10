import InteractsWithQueryString from '@/mixins/InteractsWithQueryString'
import Minimum from '@/utils/minimum'
export default {
  mixins: [InteractsWithQueryString],
  props: {
    viaResourceName: String,
    viaResourcesEndpoint: String,
    viaTitle: String,
    viaHeadings: Array,
    loadCards: {
      type: Boolean,
      default: true
    },
    loadActions: {
      type: Boolean,
      default: true
    },
    loadLenses: {
      type: Boolean,
      default: true
    },
    loadPages: {
      type: Boolean,
      default: true
    },
    // 附加查询参数
    extendRequestQueryParams: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    initialLoading: true,
    loading: true,
    resourceResponse: null,
    resources: [],
    actions: [],
    lenses: [],
    pages: [],
    search: '',
    orderBy: '',
    orderByDirection: '',
    trashed: false,
    page: 1,
    perPage: 15,
    resourceTotal: 0
  }),
  methods: {
    // 获取资源.
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
    // 设置Resource
    setResources(data) {
      this.resources = data
    },
    // 搜索
    performSearch(event) {
      this.debouncer(() => {
        // Only search if we're not tabbing into the field
        if (event.which != 9) {
          this.updateQueryString({
            [this.pageParameter]: 1,
            [this.searchParameter]: this.search
          })
        }
      })
    },

    // 防抖
    debouncer: _.debounce(callback => callback(), 500),

    // 获取当前资源可用的聚合页
    getLenses() {
      if (this.loadLenses) {
        this.lenses = []
        return axios.get(this.lensesEndpoint).then(response => {
          this.lenses = response.data
        })
      }
    },

    // 获取当前资源可用的自定义页面
    getPages() {
      if (this.loadPages) {
        this.pages = []
        return axios.get(this.pagesEndpoint).then(response => {
          this.pages = response.data
        })
      }
    },

    // 初始化搜索值，从url中
    initializeSearchFromQueryString() {
      this.search = this.currentSearch
    },

    // 初始化排序，从url中
    initializeOrderingFromQueryString() {
      this.orderBy = this.currentOrderBy
      this.orderByDirection = this.currentOrderByDirection
    },

    // 初始化trashed，从url中
    initializeTrashedFromQueryString() {
      this.trashed = this.currentTrashed
    },

    // 初始化分页步长，从url中
    initializePerPageFromQueryString() {
      this.perPage = this.$route.query[this.perPageParameter] || this.perPage
    },

    // 更新trashed参数
    trashedChanged(trashedStatus) {
      this.trashed = trashedStatus
      this.updateQueryString({ [this.trashedParameter]: this.trashed })
    },

    // 更新分页步长参数
    updatePerPageChanged(perPage) {
      this.perPage = parseInt(perPage)
      this.perPageChanged()
    },

    // 分页步长变化处理
    perPageChanged() {
      this.updateQueryString({ [this.perPageParameter]: this.perPage })
    },

    // 携带软删除显示参数
    withTrashedToQueryString(withTrashed) {
      return withTrashed ? { [this.trashedParameter]: this.trashed } : {}
    },

    // 改变当前页码
    selectPage(page) {
      this.page = parseInt(page)
      this.updateQueryString({ [this.pageParameter]: parseInt(page) })
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
    // 资源名称
    resourceName() {
      return _.isNil(this.viaResourceName)
        ? _.get(this, '$route.meta.ResourceName')
        : this.viaResourceName
    },
    // 资源api
    resourcesEndpoint() {
      return _.isNil(this.viaResourcesEndpoint)
        ? `/${this.resourceName}`
        : this.viaResourcesEndpoint
    },
    // 当前页标题
    title() {
      return _.isNil(this.viaTitle)
        ? _.get(this, '$route.meta.Title', this.resourceName)
        : this.viaTitle
    },
    // Table ref name
    tableName() {
      return this.resourceName + '_table'
    },
    // 请求参数
    resourceRequestQueryString() {
      return {
        search: this.currentSearch,
        filters: _.get(this, 'encodedFilters', ''),
        order_by: this.currentOrderBy,
        order_direction: this.currentOrderByDirection,
        per_page: this.currentPerPage,
        trashed: this.currentTrashed,
        page: this.currentPage,
        ...this.extendRequestQueryParams
      }
    },
    // 是否显示cards
    shouldShowCards() {
      // Don't show cards if this resource is beings shown via a relations
      return this.cards.length > 0
    },
    // 是否显示Lenses
    shouldShowLenses() {
      return this.lenses.length > 0 || this.pages.length > 0
    },
    // 是否显示actions
    shouldShowActions() {
      return !!!this.hiddenAction
    },

    // 自定义聚合api
    lensesEndpoint() {
      return `/lenses/${this.resourceName}`
    },
    // 自定义页面api
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
    // 当前搜索参数
    currentSearch() {
      return this.$route.query[this.searchParameter] || ''
    },

    // 当前排序字段
    currentOrderBy() {
      return this.$route.query[this.orderByParameter] || ''
    },

    // 当前排序方向
    currentOrderByDirection() {
      return this.$route.query[this.orderByDirectionParameter] || -1
    },

    // 当前trashed值
    currentTrashed() {
      return this.$route.query[this.trashedParameter] || false
    },

    // 当前分页步长
    currentPerPage() {
      return parseInt(this.$route.query[this.perPageParameter] || this.perPage)
    },

    // 当前页
    currentPage() {
      return parseInt(this.$route.query[this.pageParameter] || 1)
    },

    // 搜索参数名称
    searchParameter() {
      return this.resourceName + '_search'
    },

    // 排序字段参数名称
    orderByParameter() {
      return this.resourceName + '_order'
    },

    // 排序方向参数名称
    orderByDirectionParameter() {
      return this.resourceName + '_direction'
    },

    // trashed 参数名称
    trashedParameter() {
      return this.resourceName + '_trashed'
    },

    // 分页步长参数名称
    perPageParameter() {
      return this.resourceName + '_per_page'
    },

    // 页面参数名称
    pageParameter() {
      return this.resourceName + '_page'
    },
    // 搜索框提示
    searchInputPlaceholder() {
      return this.searchPlaceholder
        ? this.searchPlaceholder
        : this.title
        ? `请输入${this.title}名称`
        : '请输入关键词'
    },
    // 表头
    headings() {
      let headings = _.isNil(this.viaHeadings)
        ? _.get(this, '$route.meta.Headings', [])
        : this.viaHeadings
      return headings.filter(head => !head.expand)
    },
    expandHeadIndex() {
      let headings = _.isNil(this.viaHeadings)
        ? _.get(this, '$route.meta.Headings', [])
        : this.viaHeadings
      return headings.findIndex(
        head => head.attribute == this.expandHead.attribute
      )
    },
    // expand column
    expandHead() {
      let headings = _.isNil(this.viaHeadings)
        ? _.get(this, '$route.meta.Headings', [])
        : this.viaHeadings
      let head = headings.filter(head => head.expand)
      return head.length > 0 ? head[0] : null
    }
  }
}
