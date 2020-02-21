import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['appConfig']),
    $user() {
      return _.get(this, '$store.state.auth.user', null)
    }
  }
}
