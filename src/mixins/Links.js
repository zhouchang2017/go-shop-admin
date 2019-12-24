import { getLinks } from '@/api/app'
export default {
  data() {
    return {
      links: []
    }
  },
  methods: {
    fetchLinks() {
      getLinks(this.resourceUriKey).then(res => {
        if (res.status === 200) {
          this.links = res.data
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
      this.fetchLinks()
    }
  }
}
