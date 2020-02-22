<template>
  <el-table
    border
    class="rounded overflow-hidden"
    size="mini"
    :data="lists"
    v-if="lists.length && columns.length > 0"
    :span-method="handleSpanMethod"
  >
    <el-table-column label="销售属性">
      <template v-for="(label, index) in columns">
        <!-- 为什么要判断label: 动态添加规格名的时候规格名不为undefiend时未动态显示, 没有看table-column实现暂时这么解决  -->
        <el-table-column v-if="label" :label="label" :key="index" width="100">
          <template slot-scope="{ row }">
            {{ row.option_values[index] && row.option_values[index].name }}
          </template>
        </el-table-column>
      </template>
    </el-table-column>
    <el-table-column label="基本信息">
      <el-table-column prop="code" label="货号">
        <template slot-scope="{ row }">
          <el-input
            @change="value => inputHandle(row)"
            v-if="editable"
            type="text"
            class="outline-none focus:outline-none w-full m-1 p-1 rounded"
            v-model="row.code"
            size="mini"
          />
          <span v-else>{{ row.code }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="price" label="价格">
        <template slot="header">
          价格
          <el-popover placement="bottom" trigger="click">
            <div>
              <div class="text-gray-700 mb-3">批量填充价格</div>
              <div class="flex flex-col">
                <form-currency
                  extraClass="outline-none
          focus:outline-none w-full rounded"
                  v-model="price"
                  :extraProps="{
                    size: 'mini'
                  }"
                  class="mb-1"
                />
                <el-button @click="fillPrice" size="mini">填充</el-button>
              </div>
            </div>
            <icons-icon
              slot="reference"
              type="icons-edit"
              class="inline-flex ml-3 appearance-none cursor-pointer text-gray-500 hover:text-blue-500"
            />
          </el-popover>
        </template>
        <template slot-scope="{ row }">
          <form-currency
            extraClass="outline-none
          focus:outline-none w-full rounded"
            v-model.number="row.price"
            v-if="editable"
            @change="v => inputHandle(row)"
            :extraProps="{
              size: 'mini'
            }"
          />
          <span v-else>{{ row.price }}</span>
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    // 初始产品组合 sku 列表
    items: {
      type: Array,
      default() {
        return []
      }
    },
    editable: {
      type: Boolean,
      default: true
    },
    // 自定义sku的id key
    optionValue: {
      type: String,
      default: 'uid'
    },
    // 自定义sku的text key
    optionNameKey: {
      type: String,
      default: 'name'
    },
    optionValuesKey: {
      type: String,
      default: 'values'
    }
  },
  data() {
    return {
      rowspan: [],
      lists: [],
      cachedData: {},
      price: 0,
      valuesUidMap: {}
    }
  },
  computed: {
    filter() {
      return this.data.filter(
        item => item[this.optionNameKey] && item[this.optionValuesKey].length
      )
    },
    columns() {
      return this.filter.map(item => item[this.optionNameKey])
    }
  },
  watch: {
    filter: {
      deep: true,
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.cacheValuesUid()
          this.fillItemOptionValuesPid()
          this.lists = this.skuOf(this.filter)
          this.computeRowspan()
        })
      }
    },
    lists: {
      deep: true,
      immediate: true,
      handler(data) {
        this.$emit('on-change-data', data)
      }
    }
  },
  mounted() {
    // 设置
    // this.cacheValuesUid()
  },
  methods: {
    cacheValuesUid() {
      this.data.forEach(option => {
        option.values.forEach(value => {
          this.valuesUidMap[value.id] = value[this.optionValue]
        })
      })
    },
    getOptionValueUid(value) {
      return this.valuesUidMap[value.id]
    },
    fillItemOptionValuesPid() {
      // 缓存初始值
      this.items.forEach(item => {
        // 标记uid
        item.option_values.forEach(value => {
          value.uid = this.getOptionValueUid(value)
        })
        const key = this.getCacheKey(item.option_values)
        this.setCache(key, item)
      })
    },
    // 填充价格
    fillPrice() {
      this.lists.forEach(item => {
        item.price = this.price
      })
    },
    // 价格货号输入事件监听
    inputHandle(row) {
      // 缓存输入值
      const key = this.getCacheKey(row.option_values)
      this.setCache(key, row)
    },
    getCacheKey(optionValues) {
      return optionValues.map(value => value.uid).join(':')
    },
    // 缓存sku属性
    setCache(key, value) {
      // 缓存 code price
      this.$set(this.cachedData, key, value)
    },
    // 读取缓存
    getCache(key, defaultValue = null) {
      return _.get(this.cachedData, key, defaultValue)
    },
    // 笛卡尔积
    cartesian() {
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
    skuOf(options) {
      // 计算组合
      return this.cartesian(...options.map(option => option.values)).map(
        opts => {
          // 计算key
          const key = this.getCacheKey(opts)

          const cached = this.getCache(key, { price: 0, code: '' })

          return Object.assign({}, cached, { option_values: opts })
        }
      )
    },
    computeRowspan() {
      this.rowspan = []
      const rowspan = index => {
        let span = []
        let dot = 0
        this.lists.map((item, idx) => {
          if (idx === 0) {
            span.push(1)
          } else {
            if (
              item.option_values[index][this.optionValue] ===
              this.lists[idx - 1].option_values[index][this.optionValue]
            ) {
              span[dot] += 1
              span.push(0)
            } else {
              dot = idx
              span.push(1)
            }
          }
        })
        this.rowspan.push(span)
      }
      this.filter.map((item, index) => {
        rowspan(index)
      })
    },
    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      for (let i = 0; i < this.filter.length; i++) {
        if (columnIndex === i) {
          if (this.rowspan[i] && this.rowspan[i][rowIndex]) {
            return {
              rowspan: this.rowspan[i][rowIndex],
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    }
  }
}
</script>
