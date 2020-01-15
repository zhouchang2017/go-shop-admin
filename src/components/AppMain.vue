<template>
  <main
    class="bg-gray-200 min-h-screen w-full lg:static lg:max-h-full lg:overflow-visible pt-16"
  >
    <!-- <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1">处理中心</el-menu-item>
      <el-submenu index="2">
        <template slot="title">我的工作台</template>
        <el-menu-item index="2-1">选项1</el-menu-item>
        <el-menu-item index="2-2">选项2</el-menu-item>
        <el-menu-item index="2-3">选项3</el-menu-item>
        <el-submenu index="2-4">
          <template slot="title">选项4</template>
          <el-menu-item index="2-4-1">选项1</el-menu-item>
          <el-menu-item index="2-4-2">选项2</el-menu-item>
          <el-menu-item index="2-4-3">选项3</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="3" disabled>消息中心</el-menu-item>
      <el-menu-item index="4"
        ><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item
      >
    </el-menu> -->
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
