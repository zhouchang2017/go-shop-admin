<template>
  <el-table :data="resource.items">
    <el-table-column label="销售属性">
      <el-table-column
        v-for="(option, index) in sortOptions"
        :key="option.id"
        :label="option.name"
      >
        <template slot-scope="{ row }">
          {{ row.option_values[index].value }}
          <code class="markdown text-60 p-1 bg-30 rounded ml-1 text-xs">
            {{ row.option_values[index].code }}</code
          >
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column label="基本信息">
      <el-table-column prop="code" label="商品编码">
        <template slot="header">
          商品编码
          <el-tooltip
            class="item"
            effect="dark"
            content="自动填充商品编码"
            placement="top"
          >
            <span @click="autoGenSkusCode">
              <icons-icon
                type="i-duplicate"
                title="自动填充商品编码"
                class="inline-flex ml-3 appearance-none cursor-pointer text-gray-500 hover:text-gray-700"
              />
            </span>
          </el-tooltip>
        </template>
        <template slot-scope="{ row }">
          <input
            @input="inputHandle(row)"
            v-if="editable"
            type="text"
            class="outline-none focus:outline-none w-full m-1 p-1 rounded"
            v-model="row.code"
          />
          <span v-else>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格">
        <template slot="header">
          价格
          <el-popover placement="bottom" trigger="click" v-model="visible">
            <div class="flex">
              <div class="el-input el-input--mini mr-3">
                <el-input
                  outline
                  v-if="editable"
                  v-model="price"
                  placeholder="请输入填充价格"
                />
              </div>
              <el-button @click="fillPrice" size="mini">填充</el-button>
            </div>
            <el-tooltip
              slot="reference"
              class="item"
              effect="dark"
              content="填充商品价格"
              placement="top"
            >
              <icons-icon
                type="i-edit"
                class="inline-flex ml-3 appearance-none cursor-pointer text-gray-500 hover:text-gray-700"
              />
            </el-tooltip>
          </el-popover>
        </template>
        <template slot-scope="{ row }">
          <input
            @input="inputHandle(row)"
            v-if="editable"
            type="text"
            class="outline-none focus:outline-none w-full m-1 p-1 rounded"
            v-model.number="row.price"
          />

          <span v-else>{{ row.price }}</span>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Sku',
  props: {
    resource: {
      type: Object,
      required: true
    },
    editable: {
      type: Boolean
    }
  },

  data() {
    return {
      visible: false,
      price: 0,
      skuFormLoading: false,
      cachedData: {}
    }
  },

  watch: {
    'resource.options': {
      handler: function(value, oldVal) {
        // 初始化情况
        if (value.length === 0 && oldVal.length === 0) {
          // 不处理
        } else {
          this.resource.items = this.skuOf(this.resource)
        }
      },
      deep: true
    }
  },

  methods: {
    // 笛卡尔积
    cartesianProductOf() {
      return _.reduce(
        arguments,
        (a, b) => {
          return _.flatten(
            _.map(a, x => {
              return _.map(b, y => {
                return x.concat([y])
              })
            }),
            true
          )
        },
        [[]]
      )
    },

    // 计算变体
    skuOf(resource) {
      // 计算组合
      return this.cartesianProductOf(
        ...resource.options.map(item => item.values)
      ).map(opts => {
        // 计算key
        const key = this.getCacheKey({ option_values: opts })
        const cached = this.getCache({ option_values: opts })

        // 初始化code 规则 商品编码 + 销售属性编码
        const code = this.autoGenSkuCode({ option_values: opts })
        return Object.assign(
          {},
          { key, option_values: opts, price: 0, code },
          cached
        )
      })
    },
    // 填充价格
    fillPrice() {
      this.resource.items.forEach(item => {
        item.price = this.price
      })
    },

    // 缓存sku属性
    setCache(item) {
      // 缓存 code price
      const { code, price, id } = item
      this.$set(this.cachedData, this.getCacheKey(item), { code, price, id })
    },

    // 获取sku缓存属性
    getCache(item) {
      return _.get(this.cachedData, this.getCacheKey(item), {})
    },

    // 获取缓存唯一键
    getCacheKey(item) {
      return this.sortOptionValues(_.get(item, 'option_values', []))
        .map(value => `${value.option_id}@${value.code}`)
        .join('::')
    },

    // 通过option_id 获取sort值
    getSortByOptionId(id) {
      return _.get(_.find(this.sortOptions, ['id', id]), 'sort', 0)
    },

    // 销售属性值排序
    sortOptionValues(values) {
      return values.sort(
        (a, b) =>
          this.getSortByOptionId(b.option_id) -
          this.getSortByOptionId(a.option_id)
      )
    },

    autoGenSkuCode(item) {
      return (
        this.resource.code +
        '' +
        this.sortOptionValues(_.get(item, 'option_values', []))
          .map(value => value.code)
          .join('')
      )
    },

    // 自动生成商品编码
    autoGenSkusCode() {
      _.get(this, 'resource.items', []).forEach(item => {
        item.code = this.autoGenSkuCode(item)
        this.setCache(item)
      })
    },

    inputHandle(v) {
      this.setCache(v)
    }
  },

  computed: {
    // 商品销售属性
    sortOptions() {
      return _.get(this, 'resource.options', []).sort((a, b) => b.sort - a.sort)
    },

    // 变体列表
    items() {
      return _.get(this, 'resource.items', [])
    }
  },
  mounted() {
    // 遍历写缓存
    this.resource.items.forEach(item => {
      this.setCache(item)
    })
  }
}
</script>

<style scoped></style>
