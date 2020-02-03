<template>
  <div class="card-item">
    <div class="card-item__label">
      <slot>
        <h4>{{ label }}</h4>
      </slot>
    </div>
    <div class="card-item__content">
      <slot name="value">
        <p v-if="fieldValue && !shouldDisplayAsHtml">
          {{ fieldValue }}
        </p>
        <div
          v-else-if="fieldValue && shouldDisplayAsHtml"
          v-html="field.value"
        ></div>
        <p v-else>-</p>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true
    },
    fieldName: {
      type: String,
      default: ''
    }
  },
  computed: {
    label() {
      return this.fieldName || this.field.name
    },

    fieldValue() {
      if (
        this.field.value === '' ||
        this.field.value === null ||
        this.field.value === undefined
      ) {
        return false
      }

      return String(this.field.value)
    },

    shouldDisplayAsHtml() {
      return this.field.as_html
    }
  }
}
</script>
