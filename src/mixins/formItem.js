import Emitter from '@/mixins/emitter.js'

export default {
  mixins: [Emitter],
  inject: ['item'],
  prop: ['value'],
  data() {
    return {
      defaultValue: this.value
    }
  },
  watch: {
    value(val) {
      this.defaultValue = val
    }
  },
  computed: {
    hasError() {
      return this.item.validateState === 'error'
    }
  },
  methods: {
    /**
     * change 事件
     * @param event
     */
    handleInput(event) {
      // 当前model 赋值
      this.defaultValue = event.target.value
      // vue 原生的方法 return 出去
      this.$emit('input', event.target.value)
      // 将当前的值发送到 aiFormItem 进行校验
      this.dispatch('z-form-item', 'on-form-change', event.target.value)
    },
    /**
     * blur 事件
     * @param event
     */
    handleBlur(event) {
      // vue 原生的方法 return 出去
      this.$emit('blur', event.target.value)
      // 将当前的值发送到 aiFormItem 进行校验
      this.dispatch('z-form-item', 'on-form-blur', event.target.value)
    }
  }
}
