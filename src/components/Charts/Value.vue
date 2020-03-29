<template>
  <card class="shadow-none h-full">
    <div class="px-6 py-3">
      <div class="flex flex-col">
        <div class="flex justify-between items-center">
          <h3 class="text-gray-600 font-medium tracking-wide">
            {{ card.name }}
          </h3>
          <div
            class="text-gray-500 text-xs"
            v-if="!resourceName && card.router"
          >
            <router-link
              :to="card.router"
              class="cursor-pointer inline-block text-gray-500 hover:text-blue-500 focus:outline-none"
              title="查看"
            >
              <icons-icon viewBox="0 0 24 20" type="icons-more" />
            </router-link>
          </div>
        </div>
        <div class="font-sans">
          <countTo
            class="text-gray-800 font-semibold text-3xl"
            :startVal="startVal"
            :endVal="value"
            :duration="3000"
          ></countTo>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import Minimum from '@/utils/minimum'
import countTo from 'vue-count-to'
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
  components: {
    countTo
  },
  watch: {
    value(nv, ov) {
      this.startVal = ov
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
        this.value = data
        this.loading = false
      })
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
</script>
