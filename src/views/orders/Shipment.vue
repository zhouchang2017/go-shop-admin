<template>
  <div class="flex flex-col">
    <div class="flex items-center mb-3">
      <heading :level="1" class="flex-no-shrink">{{
        $route.meta.Title
      }}</heading>
    </div>
    <el-alert
      v-if="status === 3"
      class="mb-2"
      title="该订单以发货，修改将对物流信息进行更新"
      type="warning"
      show-icon
    >
    </el-alert>

    <div class="card overflow-hidden" v-loading="loading">
      <div class="p-3 bg-gray-100">
        <h4 class="text-gray-600">
          <span class="mr-3 text-gray-800 font-bold">第一步</span
          >确认收货信息，及交易详情
        </h4>
      </div>

      <div class="p-3">
        <div class="border rounded">
          <div
            class="flex rounded-t-lg bg-white items-center p-3 border-b text-gray-500 text-xs border-gray-200"
          >
            <div class="text-gray-700 mr-3">订单号:{{ orderNo }}</div>
            <div class="text-gray-700">创建时间:{{ createdAt | timeStr }}</div>
          </div>
          <el-table
            :data="items"
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="缩略图">
              <template slot-scope="{ row }">
                <el-image
                  class="h-12 w-12 rounded"
                  fit="cover"
                  width="100%"
                  :src="row.item.avatar"
                  lazy
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="货号" prop="item.code">
              <template slot-scope="{ row }">
                <router-link
                  class="cursor-pointer font-bold inline-block hover:text-blue-500"
                  :to="{
                    name: 'products.detail',
                    params: { id: row.item.product.id }
                  }"
                >
                  {{ row.item.code }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="属性值"
              align="left"
              min-width="150"
            >
              <template slot-scope="{ row }">
                {{ row.item.option_values.map(value => value.name).join(' ') }}
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="count" />
            <el-table-column
              min-width="100"
              show-overflow-tooltip
              label="吊牌价"
              align="left"
              prop="item.price"
            >
              <template slot-scope="{ row }">
                {{ row.item.price | money }}
              </template>
            </el-table-column>

            <el-table-column
              min-width="100"
              show-overflow-tooltip
              label="实付款"
              align="left"
              prop="amount"
            >
              <template slot-scope="{ row }">
                {{ row.amount | money }}
              </template>
            </el-table-column>
          </el-table>
          <div class="flex rounded-b-lg bg-gray-100 p-3 text-gray-700 flex-col">
            <div>买家收货信息：{{ addressString }}</div>
            <div>买家留言：</div>
          </div>
        </div>
      </div>

      <div class="p-3 bg-gray-100">
        <h4 class="text-gray-600">
          <span class="mr-3 text-gray-800 font-bold">第二步</span>分配发货门店
        </h4>
      </div>

      <div class="p-3">
        <el-table :data="items" fit highlight-current-row style="width: 100%;">
          <el-table-column label="缩略图">
            <template slot-scope="{ row }">
              <el-image
                class="h-12 w-12 rounded"
                fit="cover"
                width="100%"
                :src="row.item.avatar"
                lazy
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column min-width="150" label="货号" prop="item.code">
            <template slot-scope="{ row }">
              <router-link
                class="cursor-pointer font-bold inline-block hover:text-blue-500"
                :to="{
                  name: 'products.detail',
                  params: { id: row.item.product.id }
                }"
              >
                {{ row.item.code }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="属性值"
            align="left"
            min-width="150"
          >
            <template slot-scope="{ row }">
              {{ row.item.option_values.map(value => value.name).join(' ') }}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="count" />
          <el-table-column label="发货门店" align="left" min-width="200">
            <template slot-scope="{ row }">
              <el-checkbox-group v-model="row.shops" :max="row.count">
                <el-checkbox
                  v-for="shop in shops"
                  :key="shop.id"
                  :label="shop.id"
                  >{{ shop.name }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="p-3 bg-gray-100">
        <h4 class="text-gray-600">
          <span class="mr-3 text-gray-800 font-bold">第三步</span>完善物流信息
        </h4>
      </div>

      <div class="p-3">
        <shipment-select />
      </div>

      <div class="bg-gray-200 p-3 flex">
        <div class="ml-auto">
          <el-button @click="toDetail">返回</el-button>
          <el-button
            :disabled="!hasOptions"
            :loading="isWorking"
            @click="submit"
            type="primary"
            >提交</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  name: 'order-shipment',
  components: {
    'shipment-select': () => import('./ShipmentSelect')
  },
  inject: ['reload'],
  provide() {
    return {
      order: this
    }
  },
  data() {
    return {
      resource: null,
      initialLoading: true,
      loading: true,
      isWorking: false,
      shops: [],
      options: [],
      cacheLogistics: {},
      shippedMap: {},
      once: true
    }
  },
  watch: {
    items: {
      handler(value) {
        this.assignItems()
      },
      deep: true
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
          this.assignShipped()
          this.initLogistics()
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
    assignShipped() {
      // 以itemid分组
      let shippedMap = this.logistics.reduce((res, shipped) => {
        shipped.items.forEach(item => {
          let shop = this.shops.find(shop => shop.id === item.shop_id)

          if (_.has(res, item.item_id)) {
            res[item.item_id].push({ ...shipped, shop, shop_id: item.shop_id })
          } else {
            res[item.item_id] = [{ ...shipped, shop, shop_id: item.shop_id }]
          }
        })
        return res
      }, {})
      this.$set(this, 'shippedMap', shippedMap)
    },
    initLogistics() {
      this.resource.order_items.forEach(item => {
        let shops = []
        if (_.has(this.shippedMap, item.item.id)) {
          shops = this.shippedMap[item.item.id].map(shipped => shipped.shop_id)
        }
        this.$set(item, 'shops', shops)
      })
      // 设置缓存
      this.logistics.forEach(shipped => {
        let shopId = _.get(shipped, 'items[0].shop_id')
        this.setCacheLogistics(shopId, {
          delivery_id: shipped.delivery_id,
          track_no: shipped.track_no,
          no_delivery: shipped.no_delivery
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
    setCacheLogistics(shopId, opt) {
      this.$set(this.cacheLogistics, shopId, opt)
    },
    getCacheLogistics(id, key, value = null) {
      return _.get(this.cacheLogistics, `${id}.${key}`, value)
    },

    // 分配发货门店
    assignItems() {
      this.options = this.items.reduce((res, item) => {
        let obj = {
          item_id: item.item.id,
          item: item.item,
          orderItem: item,
          count: 1
        }
        if (item.shops.length === 1) {
          obj.count = item.count
        }
        item.shops.forEach(id => {
          let data = res.find(col => col.shop_id === id)
          if (data) {
            // 首次，设置已选择数量
            if (this.once) {
              if (_.has(this.shippedMap, item.item.id)) {
                let shippeds = this.shippedMap[item.item.id]
                let find = shippeds.find(shipped => shipped.shop_id === id)
                if (find) {
                  let findItem = find.items.find(
                    i => i.item_id === item.item.id
                  )
                  if (findItem) {
                    obj.count = findItem.count
                  }
                }
              }
            }
            data.items.push(obj)
          } else {
            res.push({
              delivery_id: this.getCacheLogistics(id, 'delivery_id'),
              track_no: this.getCacheLogistics(id, 'track_no'),
              no_delivery: this.getCacheLogistics(id, 'no_delivery', false),
              shop_id: id,
              shop: this.shops.find(shop => shop.id === id),
              items: [obj]
            })
          }
        })
        return res
      }, [])
      this.once = false
    },
    validateOptions() {
      return new Promise((resolve, reject) => {
        this.options.forEach(option => {
          if (!option.no_delivery) {
            if (!option.delivery_id || !option.track_no) {
              return reject(new Error(`请完善${option.shop.name}门店物流信息`))
            }
          }
        })
        resolve(
          this.options.map(option => {
            return {
              delivery_id: option.delivery_id,
              no_delivery: option.no_delivery,
              shop_id: option.shop_id,
              track_no: option.track_no,
              items: option.items.map(item => {
                return {
                  count: item.count,
                  item_id: item.item_id,
                  shop_id: option.shop_id
                }
              })
            }
          })
        )
      })
    },
    async submit() {
      this.isWorking = true
      try {
        const formData = await this.validateOptions()

        let { data } = await this.submitRequest({ options: formData })
        this.isWorking = false
        this.reload()
      } catch (error) {
        this.isWorking = false

        if (_.get(error, 'response.status') == 422) {
          console.log(error.response)
          // this.validationErrors = new Errors(error.response.data.errors)
          this.$message({
            message: _.get(
              error,
              'response.data.message',
              'There was a problem submitting the form.'
            ),
            type: 'error'
          })
        } else {
          this.$message({
            message: error.message,
            type: 'error'
          })
        }
      }
      this.isWorking = false
    },
    /**
     * Send a submit request for this resource
     */
    submitRequest(data) {
      return axios.post(
        `/${this.resourceName}/${this.resourceId}/shipment`,
        data
      )
    },
    toDetail() {
      this.$router.push({
        name: 'orders.detail',
        params: { id: this.resourceId }
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
    hasOptions() {
      return this.options.length > 0
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
