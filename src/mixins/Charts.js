import Minimum from '@/utils/minimum'
export default {
  props: {
    card: {
      type: Object,
      required: true
    },

    resourceName: {
      type: String,
      default: ''
    },

    resourceId: {
      type: [Number, String],
      default: ''
    },

    lens: {
      type: String,
      default: ''
    }
  },
  watch: {
    value(nv, ov) {
      this.setStartValue(ov)
    }
  },
  data: () => ({
    loading: true,
    value: 0,
    timer: null,
    startVal: 0
  }),

  mounted() {
    this.fetch()
    this.loopFetch()
  },

  beforeDestroy() {
    if (this.duration > 0) {
      clearInterval(this.timer)
    }
  },

  methods: {
    loopFetch() {
      if (this.duration > 0) {
        this.timer = setInterval(() => {
          this.fetch()
        }, this.duration)
      }
    },
    fetch() {
      this.loading = true

      Minimum(axios.get(this.chartsEndpoint)).then(({ data }) => {
        this.setData(data)
        this.loading = false
      })
    },
    setData(data) {
      this.value = data
    },
    setStartValue(value) {
      this.startVal = value
    }
  },

  computed: {
    uriKey() {
      return this.card.uri_key
    },
    hasLink() {
      return _.has(this, 'card.router')
    },
    chartsEndpoint() {
      if (this.resourceName && this.resourceId) {
        return `/charts/app/${this.uriKey}/${this.resourceName}/${this.resourceId}`
      } else if (this.resourceName) {
        return `/charts/app/${this.uriKey}/${this.resourceName}`
      } else {
        return `/charts/app/${this.uriKey}`
      }
    },
    duration() {
      return _.get(this, 'card.duration', 0)
    }
  }
}
