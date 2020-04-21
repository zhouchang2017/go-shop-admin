<template>
  <card class="shadow-none h-full">
    <div class="px-6 py-3">
      <div class="flex flex-col">
        <div class="flex justify-between items-center">
          <h3 class="text-gray-600 font-medium tracking-wide">
            {{ card.name }}
          </h3>

          <div class="text-gray-500 text-xs">
            <countTo
              :startVal="startCount"
              :endVal="value.count"
              :duration="3000"
            ></countTo
            >笔
          </div>
        </div>

        <div class="font-sans flex items-end">
          <div>
            <countTo
              class="text-gray-800 font-semibold text-3xl"
              :startVal="startVal"
              :endVal="value.total_amount"
              :duration="3000"
              :decimals="2"
            ></countTo>
          </div>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import charts from '@/mixins/Charts'
import countTo from 'vue-count-to'

export default {
  mixins: [charts],
  components: {
    countTo
  },
  data() {
    return {
      startVal: 0,
      startCount: 0,
      value: {
        total_amount: 0,
        count: 0
      }
    }
  },
  methods: {
    setData(data) {
      let { total_amount, count } = data
      this.$set(this.value, 'total_amount', Number(total_amount))
      this.$set(this.value, 'count', count)
    },
    setStartValue(value) {
      let { total_amount, count } = value
      this.startVal = total_amount
      this.startCount = count
    }
  }
}
</script>
