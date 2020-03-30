<template>
  <div>
    <div v-if="order.options.length === 0">
      <el-alert
        :closable="false"
        title="请选择对应商品的发货门店"
        type="warning"
      >
      </el-alert>
    </div>
    <template v-else>
      <div
        class="border rounded mb-3"
        v-for="option in order.options"
        :key="option.shop_id"
      >
        <div
          class="flex rounded-t-lg bg-white items-center p-3 border-b text-gray-500 text-xs border-gray-200"
        >
          <div class="text-gray-700">
            发货门店：<span class="font-bold">{{ option.shop.name }}</span>
          </div>

          <div class="text-gray-700 ml-auto flex items-center">
            <add-order :option="option" />
            <div class="text-gray-700 mr-3">无需物流</div>
            <input
              class="mr-3"
              type="checkbox"
              @change="
                $event => onDeliveryChange($event.target.checked, option)
              "
              v-model="option.no_delivery"
            />

            <div class="mr-3">物流公司</div>
            <div>
              <el-select
                size="mini"
                :disabled="option.no_delivery"
                v-model="option.delivery_id"
                placeholder="请选择物流公司"
                @change="value => cacheValue(value, option)"
              >
                <el-option
                  v-for="item in appConfig.logistics"
                  :key="item.delivery_id"
                  :label="item.delivery_name"
                  :value="item.delivery_id"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="text-gray-700 ml-3 flex items-center">
            <div class="mr-3">物流单号</div>
            <div>
              <el-input
                size="mini"
                :disabled="option.no_delivery"
                v-model="option.track_no"
                placeholder="请输入运单号"
                @change="value => cacheValue(value, option)"
              ></el-input>
            </div>
          </div>
        </div>
        <el-table
          :data="option.items"
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
          <el-table-column min-width="120" label="货号" prop="item.code">
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
            min-width="100"
          >
            <template slot-scope="{ row }">
              {{ row.item.option_values.map(value => value.name).join(' ') }}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="count">
            <template slot-scope="{ row }">
              <el-input-number
                style="width:100px"
                size="mini"
                v-model="row.count"
                :min="1"
                :max="caleMax(row)"
              ></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  inject: ['order'],
  components: {
    'add-order': () => import('./AddOrder')
  },
  data() {
    return {}
  },
  methods: {
    cacheValue(value, option) {
      this.order.setCacheLogistics(option.shop_id, {
        delivery_id: option.delivery_id,
        track_no: option.track_no,
        no_delivery: option.no_delivery
      })
    },
    onDeliveryChange(value, option) {
      if (value) {
        option.delivery_id = null
        option.track_no = null
      }
      this.cacheValue(null, option)
    },
    caleMax(row) {
      return (
        this.totalItemsQty[row.item_id] -
        _.get(this.checkedItemsQty, row.item_id, 0) +
        row.count
      )
    }
  },
  computed: {
    // 商品数量汇总
    totalItemsQty() {
      return this.order.items.reduce((res, item) => {
        if (_.has(res, item.item.id)) {
          res[item.item.id] += item.count
        } else {
          res[item.item.id] = item.count
        }
        return res
      }, {})
    },
    // 已选数量汇总
    checkedItemsQty() {
      return this.order.options.reduce((res, option) => {
        option.items.forEach(item => {
          if (_.has(res, item.item_id)) {
            res[item.item_id] += item.count
          } else {
            res[item.item_id] = item.count
          }
        })
        return res
      }, {})
    }
  }
}
</script>
