<template>
  <div class="flex flex-col">
    <app-header />
    <div class="flex-1 flex">
      <app-sidebar />
      <app-main />
    </div>
  </div>
</template>

<script>
export default {
  name: 'default-layout',

  computed: {
    // minHeight() {}
  }
}
</script>

<style></style>
