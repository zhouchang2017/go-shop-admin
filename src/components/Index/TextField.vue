<template>
  <div>
    <router-link
      v-if="hasLink"
      :to="{
        name: field.link_option.routeName,
        params: { id: field.link_option.id }
      }"
      class="cursor-pointer inline-block text-blue-500 hover:font-bold mr-3 focus:outline-none"
    >
      <div v-if="field.asHtml" v-html="field.value"></div>
      <span v-else class="whitespace-no-wrap">
        {{ field.value }}
      </span></router-link
    >
    <span v-else class="whitespace-no-wrap">
      {{ field.value || '-' }}
    </span>
  </div>
</template>

<script>
export default {
  props: ['resourceName', 'field'],
  computed: {
    hasLink() {
      return !!this.field.link_option
    }
  }
}
</script>
