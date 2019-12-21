<template>
  <div class="flex flex-col justify-between overflow-y-auto sticky top-16 max-h-screen pt-12 pb-4 -mt-12">
    <div class="mb-8">
      <h5 class="text-gray-500 uppercase tracking-wide font-bold text-sm lg:text-xs">
        {{ title }}
      </h5>
      <ul class="mt-4 overflow-x-hidden">
        <slot />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hash-nav',
  props: {
    title: {
      type: String,
      default: 'On this page'
    }
  }
}
</script>
