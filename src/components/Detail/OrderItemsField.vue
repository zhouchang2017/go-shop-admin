<template>
  <div class="rounded-lg overflow-hidden">
    <el-table :data="values" fit highlight-current-row style="width: 100%;">
      <el-table-column type="expand" v-if="order && order.promotion_info">
        <template slot-scope="{ row }">
          <div
            class="w-full sm:flex hidden text-gray-500 font-bold pb-1 mb-1 border-b"
          >
            <div class="mr-3 w-1/5">活动名称</div>
            <div class="mr-3 w-3/5">活动说明</div>
            <div class="mr-3 w-1/5">优惠单价</div>
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
      </el-table-column>
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
          {{ row.amount | money }}
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
