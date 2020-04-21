<template>
  <div class="flex flex-col">
    <div class="flex items-center mb-3">
      <router-link
        title="返回"
        :to="{
          name: `orders.detail`,
          params: { id: resourceId }
        }"
        class="font-bold font-mono hover:text-blue-500 hover:font-bold mr-2"
      >
        <icons-icon type="icons-allow-left" class="h-6 w-6" />
      </router-link>
      <heading :level="1" class="flex-no-shrink">{{
        $route.meta.Title
      }}</heading>
    </div>

    <div v-loading="loading">
      <refund-item
        v-for="refund in refunds"
        :key="refund.id"
        :refund="refund"
        :orderId="id"
        :orderNo="orderNo"
      />
    </div>
  </div>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  name: 'order-logistics',
  components: {
    'refund-item': () => import('./RefundItem')
  },
  inject: ['reload'],
  provide() {
    return {
      order: this
    }
  },
  data() {
    return {
      showDialog: false,
      resource: null,
      initialLoading: true,
      loading: true,
      isWorking: false
    }
  },
  methods: {
    /**
     * Initialize the compnent's data.
     */
    async initializeComponent() {
      try {
        await this.getResource()
        this.initResource()
        this.loading = false
        this.initialLoading = false
      } catch (error) {
        console.log(error)
        this.loading = false
        this.initialLoading = false
      }
    },
    /**
     * Get the resource information.
     */
    getResource() {
      this.resource = null

      return Minimum(
        axios.get(
          '/api/' + this.resourceName + '/' + this.resourceId + '/refunds'
        )
      )
        .then(({ data }) => {
          this.resource = data
        })
        .catch(error => {
          if (error.response.status >= 500) {
            this.$Bus.$emit('error', error.response.data.message)
            return
          }

          if (error.response.status === 404 && this.initialLoading) {
            this.$router.push({ name: '404' })
            return
          }

          if (error.response.status === 403) {
            this.$router.push({ name: '403' })
            return
          }

          // this.$toasted.show(this.__('This resource no longer exists'), {
          //   type: 'error'
          // })

          this.$router.push({
            name: 'index',
            params: { resourceName: this.resourceName }
          })
        })
    },
    initResource() {
      this.resource.refunds.forEach(refund => {
        refund.items.forEach(item => {
          let find = this.items.find(o => o.item.id === item.item_id).item
          this.$set(item, 'item', find)
        })
      })
    }
  },
  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    id() {
      return this.resourceId
    },
    resourceId() {
      return _.get(this, '$route.params.id')
    },
    orderNo() {
      return _.get(this, 'resource.order_no', '-')
    },
    createdAt() {
      return _.get(this, 'resource.created_at')
    },
    items() {
      return _.get(this, 'resource.order_items', [])
    },
    // 状态值
    status() {
      return _.get(this, 'resource.status')
    },
    refunds() {
      return _.get(this, 'resource', [])
    }
  },
  /**
   * Mount the component.
   */
  created() {
    this.initializeComponent()
  }
}
</script>

<style></style>
