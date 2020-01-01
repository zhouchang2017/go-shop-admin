export default {
  props: {
    resourceName: {
      type: String,
      required: true
    },
    lens: String,
    filterKey: {
      type: String,
      required: true
    }
  },
  methods: {
    handleChange(value) {
      this.$store.commit(`${this.resourceName}/updateFilterState`, {
        key: this.filterKey,
        value: value
      })
      this.$emit('change', value)
    }
  },
  computed: {
    options() {
      return _.get(this, 'filter.options', [])
    },
    filter() {
      return this.$store.getters[`${this.resourceName}/getFilter`](
        this.filterKey
      )
    },
    value() {
      return this.filter.value
    }
  }
}
