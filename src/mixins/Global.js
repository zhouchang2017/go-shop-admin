export default {
  computed: {
    $user() {
      return _.get(this, '$store.state.auth.user', null)
    },
    $qiniuUrl() {
      return process.env.VUE_APP_QINIU_DOMAIN
    }
  }
}
