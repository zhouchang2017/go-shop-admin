<template>
  <div class="card mb-3">
    <el-dialog title="拒绝退款" :visible.sync="showDialog">
      <el-form :model="form">
        <el-form-item label="拒绝理由" prop="desc">
          <el-input
            placeholder="请输入拒绝理由"
            v-model="form.desc"
            maxlength="80"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="关闭退款通道" prop="close">
          <el-switch v-model="form.close"></el-switch>
          <div class="text-gray-500 text-xs">
            关闭退款通道后，用户无法再次发起退款申请。
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="onRejectRefund"
          >提交</el-button
        >
      </div>
    </el-dialog>
    <div
      class="flex rounded-t-lg bg-white items-center p-3 border-b text-gray-500 text-xs border-gray-200"
    >
      <div class="text-gray-700 flex flex-col">
        <div>
          退货单号：<span class="font-bold">{{ refund.refund_no }}</span>
        </div>
        <div>
          创建时间：<span class="">{{ refund.created_at | timeStr }}</span>
        </div>
        <div>
          更新时间：<span class="">{{ refund.updated_at | timeStr }}</span>
        </div>
      </div>

      <div class="text-gray-700 ml-auto flex items-center">
        <div
          class="font-bold px-2 py-1 rounded text-white"
          :class="rejectStatusObj.class"
        >
          {{ rejectStatusObj.name }}
        </div>
      </div>
    </div>
    <el-table
      :data="refund.items"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="商品">
        <template slot-scope="{ row }">
          <div class="flex w-full" v-if="row.item">
            <div class="mr-3">
              <el-image
                class="h-12 w-12 rounded"
                fit="cover"
                width="100%"
                :src="row.item.avatar"
                lazy
              ></el-image>
            </div>
            <div class="flex flex-col leading-tight ">
              <div
                class="text-xs text-blue-500 hover:font-bold text-2line mb-1"
              >
                <router-link
                  :to="{
                    name: 'products.detail',
                    params: { id: row.item.product.id }
                  }"
                >
                  {{ row.item.product.name }}
                </router-link>
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
      <el-table-column label="数量" prop="qty" />
      <el-table-column label="退款金额" prop="total_amount">
        <template slot-scope="{ row }">
          {{ row.total_amount | money }}</template
        >
      </el-table-column>
    </el-table>
    <div class="flex flex-col bg-gray-200 p-3 text-gray-700">
      <div class="flex-1 text-sm">
        <p class="break-words font-bold">
          退货总额：<span class="">{{ refund.total_amount | money }} </span>
        </p>
      </div>
    </div>
    <div class="flex flex-col rounded-b-lg bg-gray-100 p-3 text-gray-700">
      <div class="flex-1 text-sm">
        <p class="break-words">
          退货原因：<span class="">{{ refund.refund_desc }} </span>
        </p>
      </div>
      <el-alert
        class="my-2"
        v-if="refundFaild"
        show-icon
        :title="refundFaild.err_code"
        :description="refundFaild.err_code_des"
        type="error"
        :closable="false"
      >
      </el-alert>
      <div class="ml-auto">
        <el-button
          v-if="showRejectButton"
          class="mr-1"
          @click="onCloseRefund"
          size="mini"
          >关闭退款</el-button
        >
        <el-button
          v-if="showRejectButton"
          class="mr-1"
          @click="showDialog = true"
          size="mini"
          >拒绝退款</el-button
        >
        <el-button
          v-if="showRejectButton"
          type="danger"
          @click="onAgreeRefund"
          size="mini"
          >同意退款</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['reload', 'order'],
  props: {
    refund: {
      type: Object
    },
    orderId: {
      type: String,
      required: true
    },
    orderNo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showDialog: false,
      loading: false,
      refundFaild: null,
      form: {
        desc: '',
        close: false
      }
    }
  },
  mounted() {},
  methods: {
    // 同意退款
    async agreeRefund() {
      try {
        this.isWorking = true
        await axios.put(`/api/refunds/${this.refund.id}/agree`)
        this.reload()
      } catch (error) {
        this.isWorking = false
        if (_.get(error, 'response.status') == 422) {
          this.$message({
            message: _.get(error, 'response.data.message', '处理失败'),
            type: 'error'
          })
        }
      }
    },
    // 拒绝退款
    async rejectRefund() {
      try {
        this.isWorking = true
        await axios.put(`/api/refunds/${this.refund.id}/reject`, {
          desc: this.form.desc,
          close: !this.form.close
        })
        this.reload()
      } catch (error) {
        this.isWorking = false
        if (_.get(error, 'response.status') == 422) {
          console.log(error.response)
          this.$message({
            message: _.get(error, 'response.data.message', '处理失败'),
            type: 'error'
          })
        }
      }
    },
    onAgreeRefund() {
      this.$confirm('是否确定同意退款', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.agreeRefund()
        })
        .catch()
    },
    onRejectRefund() {
      this.$confirm('是否确定拒绝退款', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.rejectRefund()
        })
        .catch()
    },
    onCloseRefund() {
      this.$confirm(
        '是否确定关闭退款，关闭退款前建议先与客户沟通，退款通道一并关闭，用户无法再次发起退款申请',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.closeRefund()
        })
        .catch()
    },
    async closeRefund() {
      try {
        this.isWorking = true
        await axios.put(`/api/refunds/${this.refund.id}/cancel`)
        this.reload()
      } catch (error) {
        this.isWorking = false
        if (_.get(error, 'response.status') == 422) {
          console.log(error.response)
          this.$message({
            message: _.get(error, 'response.data.message', '处理失败'),
            type: 'error'
          })
        }
      }
    },
    showRejectRefundDialog(refund) {
      this.showDialog = true
    }
  },
  computed: {
    status() {
      return _.get(this, 'refund.status', 0)
    },
    rejectStatusObj() {
      return _.find(this.appConfig.refund_status, ['value', this.status])
    },
    showRejectButton() {
      return [0].includes(this.status)
    }
  }
}
</script>
