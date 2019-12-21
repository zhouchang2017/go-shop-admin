export default {
  data: () => ({
    trashedParameter: 'trashed',
    withTrashed: false
  }),

  watch: {
    /**
     * Watch the withTrashed update to router query string
     */
    withTrashed: function(value, oldValue) {
      if (value !== oldValue) {
        this.withTrashedChanged()
      }
    }
  },

  methods: {
    /**
     * Toggle the trashed state of the search
     */
    toggleWithTrashed() {
      this.withTrashed = !this.withTrashed
    },

    /**
     * Enable searching for trashed resources
     */
    enableWithTrashed() {
      this.withTrashed = true
    },

    /**
     * Disable searching for trashed resources
     */
    disableWithTrashed() {
      this.withTrashed = false
    },

    /**
     * Update the desired amount of resources with trashed.
     */
    withTrashedChanged() {
      this.updateQueryString({ [this.trashedParameter]: this.withTrashed })
    },

    /**
     * Sync the with trashed values from the query string.
     */
    initializeWithTrashedFromQueryString() {
      this.withTrashed = this.currentTrashed
    },

    // 携带软删除显示参数
    withTrashedToQueryString(withTrashed) {
      return withTrashed ? { [this.trashedParameter]: this.withTrashed } : {}
      // return this.mergeQueryString(query)
    }
  },

  computed: {
    /**
     * Get the current trashed constraint value from the query string.
     */
    currentTrashed() {
      return Boolean(this.$route.query[this.trashedParameter] || false)
    }
  },

  created() {
    this.initializeWithTrashedFromQueryString()
  }
}
