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
import countTo from 'vue-count-to'
import charts from '@/mixins/Charts'
export default {
  mixins: [charts],
  components: {
    countTo
  }
}
</script>
