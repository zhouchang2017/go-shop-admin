<template>
  <div>
    <slot>
      <heading :level="1" class="mb-3">{{ panel.name }}</heading>
    </slot>

    <div class="card mb-6 " :class="{ 'py-3 px-6': !panel.without_pending }">
      <component
        :key="index"
        v-for="(field, index) in fields"
        :is="resolveComponentName(field)"
        :resource-name="resourceName"
        :resource-id="resourceId"
        :resource="resource"
        :field="field"
        @actionExecuted="actionExecuted"
      />

      <div
        v-if="shouldShowShowAllFieldsButton"
        class="bg-gray-200 -mt-px -mx-6 -mb-6 border-t border-40 p-3 text-center rounded-b text-center"
      >
        <button
          class="block w-full dim text-sm text-gray-800 font-bold"
          @click="showAllFields"
        >
          Show All Fields
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['resourceName', 'resourceId', 'resource', 'panel'],

  methods: {
    /**
     * Resolve the component name.
     */
    resolveComponentName(field) {
      return field.prefix_component
        ? 'detail-' + field.component
        : field.component
    },

    /**
     * Show all of the Panel's fields.
     */
    showAllFields() {
      return (this.panel.limit = 0)
    },

    /**
     * Handle the actionExecuted event and pass it up the chain.
     */
    actionExecuted() {
      this.$emit('actionExecuted')
    }
  },

  computed: {
    /**
     * Limits the visible fields.
     */
    fields() {
      if (this.panel.limit > 0) {
        return this.panel.fields.slice(0, this.panel.limit)
      }

      return this.panel.fields
    },

    /**
     * Determines if should display the 'Show all fields' button.
     */
    shouldShowShowAllFieldsButton() {
      return this.panel.limit > 0
    }
  }
}
</script>
