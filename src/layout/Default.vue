<template>
  <div class="flex flex-col">
    <Header />
    <div class="flex-1 flex">
      <Sidebar />
      <Main />
    </div>
  </div>
</template>

<script>
export default {
  name: 'default-layout',
  components: {
    Header: () => import('@/components/Header'),
    Sidebar: () => import('@/components/Sidebar'),
    Main: () => import('@/components/Main')
  },
  computed: {
    // minHeight() {}
  }
}
</script>

<style></style>
