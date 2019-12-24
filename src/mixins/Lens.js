export default {
  methods: {
    fetch(query) {
      return axios({
        url: this.lensApiUri,
        method: 'get',
        params: query
      })
    }
  },
  computed: {
    lensApiUri() {
      return _.get(this, '$route.meta.LensApiUri')
    }
  }
}
