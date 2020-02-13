<template>
  <el-input
    :class="extraClass"
    ref="elInput"
    v-currency="options"
    :value="formattedValue"
    @input="handleInput"
    v-bind="extraProps"
  />
</template>

<script>
import { CurrencyDirective, parseCurrency } from 'vue-currency-input'

// https://dm4t2.github.io/vue-currency-input/config/#component
export default {
  props: {
    value: {
      type: Number,
      default: null
    },
    locale: {
      type: String,
      default: 'zh-CN'
    },
    currency: {
      type: String,
      default: 'CNY'
    },
    valueAsInteger: {
      type: Boolean,
      default: true
    },
    precision: {
      type: Number,
      default: 2
    },
    extraClass: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    extraProps: {
      type: Object,
      default: () => {}
    }
  },
  directives: {
    currency: CurrencyDirective
  },
  data() {
    return {
      formattedValue: this.value
    }
  },
  watch: {
    value(value) {
      this.$refs.elInput
        .getInput()
        .dispatchEvent(new CustomEvent('format', { detail: { value } }))
      this.$emit('change', value)
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', parseCurrency(value, this.options))
      this.formattedValue = value
    }
  },
  computed: {
    options() {
      return {
        locale: this.locale,
        currency: this.currency,
        valueAsInteger: this.valueAsInteger,
        precision: this.precision
      }
    }
  }
}
</script>
