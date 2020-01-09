<template>
  <div v-if="cards.length > 0" class="flex flex-wrap -mx-3">
    <card-wrapper
      v-for="card in cards"
      :card="card"
      :size="size"
      :resource="resource"
      :resource-name="resourceName"
      :resource-id="resourceId"
      :key="`${card.component}.${card.name}`"
      :lens="lens"
    />
  </div>
</template>

<script>
export default {
  props: {
    cards: Array,

    size: {
      type: String,
      default: ''
    },

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
