<template>
  <card class="shadow-none h-full">
    <div class="px-6 py-3">
      <div class="flex flex-col">
        <div class="flex justify-between items-center">
          <h3 class="text-gray-600 font-medium tracking-wide">
            {{ card.name }}
          </h3>
          <div class="text-gray-500 text-xs">{{ value.count }}笔</div>
        </div>

        <div class="font-sans flex items-end">
          <div>
            <span class="text-gray-800 font-semibold text-3xl">{{
              value.total_amount
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
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

  data: () => ({
    loading: true,
    value: 0
  }),

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
    }
  }
}
</script>
