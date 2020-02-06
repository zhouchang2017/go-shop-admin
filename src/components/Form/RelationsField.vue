<template>
  <el-form-item :required="isRequired" :label="field.name" :error="firstError">
    <el-select
      v-model="value"
      :multiple="multipleable"
      :placeholder="placeholder"
      :multipleLimit="multipleLimit"
      filterable
      :remote="searchable"
      reserve-keyword
      :remote-method="performSearch"
      :loading="loading"
    >
      <el-option
        v-for="option in resources"
        :key="option.id"
        :value="option.id"
        :label="option.name"
      >
        <div class="flex items-center">
          <el-avatar
            v-if="option.avatar !== ''"
            :size="28"
            shape="square"
            :src="option.avatar"
          >
            <i class="flex h-full justify-center items-center">
              <svg
                class="block"
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </i>
          </el-avatar>
          <div class="ml-3">{{ option.name }}</div>
        </div>
      </el-option>
      <div
        @click="loadMore"
        class="cursor-pointer hover:bg-gray-100 text-gray-500 text-xs flex items-center justify-center"
      >
        {{ tips }}
      </div>
    </el-select>
  </el-form-item>
</template>

<script>
import FormField from '@/mixins/FormField'
import HandlesValidationErrors from '@/mixins/HandlesValidationErrors'
import Minimum from '@/utils/minimum'

export default {
  mixins: [FormField, HandlesValidationErrors],

  data() {
    return {
      search: '',
      page: 1,
      perPage: 15,
      resourceTotal: 0,
      loading: true,
      resourceResponse: null,
      resources: [],
      initValued: false
    }
  },

  async mounted() {
    await this.initResources()

    this.$watch(
      () => {
        return this.page + this.search
      },
      () => {
        this.getResources()
      }
    )
  },

  methods: {
    async initResources() {
      if (!_.isNil(this.field.value) && !_.isEmpty(this.field.value)) {
        let ids = ''
        if (_.isString(this.field.value)) {
          ids = this.field.value
        } else {
          ids = this.field.value.join(',')
        }
        if (ids !== '') {
          await this.resolveResources(ids)
        }
        this.initValued = true
      } else {
        await this.getResources()
      }
    },
    loadMore() {
      if (this.hasNextPage) {
        if (this.initValued) {
          this.getResources()
          this.initValued = false
        } else {
          this.page++
        }
      }
    },
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
                let items = res.data.data.filter(item => {
                  if (this.multipleable) {
                    return !this.value.includes(item.id)
                  } else {
                    return item.id !== this.value
                  }
                })

                this.resources.push(...items)

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
          })
          .catch(({ response }) => {
            this.$message.error(JSON.stringify(response.data))
            this.loading = false
          })
      })
    },
    // 获取初始资源
    resolveResources(ids) {
      this.$nextTick(() => {
        this.loading = true
        return Minimum(
          axios.get(this.resolveEndpoint, {
            params: {
              ids: ids
            }
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
                this.resources = res.data.data
                this.resourceResponse = res.data
                _.set(this, 'resourceResponse.pagination.has_next_page', true)
              }
            }

            this.loading = false
          })
          .catch(({ response }) => {
            this.$message.error(JSON.stringify(response.data))
            this.loading = false
          })
      })
    },
    // 搜索
    performSearch(search) {
      this.debouncer(() => {
        this.page = 1
        this.search = search
        this.resources = []
        this.resourceResponse = null
        this.resourceTotal = 0
      })
    },

    // 防抖
    debouncer: _.debounce(callback => callback(), 500)
  },

  computed: {
    // 请求参数
    resourceRequestQueryString() {
      let query = {
        page: this.page
      }
      if (this.searchable) {
        query.search = this.search
      }
      return query
    },
    resourcesEndpoint() {
      return `/relations/${this.field.resource_name}/list`
    },
    resolveEndpoint() {
      return `/relations/${this.field.resource_name}/resolve`
    },
    placeholder() {
      return this.field.placeholder || this.field.name
    },
    searchable() {
      return _.get(this, 'field.meta.searchable', false)
    },
    multipleable() {
      return _.get(this, 'field.meta.multiple', false)
    },
    multipleLimit() {
      return _.get(this, 'field.meta.multiple_limit', 0)
    },
    hasNextPage() {
      return _.get(this, 'resourceResponse.pagination.has_next_page', false)
    },
    tips() {
      if (this.loading) {
        return '加载中...'
      }
      return this.hasNextPage ? '加载更多' : '没有更多了'
    }
  }
}
</script>
