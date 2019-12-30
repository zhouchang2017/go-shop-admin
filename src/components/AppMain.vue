<template>
  <main
    class="bg-gray-200 min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible pt-16"
  >
    <transition name="fade" mode="out-in">
      <!-- <keep-alive :include="cachedViews">
        <router-view class="p-10 flex w-full" :key="key" />
      </keep-alive> -->
      <router-view class="md:p-10 p-3 w-full" :key="key" />
    </transition>
  </main>
</template>

<script>
export default {
  name: 'app-main',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>
