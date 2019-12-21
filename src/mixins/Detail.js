export default {
  name: 'resource-deatil-page',
  components: {
    DetailHead: () => import('@/components/detail/DetailHead')
  },
  provide() {
    return {
      resource: () => this.item
    }
  },
  data() {
    return {
      resource: {},
      meta: {},
      loading: false,
      loaded: false
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // $route: 'fetchResource'
  },
  methods: {
    async fetchResource() {
      try {
        this.loading = true
        const { data } = await this.getResource(
          this.$route.params.id,
          this.$route.query
        )
        this.resource = data.data
        this.meta = data.meta
        this.loading = false
      } catch ({ response }) {
        console.error(response)
        this.loading = false
      }
    },
    async onDelete() {
      try {
        let res = await this.deleteResource(this.$route.params.id)
        if (res.status === 200) {
          this.$router.push({
            name: this.$route.meta.IndexRouterName
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      } catch ({ response }) {
        console.log(response)
      }
    },
    async onForceDelete() {
      try {
        let res = await this.forceDeleteResource(this.$route.params.id)
        if (res.status === 200) {
          this.$router.push({
            name: this.$route.meta.IndexRouterName
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      } catch ({ response }) {
        console.log(response)
      }
    },

    async onRestore() {
      try {
        let res = await this.restoreResource(this.$route.params.id)
        if (res.status === 200) {
          this.resource.deleted_at = null
          this.$message({
            message: '恢复成功',
            type: 'success'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    getAttr(obj, key, emptyValue = '-') {
      return _.get(obj, key, emptyValue)
    }
  },
  computed: {
    item() {
      return this.resource
    }
  },
  async created() {
    this.loaded = false
    await this.fetchResource()
    this.loaded = true
  }
}
