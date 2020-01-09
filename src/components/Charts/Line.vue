<template>
  <card v-loading="loading">
    <div class="p-6">
      <div class="mb-4">
        <h3 class="mr-3 text-base text-80 font-bold">{{ card.name }}</h3>
      </div>
      <ve-line :data="chartData" :settings="settings"></ve-line>
    </div>
  </card>
</template>

<script>
import Minimum from '@/utils/minimum'

export default {
  components: {
    've-line': () => import('v-charts/lib/line.common')
  },
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
  data: () => ({
    loading: true,
    value: null
  }),

  created() {},

  mounted() {
    this.fetch()
  },

  methods: {
    fetch() {
      this.loading = true

      Minimum(axios.get(this.chartsEndpoint)).then(({ data }) => {
        this.value = data
        this.loading = false
      })
    }
  },
  computed: {
    uriKey() {
      return this.card.uri_key
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
    settings() {
      return _.get(this, 'card.settings', {})
    },
    chartData() {
      return {
        columns: _.get(this, 'card.columns', []),
        rows: _.get(this, 'value', [])
      }
    }
  }
}
</script>
