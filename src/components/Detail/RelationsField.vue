<template>
  <div class="rounded-lg overflow-hidden">
    <div
      v-for="resource in resources"
      :key="resource.id"
      class="w-full bg-white overflow-hidden"
    >
      <div class="sm:flex sm:items-center px-6 py-4">
        <el-avatar
          v-if="resource.avatar !== ''"
          class="block mx-auto sm:mx-0 sm:flex-shrink-0 h-8 w-8 sm:w-16 sm:h-16"
          shape="square"
          :src="resource.avatar"
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
        <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
          <p class="text-xl leading-tight">{{ resource.name }}</p>
          <p class="text-sm leading-tight text-gray-600">
            {{ resource.id }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  data() {
    return {
      page: 1,
      perPage: 15,
      resourceTotal: 0,
      loading: true,
      resourceResponse: null,
      resources: []
    }
  },
  async mounted() {
    let ids = ''
    if (_.isString(this.field.value)) {
      ids = this.field.value
    } else {
      ids = this.field.value.join(',')
    }
    if (ids !== '') {
      await this.resolveResources(ids)
    }
  },
  methods: {
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
    }
  },
  computed: {
    multipleable() {
      return _.get(this, 'field.meta.multiple', false)
    },
    resolveEndpoint() {
      return `/relations/${this.field.resource_name}/resolve`
    }
  }
}
</script>
