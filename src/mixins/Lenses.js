import { getLenses } from '@/api/app'
export default {
  data() {
    return {
      lenses: []
    }
  },
  methods: {
    fetchLenses() {
      getLenses(this.resourceUriKey).then(res => {
        if (res.status === 200) {
          this.lenses = res.data
        }
      })
    }
  },
  computed: {
    resourceUriKey() {
      return _.get(this, '$route.meta.ResourceUriKey', false)
    }
  },
  mounted() {
    if (this.resourceUriKey) {
      this.fetchLenses()
    }
  }
}
