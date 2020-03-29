<template>
  <div class="home">
    <!-- This is an example component -->
    <div class="w-full mx-auto">
      <div v-if="shouldShowCards">
        <grid v-if="gridCards.length > 0" :cards="gridCards" class="mb-3" />
        <cards v-if="smallCards.length > 0" :cards="smallCards" class="mb-3" />
        <cards v-if="largeCards.length > 0" :cards="largeCards" size="large" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HasCards from '@/mixins/HasCards'
export default {
  name: 'home',
  mixins: [HasCards],
  components: {},
  computed: {
    // card api
    cardsEndpoint() {
      return `/cards`
    }
  }
}
</script>
