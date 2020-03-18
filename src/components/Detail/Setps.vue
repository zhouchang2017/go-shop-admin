<template>
  <div class="max-w-xl mx-auto my-4 pb-4">
    <div class="flex pb-3">
      <div class="flex w-full" v-for="(item, index) in options" :key="index">
        <div
          :class="{ invisible: index === 0 }"
          class="w-full align-center items-center align-middle content-center flex"
        >
          <div
            class="w-full bg-gray-400 rounded items-center align-middle align-center flex-1"
          >
            <div
              :class="currentLineClass(item, index, 'left')"
              class="text-xs rounded-r-lg overflow-hidden leading-none py-1 text-center text-grey-darkest"
              style="width: 100%"
            ></div>
          </div>
        </div>
        <div class="flex-1">
          <div
            :class="currentClass(item, index)"
            class="w-10 h-10 mx-auto rounded-full text-lg text-white flex items-center"
          >
            <span
              v-if="activeIndex < index"
              class="text-white text-center w-full"
              >{{ index + 1
              }}<i class="fa fa-check w-full fill-current white"></i
            ></span>
          </div>
        </div>

        <div
          :class="{ invisible: index === options.length - 1 }"
          class="w-full align-center  items-center align-middle content-center flex"
        >
          <div
            class="w-full bg-gray-400 rounded-l-lg overflow-hidden items-center align-middle align-center flex-1"
          >
            <div
              :class="currentClass(item, index)"
              class="text-xs leading-none py-1 text-center text-grey-darkest"
              style="width: 100%"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div
        :class="textClass(item, index)"
        class="flex-1 text-center font-semibold"
        v-for="(item, index) in options"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    options: {
      type: Array,
      default: () => {
        return [
          { name: '待付款', value: 0 },
          { name: '待发货', value: 2 },
          { name: '待收货', value: 3 },
          { name: '待评价', value: 4 },
          { name: '已完成', value: 5 }
        ]
      }
    }
  },
  methods: {
    currentClass(item, index) {
      if (index < this.activeIndex) {
        // 已完成
        return 'bg-blue-400'
      }
      if (index === this.activeIndex) {
        return 'bg-blue-300'
      }
      return 'bg-gray-400'
    },
    currentLineClass(item, index, direction) {
      if (index < this.activeIndex) {
        // 已完成
        return 'bg-blue-400'
      }
      if (index === this.activeIndex) {
        if (direction === 'left') {
          return 'bg-blue-400'
        }
        return 'bg-blue-300'
      }
      return 'bg-gray-400'
    },
    textClass(item, index) {
      if (index < this.activeIndex) {
        // 已完成
        return 'text-blue-400'
      }
      if (index === this.activeIndex) {
        return 'text-blue-300'
      }
      return 'text-gray-400'
    }
  },
  computed: {
    activeIndex() {
      return this.options.findIndex(option => option.value === this.value)
    }
  }
}
</script>
