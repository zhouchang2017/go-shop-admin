<template>
  <div class="w-full">
    <div class="font-bold text-2xl text-gray-700 mb-3 uppercase">Brand</div>
    <div class="flex w-full items-center">
      <z-search-input v-model="search" />
      <div class="ml-auto">
        <a
          class="inline-flex cursor-pointer text-center items-center px-3 py-2 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline active:bg-gray-900"
        >
          Create
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index-header',
  data() {
    return {
      search: ''
    }
  }
}
</script>

<style></style>
