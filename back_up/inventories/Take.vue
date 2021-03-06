<template>
  <div :class="[updating ? 'card' : 'flex w-full']">
    <div class="card-head" v-if="updating">
      <div class="card-head__title">
        出库操作
      </div>
    </div>
    <el-form :ref="formName" :model="resource" :rules="rules" class="w-full">
      <div class="w-full p-6">
        <el-form-item label="门店" prop="shop_id">
          <el-select
            :disabled="updating"
            v-model="resource.shop_id"
            placeholder="请选择门店"
          >
            <el-option
              v-for="item in shops"
              value-key="id"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品列表" class="full">
          <inventory-selection-table
            :shop-id="resource.shop_id"
            @change="onChange"
            :items="resource.items"
          />
        </el-form-item>
        <el-form-item
          :label="`已选商品(${countSelectionItem})`"
          prop="items"
          class="full"
        >
          <el-table
            class="rounded-lg shadow-lg"
            max-height="550"
            :data="resource.items"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{ row }">
                <el-image
                  fit="cover"
                  class="h-10 w-10 rounded"
                  :src="getAvatar(row.item)"
                  lazy
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="item.code"
              min-width="150"
              label="货号"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="品牌"
              prop="item.product.brand.name"
            />
            <el-table-column
              show-overflow-tooltip
              label="类目"
              prop="item.product.category.name"
            />
            <el-table-column label="属性值" align="left">
              <template slot-scope="{ row }">
                {{ row.item.option_values.map(value => value.name).join('/') }}
              </template>
            </el-table-column>
            <el-table-column label="库存" prop="max" />
            <el-table-column label="状态">
              <template slot-scope="{ row }">
                <inventory-status :value="row.status" />
              </template>
            </el-table-column>
            <el-table-column prop="qty" label="数量">
              <template slot-scope="{ row }">
                <el-input
                  size="mini"
                  :min="1"
                  :max="row.max"
                  type="number"
                  v-model.number="row.qty"
                  placeholder="请输入数量"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="right"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="{ row }">
                <div
                  class="flex flex-row justify-end items-center text-gray-500"
                >
                  <el-popover placement="top" v-model="row.visible">
                    <div class="flex p-3">
                      <p>是否确定删除{{ row.code }}？</p>
                    </div>

                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="row.visible = false"
                        >取消</el-button
                      >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="removeItem(row)"
                        >确定</el-button
                      >
                    </div>
                    <div
                      slot="reference"
                      title="删除"
                      class="appearance-none cursor-pointer text-70 hover:text-primary"
                    >
                      <button
                        title="删除"
                        type="button"
                        class="text-gray-500 hover:text-blue-500"
                      >
                        <icons-icon viewBox="0 0 24 20" type="icons-delete" />
                      </button>
                    </div>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>
    <div class="mb-6"></div>

    <div class="fixed bottom-0 left-0 w-full sm:pl-64">
      <div class="flex w-full bg-white p-3">
        <div class="ml-auto"></div>
        <!-- <el-button @click="reset">Reset</el-button> -->
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
export default {
  name: 'resource-create-page',
  components: {
    'inventory-selection-table': () => import('./InventorySelectionTable'),
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
      callback()
    }
    return {
      resource: {
        shop_id: null,
        items: []
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
        console.log(error)
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

    async updateResource() {
      this.isWorking = true

      try {
        const {
          data: { redirect }
        } = await this.updateResource()

        this.$message({
          message: '更新成功',
          type: 'success'
        })

        this.$router.push({ path: redirect })
      } catch (error) {
        console.log(error)
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
            inventory_id: item.id,
            status: item.status
          }
        })
      })
    },
    reset() {
      this.$refs[this.formRef].reset()
    },
    removeItem(obj) {
      let index = this.resource.items.findIndex(item => item.id === obj.id)
      if (index >= 0) {
        // obj.visible = false
        this.resource.items.splice(index, 1)
      }
    },
    onChange({ checked, obj }) {
      if (checked) {
        this.resource.items.push({
          visible: false,
          ...obj,
          qty: 1,
          max: obj.qty
        })
      } else {
        let index = this.resource.items.findIndex(item => item.id === obj.id)
        if (index >= 0) {
          this.resource.items.splice(index, 1)
        }
      }
    },

    fill() {
      this.resource.items = this.originalResource.items.map(item => {
        return {
          visible: false,
          qty: item.qty,
          status: item.status,
          id: item.inventory_id,
          item: item,
          max: _.get(item, 'inventory.qty', item.qty)
        }
      })
      this.resource.shop_id = this.originalResource.shop.id
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
      return '/inventory_actions/take'
    },
    updateEndpoint() {
      return `/inventory_actions/${this.resourceId}/take`
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
