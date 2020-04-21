<template>
  <div>
    <div v-if="isWxOrder" class="mr-3 flex">
      <div class="bg-blue-400 align-middle text-white px-3 py-1 rounded mr-1">
        物流助手已下单
      </div>
      <el-button
        @click="onCancel"
        size="mini"
        type="danger"
        :loading="isWorking"
        >取消下单</el-button
      >
    </div>
    <el-button
      v-else
      size="mini"
      type="primary"
      class="mr-3"
      @click="dialogFormVisible = true"
      >物流助手在线下单</el-button
    >
    <el-dialog title="物流助手在线下单" :visible.sync="dialogFormVisible">
      <div>
        <div
          class="flex flex-col sm:justify-between w-full text-xs bg-gray-100 p-3 "
        >
          <div class="text-gray-800 font-bold">
            发货门店：{{ option.shop.name }}
          </div>
          <div class="text-gray-700 text-xs">发货地址：{{ address }}</div>
        </div>
        <div
          class="flex w-full p-3"
          v-for="item in option.items"
          :key="item.item_id"
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
            <div class="flex">
              <div class="text-xs text-gray-800">
                {{ item.item.product.name }}
              </div>
              <div class="ml-auto text-xs text-gray-600">
                {{ (item.orderItem.amount * item.orderItem.count) | money }}
              </div>
            </div>
            <div class="text-xs font-bold text-gray-700">
              {{ item.item.code }}
            </div>
            <div class="flex">
              <div class="text-xs text-gray-500">
                {{ item.item.option_values.map(value => value.name).join(' ') }}
              </div>
              <div class="text-xs text-gray-700 ml-auto">x{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
      <el-form :ref="formName" :model="form" :rules="rules">
        <el-form-item label="物流公司" prop="delivery_id">
          <el-select
            size="mini"
            v-model="form.delivery_id"
            placeholder="请选择物流公司"
          >
            <el-option
              v-for="item in myLogistics"
              :key="item.delivery_id"
              :label="item.delivery_name"
              :value="item.delivery_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="logistics"
          label="服务类型"
          prop="delivery_service_type"
        >
          <el-select
            size="mini"
            v-model="form.delivery_service_type"
            placeholder="请选择服务类型"
          >
            <el-option
              v-for="item in logistics.services"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上门取件时间" prop="expect_time">
          <el-date-picker v-model="form.expect_time" type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否保价">
          <el-radio-group v-model="form.use_insured">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="保价金额" v-if="form.use_insured === 1">
          <form-currency v-model="form.insured_value" />
        </el-form-item>
        <el-form-item label="重量" prop="weight">
          <el-input v-model.number="form.weight">
            <template slot="append">公斤(Kg)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="包裹长度" prop="space_x">
          <el-input v-model.number="form.space_x">
            <template slot="append">厘米(cm)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="包裹宽度" prop="space_y">
          <el-input v-model.number="form.space_y">
            <template slot="append">厘米(cm)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="包裹高度" prop="space_z">
          <el-input v-model.number="form.space_z">
            <template slot="append">厘米(cm)</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注" prop="custom_remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注内容"
            v-model="form.custom_remark"
            maxlength="30"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="isWorking" type="primary" @click="createResource"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ResourceForm from '@/mixins/ResourceForm'
import dayjs from 'dayjs'

export default {
  inject: ['reload', 'order'],
  mixins: [ResourceForm],
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  async mounted() {
    await this.componentInit()
  },
  data() {
    var validateTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写取件时间'))
      } else {
        if (dayjs(value).isBefore(dayjs())) {
          callback(new Error('取件时间必须大于当前时间'))
        }
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      form: {
        delivery_id: '',
        delivery_service_type: '',
        custom_remark: '',
        shop: null,
        weight: 1,
        space_x: 30,
        space_y: 21,
        space_z: 11,
        use_insured: 0,
        insured_value: 0,
        expect_time: null
      },
      rules: {
        expect_time: [
          { required: true, message: '请选服取件时间', trigger: 'change' },
          { validator: validateTime, trigger: 'change' }
        ],
        delivery_service_type: [
          { required: true, message: '请选服务类型', trigger: 'change' }
        ],
        delivery_id: [
          { required: true, message: '请选物流公司', trigger: 'change' }
        ]
      },
      isWorking: false
    }
  },
  methods: {
    async componentInit() {
      this.form.shop = this.option.shop
      if (this.option.waybill_id && this.option.waybill_id !== '') {
        await this.getOrder()
      }
    },
    resourceTransform() {
      let option = {
        order_id: this.order.resource.id,
        delivery_id: this.form.delivery_id,
        delivery_service_type: this.form.delivery_service_type,
        custom_remark: this.form.custom_remark,
        shop: this.form.shop,
        items: this.option.items.map(item => {
          return {
            item_id: item.item_id,
            count: item.count
          }
        }),
        weight: this.form.weight,
        space_x: this.form.space_x,
        space_y: this.form.space_y,
        space_z: this.form.space_z,
        use_insured: this.form.use_insured,
        expect_time: this.form.expect_time
      }
      if (this.form.use_insured === 1) {
        option.insured_value = this.form.insured_value
      }
      return option
    },
    async createResource() {
      this.isWorking = true
      try {
        const formData = await this.submit()
        console.log(formData)
        const { data } = await axios.post(`/mp/logistics`, formData)
        this.isWorking = false
        this.$message({
          message: '下单成功',
          type: 'success'
        })
        this.reload()
      } catch (error) {
        this.isWorking = false
        let message = 'There was a problem submitting the form.'
        if (_.get(error, 'response.status') == 422) {
          console.log(error.response)
          // this.validationErrors = new Errors(error.response.data.errors)
          message = _.get(error, 'response.data.message', message)
        }
        this.$message({
          message: message,
          type: 'error'
        })
      }

      this.isWorking = false
    },
    async getOrder() {
      try {
        let { data } = await axios.get('/mp/logistics/get-order', {
          params: {
            order_no: this.order.resource.order_no,
            delivery_id: this.option.delivery_id,
            waybill_id: this.option.waybill_id
          }
        })
        console.log(data)
      } catch (error) {
        let message = 'There was a problem submitting the form.'
        if (_.get(error, 'response.status') == 422) {
          console.log(error.response)
          // this.validationErrors = new Errors(error.response.data.errors)
          message = _.get(error, 'response.data.message', message)
        }
        this.$message({
          message: message,
          type: 'error'
        })
      }
    },
    onCancel() {
      this.$confirm('是否确定取消', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.cancelOrder()
        })
        .catch()
    },
    async cancelOrder() {
      this.isWorking = true
      try {
        const { data } = await axios.post(`/mp/logistics/cancel-order`, {
          order_no: this.order.resource.order_no,
          delivery_id: this.option.delivery_id,
          waybill_id: this.option.waybill_id
        })
        this.isWorking = false
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        this.reload()
      } catch (error) {
        this.isWorking = false
        let message = 'There was a problem submitting the form.'
        if (_.get(error, 'response.status') == 422) {
          console.log(error.response)
          // this.validationErrors = new Errors(error.response.data.errors)
          message = _.get(error, 'response.data.message', message)
        }
        this.$message({
          message: message,
          type: 'error'
        })
      }

      this.isWorking = false
    }
  },
  computed: {
    myLogistics() {
      return _.get(this, 'order.myLogistics', [])
    },
    logistics() {
      return _.find(this.myLogistics, ['delivery_id', this.form.delivery_id])
    },
    address() {
      let address = _.get(this, 'option.shop.address', null)
      if (!address) {
        return ''
      }
      let tel = address.phone
      if (address.tel) {
        tel = address.tel
      }
      return `${address.province}${address.city}${address.areas}${address.addr}，发件人：${address.name}，联系电话：${tel}`
    },
    isWxOrder() {
      return !!_.get(this, 'option.waybill_id')
    }
  }
}
</script>
