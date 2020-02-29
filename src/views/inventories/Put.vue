<template>
  <div :class="[updating ? 'card' : 'flex w-full']">
    <div class="card-head" v-if="updating">
      <div class="card-head__title">
        入库操作
      </div>
    </div>
    <el-form :ref="formName" :model="resource" :rules="rules" class="w-full">
      <div class="w-full p-6">
        <el-form-item label="门店" prop="shop_id">
          <el-select v-model="resource.shop_id" placeholder="请选择门店">
            <el-option
              v-for="item in shops"
              value-key="id"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库商品" prop="items" class="full">
          <div class="w-full sm:flex hidden text-gray-500 font-bold">
            <div class="mr-3 w-1/5">图片</div>
            <div class="mr-3 w-2/5">货号</div>
            <div class="mr-3 w-1/5">数量</div>
            <div class="w-1/5">状态</div>
          </div>
          <div
            class="flex w-full sm:flex-row flex-col"
            v-for="(item, index) in resource.items"
            :key="index"
          >
            <div class="sm:mr-3 sm:w-1/5 flex w-full mb-1 mr-0">
              <div
                class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
              >
                图片
              </div>
              <el-image
                v-if="item.item"
                fit="cover"
                class="h-10 w-10 rounded"
                :src="getAvatar(item.item)"
                lazy
              ></el-image>
            </div>
            <div class="sm:mr-3 sm:w-2/5 flex w-full mb-1 mr-0">
              <div
                class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
              >
                货号
              </div>
              <item-selection
                class="w-full"
                v-model="item.item"
                endpoint="/api/items"
              />
            </div>
            <div class="sm:mr-3 sm:w-1/5 flex w-full mb-1 mr-0">
              <div
                class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
              >
                数量
              </div>
              <el-input
                class="w-full"
                :min="1"
                type="number"
                v-model.number="item.qty"
                placeholder="请输入数量"
              ></el-input>
            </div>
            <div class="sm:w-1/5 w-full flex mb-1">
              <div
                class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
              >
                状态
              </div>
              <el-select
                class="w-full"
                v-model="item.status"
                placeholder="请选择状态"
              >
                <el-option
                  v-for="item in status"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                  <inventory-status :value="item.value" />
                </el-option>
              </el-select>
            </div>
            <div class="sm:w-1/5 w-full flex mb-1">
              <div
                class="sm:hidden block whitespace-no-wrap text-gray-500 font-bold mr-3"
              >
                操作
              </div>
              <div class="flex sm:ml-3 ml-0 items-center">
                <button
                  @click="removeItem(index)"
                  title="删除"
                  type="button"
                  class="text-gray-500 hover:text-blue-500"
                >
                  <icons-icon viewBox="0 0 24 20" type="icons-delete" />
                </button>
              </div>
            </div>
          </div>
          <el-button type="primary" @click="addItem" size="mini"
            >继续添加</el-button
          >
        </el-form-item>
      </div>
    </el-form>
    <div class="mb-6"></div>

    <div class="fixed bottom-0 left-0 w-full sm:pl-64">
      <div class="flex w-full bg-white p-3">
        <div class="ml-auto"></div>
        <el-button
          :loading="isWorking"
          @click="submitViaCreateResource"
          type="primary"
          >{{ updating ? 'Update' : 'Create' }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import inventory from './inventory'

export default {
  name: 'resource-create-page',
  mixins: [inventory],
  components: {
    'item-selection': () => import('./ItemSelection'),
    'inventory-status': () => import('@/views/inventories/Status')
  },
  props: {
    updating: Boolean,
    originalResource: Object
  },
  data() {
    let checkItems = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error('请至少选择一个入库商品'))
      }
      if (value.some(item => item.qty <= 0)) {
        return callback(new Error('入库数量必须大于0'))
      }
      if (value.some(item => !item.item)) {
        return callback(new Error('入库商品尚未输入完成'))
      }
      callback()
    }
    return {
      resource: {
        shop_id: null,
        items: [
          {
            item: null,
            qty: 1,
            status: 0
          }
        ]
      },
      rules: {
        shop_id: [{ required: true, message: '请选择门店', trigger: 'change' }],
        items: [
          { validator: checkItems, trigger: 'change' },
          {
            type: 'array',
            required: true,
            message: '请至少选择一个入库商品',
            trigger: 'change'
          }
        ]
      },
      submittedViaCreateResource: false,
      isWorking: false
    }
  },
  mounted() {
    if (this.updating && !_.isNil(this.originalResource)) {
      this.fill()
    }
  },
  methods: {
    getAvatar(item) {
      return _.get(item, 'avatar', _.get(item, 'Meta.avatar'))
    },
    async submitViaCreateResource(e) {
      this.submittedViaCreateResource = true
      this.$refs[this.formName].validate(async valid => {
        if (valid) {
          this.updating
            ? await this.updateResource()
            : await this.createResource()
        } else {
          this.$message({
            message: 'There was a problem submitting the form.',
            type: 'error'
          })
          this.submittedViaCreateResource = false
          return false
        }
      })
    },

    /**
     * Create a new resource instance using the provided data.
     */
    async createResource() {
      this.isWorking = true

      try {
        const {
          data: { redirect }
        } = await this.createRequest()

        this.$message({
          message: '创建成功',
          type: 'success'
        })

        this.$router.push({ path: redirect })
      } catch (error) {
        this.submittedViaCreateResource = true
        this.isWorking = false

        console.log(error)

        if (error.response.status == 422) {
          console.log(error.response)
          // this.validationErrors = new Errors(error.response.data.errors)
          this.$message({
            message: 'There was a problem submitting the form.',
            type: 'error'
          })
        }
      }

      this.submittedViaCreateResource = true
      this.isWorking = false
    },

    async updateResource() {
      this.isWorking = true

      try {
        const {
          data: { redirect }
        } = await this.createRequest()

        this.$message({
          message: '更新成功',
          type: 'success'
        })

        this.$router.push({ path: redirect })
      } catch (error) {
        this.submittedViaCreateResource = true
        this.isWorking = false

        if (error.response.status == 422) {
          console.log(error.response)
          // this.validationErrors = new Errors(error.response.data.errors)
          this.$message({
            message: 'There was a problem submitting the form.',
            type: 'error'
          })
        }
      }

      this.submittedViaCreateResource = true
      this.isWorking = false
    },

    /**
     * Send a create request for this resource
     */
    createRequest() {
      return axios.post(this.createEndpoint, this.createResourceFormData())
    },

    updateRequest() {
      return axios.put(this.updateEndpoint, this.createResourceFormData())
    },

    /**
     * Create the form data for creating the resource.
     */
    createResourceFormData() {
      return _.tap({}, formData => {
        formData.shop_id = this.resource.shop_id
        formData.items = this.resource.items.map(item => {
          return {
            id: item.item.id,
            qty: item.qty,
            status: item.status
          }
        })
      })
    },
    reset() {
      this.$refs[this.formRef].reset()
    },
    removeItem(index) {
      this.resource.items.splice(index, 1)
    },
    fill() {
      this.resource.items = this.originalResource.items.map(item => {
        const { qty, status, ...root } = item
        return {
          qty,
          status,
          item: root
        }
      })
      this.resource.shop_id = this.originalResource.shop.id
    },
    // 添加属性
    addItem() {
      if (!this.resource.items) {
        this.resource.items = []
      }
      const last = _.last(this.resource.items)
      if (last) {
        if (last.item == null) {
          this.$message.error('最后一条入库商品尚未填写完成')
          return
        }
      }

      this.resource.items.push({
        item: null,
        qty: 1,
        status: 0
      })
    }
  },
  computed: {
    // 资源名称
    resourceName() {
      return _.get(this, '$route.meta.ResourceName')
    },
    resourceId() {
      return _.get(this, 'originalResource.id')
    },
    createEndpoint() {
      return '/inventory_actions/put'
    },
    updateEndpoint() {
      return `/inventory_actions/${this.resourceId}/put`
    },
    countSelectionItem() {
      return _.get(this, 'resource.items', []).length
    },
    formName() {
      return this.resourceName + '_form'
    },
    shops() {
      return _.get(this, '$user.shops', [])
    }
  }
}
</script>

<style></style>
