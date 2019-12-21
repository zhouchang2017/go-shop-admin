import defaults from 'lodash/defaults'

export default {
  methods: {
    /**
     * 更新Vue Route 查询字符串
     */
    updateQueryString(value) {
      this.$router
        .push({ query: defaults(value, this.$route.query) })
        .catch(err => {})
    },

    /**
     * 合并Vue Route Query对象，返回新对象
     */
    mergeQueryString(value) {
      return defaults(value, this.$route.query)
    }
  }
}
