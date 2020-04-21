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
            <div
              class="p-3"
              v-if="
                shipped.track &&
                  shipped.track.actions &&
                  shipped.track.actions.length
              "
            >
              <div
                class="flex text-xs text-gray-500"
                v-for="(item, index) in shipped.track.actions"
                :key="index"
              >
                <div class="w-1/4 flex flex-col mt-2 items-end">
                  <div
                    :class="[index === 0 ? 'text-gray-600' : '']"
                    class="text-sm"
                  >
                    {{ item.action_time | timeDateStr }}
                  </div>
                  <div>{{ item.action_time | timeTimeStr }}</div>
                </div>
                <div class="w-10 relative">
                  <!-- 竖线 -->
                  <div
                    class="h-full bg-gray-300 absolute top-0"
                    style="left:15px;width:1px;"
                  ></div>
                  <!-- 圆点 -->
                  <div
                    :class="[index === 0 ? 'bg-blue-400' : 'bg-gray-300']"
                    class="w-3 h-3  absolute rounded-full -ml-10 mt-3"
                    style="left:50px"
                  ></div>
                  <!-- 时间戳 -->
                </div>
                <div class="w-full flex flex-col mt-2">
                  <div :class="[index === 0 ? 'text-sm text-gray-700' : '']">
                    {{ actionTypeToString(item.action_type) }}
                  </div>
                  <div :class="[index === 0 ? 'text-gray-700' : '']">
                    {{ item.action_msg }}
                  </div>
                </div>
              </div>
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
      actionTypes: [
        { value: 100001, desc: '揽件阶段-揽件成功' },
        { value: 100002, desc: '揽件阶段-揽件失败' },
        { value: 100003, desc: '揽件阶段-分配业务员' },
        { value: 200001, desc: '运输阶段-更新运输轨迹' },
        { value: 300002, desc: '派送阶段-开始派送' },
        { value: 300003, desc: '派送阶段-签收成功' },
        { value: 300004, desc: '派送阶段-签收失败' },
        { value: 400001, desc: '异常阶段-订单取消' },
        { value: 400002, desc: '异常阶段-订单滞留' }
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
        this.getTracks()
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
    getTracks() {
      this.resource.logistics.forEach(shipped => {
        axios
          .get(`/tracks/${shipped.delivery_id}/${shipped.track_no}`)
          .then(({ data }) => {
            this.$set(shipped, 'track', data)
          })
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
    },
    actionTypeToString(type) {
      return this.actionTypes.find(item => item.value === type).desc
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
