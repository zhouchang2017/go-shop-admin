export default {
  props: {
    resourceName: {},
    field: {}
  },

  data: () => ({
    value: ''
  }),

  mounted() {
    this.setInitialValue()

    // Add a default fill method for the field
    this.field.fill = this.fill

    // Register a global event for setting the field's value
    this.$Bus.$on(this.field.attribute + '-value', value => {
      this.value = value
    })
  },

  destroyed() {
    this.$Bus.$off(this.field.attribute + '-value')
  },

  methods: {
    /*
     * Set the initial value for the field
     */
    setInitialValue() {
      this.value = !(
        this.field.value === undefined || this.field.value === null
      )
        ? this.field.value
        : ''
    },

    /**
     * Provide a function that fills a passed FormData object with the
     * field's internal value attribute
     */
    fill(formData) {
      _.set(formData, this.field.attribute, this.value)
    },

    /**
     * Update the field's internal value
     */
    handleChange(value) {
      this.value = value
    }
  },

  computed: {
    /**
     * Determine if the field is in readonly mode
     */
    isReadonly() {
      return (
        this.field.readonly || _.get(this.field, 'extraAttributes.readonly')
      )
    },
    isRequired() {
      return Boolean(_.find(this.field.rules, ['rule', 'required']))
    }
  }
}
