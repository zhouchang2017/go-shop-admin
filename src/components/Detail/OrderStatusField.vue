<template>
  <div class="p-3">
    <el-dialog title="关闭订单" :visible.sync="dialogCancelOrderVisible">
      <el-form :model="form">
        <el-form-item label="关闭理由">
          <el-input
            placeholder="请输入关闭理由"
            v-model="form.reason"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancelOrderVisible = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="onCancel"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <detail-setps v-if="showSteps" :value="status" />

    <!-- 交易关闭 -->
    <div v-if="status === -1" class="flex flex-col  p-3 text-gray-700">
      <p class="font-bold">当前订单状态：交易关闭</p>
      <div class="mt-3 text-sm">关闭理由:{{ reason }}</div>
    </div>

    <!-- 等待付款 -->
    <div
      v-if="status === 0"
      class="flex flex-col bg-gray-200 rounded p-3 text-gray-700 mt-3"
    >
      <p class="font-bold">当前订单状态：买家已下单，等待买家付款</p>
      <div class="mt-3 text-sm">
        若{{ createdAt | timeStr }}前未完成支付，该订单将{{
          countDownList
        }}后自动关闭
      </div>
      <div class="ml-auto">
        <el-button
          type="info"
          @click="dialogCancelOrderVisible = true"
          size="mini"
          >关闭订单</el-button
        >
      </div>
    </div>

    <!-- 等待发货 -->
    <div
      v-if="status === 2"
      class="flex flex-col bg-gray-200 rounded p-3 text-gray-700 mt-3"
    >
      <p class="font-bold">当前订单状态：买家已付款，等待发货</p>
      <div class="mt-3 text-sm">
        {{ buyer }}在{{ paymentAt | timeStr }}完成订单支付，请尽快安排发货
      </div>
      <div class="ml-auto">
        <el-button @click="toShipment" type="primary" size="mini"
          >发货</el-button
        >
      </div>
    </div>

    <!-- 已发货 -->
    <div
      v-if="status === 3"
      class="flex flex-col bg-gray-200 rounded p-3 text-gray-700 mt-3"
    >
      <p class="font-bold">当前订单状态：已发货，等待买家收货</p>
      <!-- <div class="mt-3 text-sm">
        {{ buyer }}在{{ paymentAt | timeStr }}完成订单支付，请尽快安排发货
      </div> -->
      <div class="ml-auto">
        <el-button @click="toLogistics" type="primary" size="mini"
          >查看物流</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['resource', 'resourceName', 'resourceId', 'field'],
  data() {
    return {
      dialogCancelOrderVisible: false,
      stepDescriptions: [
        { value: 0, title: '当前订单状态：买家已下单，等待买家付款' }
      ],
      countDownList: '00天00时00分00秒',
      form: {
        reason: '暂时缺货'
      },
      loading: false
    }
  },
  inject: ['reload'],
  mounted() {
    this.countDown()
  },
  methods: {
    timeFormat(param) {
      return param < 10 ? '0' + param : param
    },
    countDown() {
      if (this.status === 0) {
        var interval = setInterval(() => {
          // 获取当前时间，同时得到活动结束时间数组
          let nowTime = new Date().getTime() // 对结束时间进行处理渲染到页面
          let endTime =
            new Date(_.get(this.field, 'value.created_at')).getTime() +
            1000 * 60 * 30
          let obj = null // 如果活动未结束，对时间进行处理
          if (endTime - nowTime > 0) {
            let time = (endTime - nowTime) / 1000 // 获取天、时、分、秒
            let day = parseInt(time / (60 * 60 * 24))
            let hou = parseInt((time % (60 * 60 * 24)) / 3600)
            let min = parseInt(((time % (60 * 60 * 24)) % 3600) / 60)
            let sec = parseInt(((time % (60 * 60 * 24)) % 3600) % 60)
            obj = {
              day: this.timeFormat(day),
              hou: this.timeFormat(hou),
              min: this.timeFormat(min),
              sec: this.timeFormat(sec)
            }
          } else {
            // 活动已结束，全部设置为'00'
            obj = {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00'
            }
            clearInterval(interval)
          }
          this.countDownList =
            obj.day + '天' + obj.hou + '时' + obj.min + '分' + obj.sec + '秒'
        }, 1000)
      }
    },
    // 发货
    toShipment() {
      this.$router.push({ name: 'orders.shipment', params: { id: this.id } })
    },
    // 物流详情
    toLogistics() {
      this.$router.push({ name: 'orders.logistics', params: { id: this.id } })
    },
    // 关闭订单
    async cancelOrder() {
      try {
        this.loading = true
        await axios.put(`/api/orders/${this.id}/cancel`, this.form)
        this.dialogCancelOrderVisible = false
        this.reload()
      } catch (error) {
        this.loading = false
        if (_.get(error, 'response.status') == 422) {
          console.log(error.response)
          this.$message({
            message: _.get(error, 'response.message'),
            type: 'error'
          })
        }
      }
    },
    onCancel() {
      this.$confirm('是否确定关闭该订单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.cancelOrder()
        })
        .catch()
    }
  },
  computed: {
    id() {
      return _.get(this.field, 'value.id')
    },
    reason() {
      return _.get(this.field, 'value.close_reason')
    },
    // 订单创建时间
    createdAt() {
      return _.get(this.field, 'value.created_at')
    },
    // 订单状态
    status() {
      return _.get(this.field, 'value.status', null)
    },
    // 是否显示步骤条
    showSteps() {
      return ![null, -1].includes(this.status)
    },
    // 订单支付时间
    paymentAt() {
      return _.get(this.field, 'value.payment.payment_at', false)
    },
    // 买家名称
    buyer() {
      return _.get(this.field, 'value.user.nickname', '买家')
    }
  }
}
</script>
