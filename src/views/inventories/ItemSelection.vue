<template>
  <el-select
    v-model="selected"
    filterable
    remote
    reserve-keyword
    placeholder="请输入货号"
    :remote-method="remoteMethod"
    :loading="loading"
    :value-key="valueKey"
  >
    <el-option
      v-for="item in resources"
      :key="item[valueKey]"
      :label="optionLabelKey(item)"
      :value="optionValueKey(item)"
    >
      <div class="flex justify-between items-center">
        <el-image
          fit="cover"
          class="h-8 w-8 rounded"
          :src="getAvatar(item)"
          lazy
        ></el-image>
        <p class="text-gray-700">
          {{ item.code }}
        </p>
        <div class=" text-gray-500">
          {{ item.option_values.map(value => value.name).join('/') }}
        </div>
      </div>
    </el-option>
  </el-select>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    endpoint: String,
    optionLabelKey: {
      type: Function,
      default: item => item.code
    },
    optionValueKey: {
      type: Function,
      default: item => item
    },
    valueKey: {
      type: String,
      default: 'id'
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data: () => ({
    loading: false,
    search: '',
    perPage: 50,
    page: 1,
    resources: []
  }),
  mounted() {
    if (this.value) {
      this.resources.push(this.value)
    }
  },
  methods: {
    getAvatar(item) {
      return _.get(item, 'avatar', _.get(item, 'Meta.avatar'))
    },
    remoteMethod(query) {
      this.search = query
      this.getResources()
    },
    // 获取资源.
    getResources() {
      this.$nextTick(() => {
        this.loading = true
        return Minimum(
          axios.get(this.endpoint, {
            params: this.resourceRequestQueryString
          }),
          300
        )
          .then(res => {
            if (res.status === 200) {
              if (_.isNil(res.data.data)) {
                this.resources = []
              } else {
                this.resources = res.data.data
                this.perPage = _.get(
                  res,
                  'data.pagination.per_page',
                  this.perPage
                )
              }
            }
            this.loading = false
          })
          .catch(({ response }) => {
            this.$message.error(JSON.stringify(response.data))
            this.loading = false
          })
      })
    }
  },
  computed: {
    selected: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    // 请求参数
    resourceRequestQueryString() {
      return {
        search: this.search,
        per_page: this.perPage,
        page: this.page
      }
    }
  }
}
</script>
