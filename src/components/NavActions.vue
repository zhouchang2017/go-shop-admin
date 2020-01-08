<template>
  <div v-if="shouldShowActions">
    <h5
      class="text-gray-500 uppercase tracking-wide font-bold text-sm lg:text-xs"
    >
      actions
    </h5>
    <ul class="mt-4 overflow-x-hidden">
      <li class="mb-2" v-for="(action, index) in actions" :key="index">
        <component
          :is="action.component"
          :resourceName="resourceName"
          :action="action"
          :selectedResources="selectedResources"
        />
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    resourceName: String,
    actions: {
      type: Array,
      default: () => []
    },
    selectedResources: {
      type: [Array, String],
      default: () => []
    }
  },
  computed: {
    shouldShowActions() {
      return _.get(this, 'actions', []).length > 0
    }
  }
}
</script>
