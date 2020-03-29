<template>
  <card class="shadow-none" v-loading="loading">
    <div class="px-6 py-3">
      <div class="flex justify-between items-center">
        <h3 class="text-gray-600 font-medium tracking-wide">
          {{ card.name }}
        </h3>
        <div class="text-gray-500 text-xs" v-if="card.router">
          <router-link
            :to="card.router"
            class="cursor-pointer inline-block text-gray-500 hover:text-blue-500 focus:outline-none"
            title="查看"
          >
            <icons-icon viewBox="0 0 24 20" type="icons-more" />
          </router-link>
        </div>
      </div>
      <ve-line :data="chartData" :settings="settings">
        <div class="data-empty" v-if="value.length === 0">没有数据😂</div>
      </ve-line>
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
    value: [],
    grid: {
      borderColor: '#fff'
    }
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

<style>
.data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  color: #888;
  font-size: 14px;
}
</style>
