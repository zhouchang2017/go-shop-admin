<template>
  <div id="wrapper" class="w-full mx-auto">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <component
        v-for="(card, index) in cards"
        class="mb-2"
        :key="index"
        :is="card.component"
        :card="card"
        :resource="resource"
        :resourceName="resourceName"
        :resourceId="resourceId"
        :lens="lens"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cards: Array,
    resource: {
      type: Object
    },
    resourceName: {
      type: String
    },
    resourceId: {
      type: [Number, String]
    },
    onlyOnDetail: {
      type: Boolean,
      default: false
    },
    lens: {
      lens: String,
      default: ''
    }
  }
}
</script>
