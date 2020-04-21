<template>
  <div class="rounded-lg overflow-hidden">
    <el-table :data="values" fit highlight-current-row style="width: 100%;">
      <el-table-column type="expand" v-if="order && order.promotion_info">
        <template slot-scope="{ row }">
          <template v-if="row.promotion_info">
            <div
              class="w-full sm:flex hidden text-gray-500 font-bold pb-1 mb-1 border-b"
            >
              <div class="mr-3 w-1/5">活动名称</div>
              <div class="mr-3 w-3/5">活动说明</div>
              <el-tooltip effect="dark" content="可能存在误差" placement="top">
                <div class="mr-3 w-1/5">
                  优惠单价
                </div>
              </el-tooltip>
              <div class="w-1/5">优惠小计</div>
            </div>
            <div
              class="flex w-full sm:flex-row flex-col"
              v-for="(info, index) in row.promotion_info.infos"
              :key="index"
            >
              <div class="sm:mr-3 sm:w-1/5 flex w-full mb-1 mr-0">
                <div
                  class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
                >
                  活动名称
                </div>
                <div>{{ info.name }}</div>
              </div>
              <div class="sm:mr-3 sm:w-3/5 flex w-full mb-1 mr-0">
                <div
                  class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
                >
                  活动说明
                </div>
                <div>{{ info.description }}</div>
              </div>
              <div class="sm:mr-3 sm:w-1/5 flex w-full mb-1 mr-0">
                <div
                  class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
                >
                  优惠单价
                </div>
                <div>{{ -info.unit_sale_price | money }}</div>
              </div>
              <div class="sm:w-1/5 w-full flex mb-1">
                <div
                  class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
                >
                  优惠小计
                </div>
                <div>{{ -info.sale_price | money }}</div>
              </div>
            </div>
          </template>
          <div v-else>
            <el-alert title="无促销信息" type="info" :closable="false">
            </el-alert>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="货品" min-width="150">
        <template slot-scope="{ row }">
          <div class="flex">
            <div class="mr-3">
              <el-image
                class="h-12 w-12 rounded"
                fit="cover"
                width="100%"
                :src="row.item.avatar"
                lazy
              ></el-image>
            </div>
            <div class="flex-1">
              <div class="text-xs text-gray-800">
                {{ row.item.product.name }}
              </div>
              <div class="text-xs font-bold text-gray-700">
                {{ row.item.code }}
              </div>
              <div class="text-xs text-gray-500">
                {{ row.item.option_values.map(value => value.name).join(' ') }}
              </div>
            </div>
          </div>
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
        label="促销价"
        align="left"
        prop="price"
      >
        <template slot-scope="{ row }">
          {{ row.price | money }}
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
          {{
            (row.price * row.count -
              (row.promotion_info ? row.promotion_info.sale_prices : 0))
              | money
          }}
        </template>
      </el-table-column>
    </el-table>
    <div class="rounded-b-lg text-gray-500 text-sm bg-gray-100 py-3 pl-16">
      <template v-if="order && order.promotion_info">
        <div
          class="card-item text-xs"
          v-for="(info, index) in order.promotion_info.infos"
          :key="index"
        >
          <div class="card-item__label">{{ info.name }}</div>
          <div class="card-item__content">{{ -info.sale_price | money }}</div>
        </div>
        <div class="card-item">
          <div class="card-item__label">累计优惠</div>
          <div class="card-item__content">
            {{ -order.promotion_info.sale_prices | money }}
          </div>
        </div>
      </template>
      <div class="card-item">
        <div class="card-item__label">订单总额</div>
        <div class="card-item__content">
          {{ order.order_amount | money }}
        </div>
      </div>
      <div class="card-item">
        <div class="card-item__label">实付款</div>
        <div class="card-item__content">
          {{ order.actual_amount | money }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],

  methods: {},

  computed: {
    order() {
      return _.get(this, 'field.value')
    },
    values() {
      return _.get(this, 'field.value.order_items', [])
    }
  }
}
</script>
