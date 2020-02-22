<template>
  <div class="flex flex-col">
    <sku-option
      v-for="(item, index) in value"
      :key="index"
      :index="index"
      :sku="item"
      :onOptionChange="rebuildOption"
      :onOptionRemove="handleOptionRemove"
    />
    <sku-add-option-button v-if="value.length < maxSize" :onClick="addOption" />
  </div>
</template>

<script>
import { Message, Option } from 'element-ui'
const noop = res => res
const noopPromise = () => Promise.resolve(noop)
export default {
  provide() {
    return {
      ease: this
    }
  },
  components: {
    'sku-option': () => import('./components/SKUOption'),
    'sku-add-option-button': () => import('./components/SKUAddOptionButton')
  },
  data() {
    return {
      options: []
    }
  },
  computed: {
    availableOptions() {
      let options = []
      options.push(...this.options)
      this.value.forEach(option => {
        if (!_.has(option, this.optionIdKey)) {
          options.push(option)
          return
        }

        let o = options.find(
          item => item[this.optionIdKey] === option[this.optionIdKey]
        )
        if (o) {
          o[this.optionNameKey] = option[this.optionNameKey]
          o[this.optionValuesKey] = option[this.optionValuesKey]
        } else {
          options.push(option)
        }
      })
      return options
    }
  },
  watch: {
    // data: {
    //   deep: true,
    //   immediate: true,
    //   handler(value) {
    //     this.$emit('input', value)
    //   }
    // },
    // skuTree(skuTree) {
    //   this.skuTreeData = skuTree
    // }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    token: {
      type: String
    },
    maxSize: {
      type: Number,
      default: 3
    },
    showAddSkuImage: {
      type: Boolean,
      default: true
    },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    // 可选规格列表
    skuTree: {
      type: Array,
      default() {
        return []
      }
    },
    sku: {
      type: Object,
      default() {
        return {}
      }
    },
    // 自定义option的id key
    optionIdKey: {
      type: String,
      default: 'uid'
    },
    // 自定义option的name key
    optionNameKey: {
      type: String,
      default: 'name'
    },
    optionValuesKey: {
      type: String,
      default: 'values'
    },
    // 异步获取规格列表
    onFetchOptions: {
      type: Function
    },
    // 异步获取规格可选值
    onFetchOptionValues: {
      type: Promise
    },
    // 创建新的规格名
    onCreateOption: {
      type: Function,
      default: name =>
        new Promise((resolve, reject) => {
          if (name) {
            resolve(Date.now() + parseInt(_.uniqueId()))
          } else {
            reject(new Error())
          }
        })
    },
    // 创建新的规格值
    onCreateOptionValues: {
      type: Function,
      default: name =>
        new Promise((resolve, reject) => {
          if (name) {
            resolve(Date.now() + parseInt(_.uniqueId()))
          } else {
            reject(new Error())
          }
        })
    }
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        //this.skuTreeData = this.value
        //this.$set(this, 'data', this.value)
      })
    },
    addOption() {
      this.value.push({
        [this.optionValuesKey]: []
      })
    },
    rebuildOption(sku, index) {
      let { optionIdKey } = this
      if (
        this.value.some(
          (item, idx) => item[optionIdKey] === sku[optionIdKey] && index !== idx
        )
      ) {
        Message.error('规格名不能重复')
        return false
      }
      this.$set(this.value, index, Object.assign({}, sku))
      if (
        !this.availableOptions.some(
          item => item[optionIdKey] === sku[optionIdKey]
        )
      ) {
        this.options.push(sku)
      }
      this.$emit('on-change', this.value)
    },
    async handleOptionRemove(index) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.value.splice(index, 1)
          this.$emit('on-change', this.value)
        })
        .catch(() => {})
    },
    isPromiseLike(p) {
      if (!p) {
        return false
      }
      const proto = Object.getPrototypeOf
        ? Object.getPrototypeOf(p)
        : p.__proto__
      return typeof proto.then === 'function'
    }
  },
  beforeMount() {
    let { onFetchOptions } = this
    if (typeof onFetchOptions === 'function') {
      if (this.isPromiseLike(onFetchOptions)) {
        onFetchOptions().then(options => {
          this.options = options
        })
      }
    }
  }
}
</script>

<style lang="scss">
.ease-sku {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #e5e5e5;
  box-sizing: border-box;
}
</style>
