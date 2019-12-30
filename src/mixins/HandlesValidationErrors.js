import Errors from '@/utils/errors'

export default {
  props: {
    errors: {
      default: () => new Errors()
    }
  },

  watch: {
    value: function(value, oldValue) {
      if (this.hasError && value !== oldValue) {
        this.errors.clear(this.fieldAttribute)
      }
    }
  },

  computed: {
    fieldAttribute() {
      return this.field.attribute
    },

    hasError() {
      return this.errors.has(this.fieldAttribute)
    },

    firstError() {
      if (this.hasError) {
        return this.errors.first(this.fieldAttribute)
      }
    }
  }
}
