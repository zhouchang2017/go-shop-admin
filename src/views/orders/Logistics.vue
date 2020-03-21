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
      <div class="ml-auto flex items-center">
        <router-link
          title="编辑"
          :to="{
            name: `orders.shipment`,
            params: { id: resourceId }
          }"
          class="el-button--small rounded-lg hover:opacity-75 inline-block bg-blue-500 text-white"
        >
          <icons-icon type="icons-edit" class="h-6 w-6" />
        </router-link>
      </div>
    </div>

    <div v-loading="loading">
      <div class="min-h-500">
        <div class="flex flex-col " v-if="!initialLoading">
          <div
            v-for="(shipped, index) in logistics"
            :key="index"
            class="bg-white rounded-lg overflow-hidden mb-3 shadow-lg"
          >
            <div
              class="sm:flex-row sm:items-center flex flex-col sm:justify-between w-full text-xs bg-gray-100 p-3 "
            >
              <div class="text-gray-800 font-bold">
                门店：{{ shipped.shop.name }}
              </div>
            </div>
            <div
              class="flex w-full p-3"
              v-for="item in shipped.items"
              :key="item.item.id"
            >
              <div class="mr-3">
                <el-image
                  class="h-12 w-12 rounded"
                  fit="cover"
                  width="100%"
                  :src="item.item.avatar"
                  lazy
                ></el-image>
              </div>
              <div class="flex-1">
                <div class="text-xs text-gray-800">
                  {{ item.item.product.name }}
                </div>
                <div class="text-xs font-bold text-gray-700">
                  {{ item.item.code }}
                </div>
                <div class="text-xs text-gray-500">
                  {{
                    item.item.option_values.map(value => value.name).join(' ')
                  }}
                </div>
              </div>
            </div>
            <div
              class="sm:flex-row sm:items-center flex flex-col sm:justify-between w-full text-xs bg-gray-100 p-3 "
            >
              <div class="text-gray-700">
                {{ shipped.on_delivery ? '无需物流' : shipped.delivery_name }}
              </div>
              <div v-if="!shipped.on_delivery" class="text-gray-500">
                {{ shipped.track_no }}
              </div>
            </div>
            <div class="p-3">
              <el-timeline :reverse="true">
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :timestamp="activity.timestamp"
                >
                  {{ activity.content }}
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  name: 'order-logistics',
  components: {},
  inject: ['reload'],

  data() {
    return {
      resource: null,
      initialLoading: true,
      loading: true,
      isWorking: false,
      shops: [],
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13'
        },
        {
          content: '创建成功',
          timestamp: '2018-04-11'
        }
      ]
    }
  },
  methods: {
    /**
     * Initialize the compnent's data.
     */
    async initializeComponent() {
      try {
        await this.getShops()
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
        axios.get('/api/' + this.resourceName + '/' + this.resourceId)
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
    getShops() {
      return Minimum(axios.get('/api/shops?page=-1'))
        .then(({ data }) => {
          this.shops = data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    initResource() {
      this.resource.logistics.forEach(shipped => {
        shipped.items.forEach(item => {
          let find = this.items.find(o => o.item.id === item.item_id).item
          this.$set(item, 'item', find)
        })
        let shop = this.shops.find(s => s.id === shipped.items[0].shop_id)
        this.$set(shipped, 'shop', shop)
      })
    }
  },
  computed: {
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
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
    addressString() {
      let userAddress = _.get(this, 'resource.user_address', {})
      return `${userAddress.province}${userAddress.city}${userAddress.areas}${userAddress.addr}，收件人：${userAddress.contact_name}，联系电话：${userAddress.contact_phone}`
    },
    // 已发货信息
    logistics() {
      return _.get(this, 'resource.logistics', [])
    },
    // 状态值
    status() {
      return _.get(this, 'resource.status')
    }
  },
  /**
   * Mount the component.
   */
  mounted() {
    this.initializeComponent()
  }
}
</script>

<style></style>
