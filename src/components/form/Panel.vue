<template>
  <div v-if="panel.fields.length > 0">
    <heading :level="1" class="mb-3">{{ panel.name }}</heading>

    <card :class="{ 'py-6 px-6': !panel.without_pending }">
      <component
        v-for="(field, index) in panel.fields"
        :key="index"
        :is="resolveComponentName(field)"
        :errors="validationErrors"
        :resource-id="resourceId"
        :resource-name="resourceName"
        :field="field"
        @file-deleted="$emit('update-last-retrieved-at-timestamp')"
      />
    </card>
  </div>
</template>

<script>
export default {
  name: 'FormPanel',

  props: {
    panel: {
      type: Object,
      required: true
    },

    name: {
      default: 'Panel'
    },

    mode: {
      type: String,
      default: 'form'
    },

    fields: {
      type: Array,
      default: () => []
    },

    validationErrors: {
      type: Object,
      required: true
    },

    resourceName: {
      type: String,
      required: true
    },

    resourceId: {
      type: [Number, String]
    }
  },
  methods: {
    /**
     * Resolve the component name.
     */
    resolveComponentName(field) {
      return field.prefix_component
        ? `${this.mode}-${field.component}`
        : field.component
    }
  }
}
</script>
