<template>
  <div class="flex flex-col">
    <div v-if="shouldShowCards">
      <grid
        v-if="gridCards.length > 0"
        :cards="gridCards"
        class="mb-3"
        :resource-name="resourceName"
      />
      <cards
        v-if="smallCards.length > 0"
        :cards="smallCards"
        class="mb-3"
        :resource-name="resourceName"
      />

      <cards
        v-if="largeCards.length > 0"
        :cards="largeCards"
        size="large"
        :resource-name="resourceName"
      />
    </div>

    <!-- Head Title -->
    <div class="w-full flex items-center mb-3">
      <div class="font-bold text-2xl text-gray-700 uppercase">{{ title }}</div>
      <div class="ml-auto" v-if="$route.meta.AuthorizedToCreate">
        <router-link
          :to="{ name: $route.meta.CreateRouterName }"
          class="inline-flex cursor-pointer text-center items-center px-3 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:opacity-75 focus:outline-none focus:shadow-outline"
        >
          {{ $route.meta.CreateButtonText }}
        </router-link>
      </div>
    </div>

    <!-- Body -->
    <div class="rounded-lg shadow-lg">
      <resource-table />
    </div>
  </div>
</template>

<script>
import HasCards from '@/mixins/HasCards'

export default {
  name: 'Index',
  mixins: [HasCards],
  props: {
    viaTitle: String,
    viaResourceName: String
  },
  computed: {
    // 资源名称
    resourceName() {
      return _.isNil(this.viaResourceName)
        ? _.get(this, '$route.meta.ResourceName')
        : this.viaResourceName
    },
    // 当前页标题
    title() {
      return _.isNil(this.viaTitle)
        ? _.get(this, '$route.meta.Title', this.resourceName)
        : this.viaTitle
    },
    // card api
    cardsEndpoint() {
      return `/cards/${this.resourceName}`
    }
  }
}
</script>
