<template>
  <div class="ease-sku-group">
    <div class="group-title bg-gray-200 rounded">
      <span class="text-xs text-gray-700 whitespace-no-wrap">规格名：</span>
      <el-select
        size="mini"
        v-model="skuValue"
        placeholder="请选择"
        allow-create
        filterable
        @change="handleSelectOption"
      >
        <el-option
          v-for="item in ease.skuTreeData"
          :key="item[optionIdKey]"
          :label="item[optionNameKey]"
          :value="item[optionIdKey]"
        >
        </el-option>
      </el-select>
      <el-checkbox
        size="mini"
        v-if="index === 0 && ease.showAddSkuImage"
        class="check-img"
        v-model="sku.image"
        >添加规格图片</el-checkbox
      >
      <i
        class="group-remove hover:text-blue-500 text-gray-500"
        @click="onOptionRemove(index)"
        ><icons-icon type="icons-delete"
      /></i>
    </div>
    <sku-option-values
      :sku="sku"
      :hasSkuImage="sku.image"
      :onSkuLeafChange="handleSkuLeafChange"
    />
    <div class="sku-notice">
      <template v-if="sku.image">
        <p>第一个规格设置不同的规格图片</p>
        <p>设置后，用户选择不同规格会显示不同图片</p>
        <p>建议尺寸：640 x 640像素</p>
      </template>
    </div>
  </div>
</template>

<script>
const noop = res => res
export default {
  inject: ['ease'],
  components: {
    'sku-option-values': () => import('./SKUOptionValues')
  },
  data() {
    return {
      skuValue: '',
      newsSkuText: ''
    }
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    sku: {
      type: Object,
      default() {
        return {}
      }
    },
    onOptionChange: {
      type: Function,
      default: noop
    },
    onOptionRemove: {
      type: Function,
      default: noop
    }
  },
  methods: {
    filterMethod(keyword) {
      // let { optionNameKey } = this
      // if (this.ease.skuTreeData.some(item => item[optionNameKey] === keyword)) return
      // this.newsSkuText = keyword
    },
    // 选择销售属性
    handleSelectOption(value) {
      let { index, optionIdKey } = this
      if (typeof value === 'number') {
        let sku = this.ease.skuTreeData.find(
          item => item[optionIdKey] === value
        )
        sku[this.ease.optionValuesKey] = []
        if (this.onOptionChange(sku, index) === false) {
          this.skuValue = ''
        }
        return
      }
      this.createOption(value)
    },
    // 创建销售属性
    createOption(data) {
      let { index, optionIdKey, optionNameKey } = this
      let option = {}
      let name = data
      let isOption = false
      if (_.isObject(data) && _.has(data, optionNameKey)) {
        option = data
        if (index !== 0) {
          option.image = false
        }
        if (
          _.has(option, this.ease.optionValuesKey) &&
          option[this.ease.optionValuesKey].length
        ) {
          option[this.ease.optionValuesKey].forEach(value => {
            let name = value[optionNameKey]
            this.ease.onCreateOptionValues(name).then(uid => {
              value[optionIdKey] = uid
            })
          })
        }
        name = data[optionNameKey]
        isOption = true
      }

      this.ease.onCreateOption(name).then(uid => {
        option[optionIdKey] = uid
        if (!isOption) {
          option[optionNameKey] = name
          option[this.ease.optionValuesKey] = []
        }

        this.onOptionChange(option, index)
      })
    },
    handleCheckedSkuImage(checked) {
      let { sku, index } = this
      sku[this.ease.optionValuesKey] = sku[this.ease.optionValuesKey].map(
        item => {
          item.image = ''
          return item
        }
      )
      this.onOptionChange(sku, index)
    },
    handleSkuLeafChange(leaf) {
      let { sku, index } = this
      sku[this.ease.optionValuesKey] = leaf
      this.onOptionChange(sku, index)
    }
  },
  watch: {
    sku: {
      deep: true,
      immediate: true,
      handler(sku) {
        if (!_.has(sku, this.optionIdKey) && _.has(sku, this.optionNameKey)) {
          this.createOption(sku)
        }
        if (sku[this.optionIdKey]) {
          this.$nextTick(() => {
            this.skuValue = sku[this.optionIdKey]
          })
        }
      }
    }
  },
  computed: {
    optionIdKey() {
      return _.get(this, 'ease.optionIdKey', 'id')
    },
    optionNameKey() {
      return _.get(this, 'ease.optionNameKey', 'name')
    }
  }
  // updated () {
  //   if (this.sku[this.optionIdKey]) {
  //     this.skuValue = this.sku[this.optionIdKey]
  //   }
  // }
}
</script>

<style lang="scss">
.ease-sku-group {
  overflow: hidden;
  &:hover {
    .group-remove {
      margin-right: 0;
      opacity: 1;
    }
  }
  .group-title {
    padding: 7px 10px;
    color: #666;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  .group-title__label {
    font-size: 12px;
  }
  .group-remove {
    position: absolute;
    right: 5px;
    top: 12px;
    cursor: pointer;
    transition: all 0.3s;
    margin-right: -40px;
    opacity: 0;
  }
  .check-img {
    margin-left: 12px;
    .el-checkbox__label {
      font-size: 12px;
      color: #666;
      font-weight: 400;
    }
    .el-checkbox__inner {
      display: block;
    }
  }
  .sku-notice {
    padding: 0 10px;
    color: #999;
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 14px;
    p {
      padding: 0;
      margin: 6px 0 0;
    }
  }
}
</style>
