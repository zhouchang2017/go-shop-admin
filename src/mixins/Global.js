export default {
  computed: {
    $qiniuUrl() {
      return process.env.VUE_APP_QINIU_DOMAIN
    }
  }
}
