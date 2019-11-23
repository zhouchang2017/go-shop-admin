<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="container">
      <div class="flex justify-center">
        <!-- Row -->
        <div class="w-full xl:w-3/4 lg:w-11/12 flex">
          <!-- Col -->
          <div
            class="w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
            style="background-image: url('https://source.unsplash.com/K4mSJ7kc0As/600x800')"
          ></div>
          <!-- Col -->
          <div
            class="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none"
          >
            <h3 class="pt-4 text-2xl text-center">Welcome Back!</h3>
            <form class="px-8 pt-6 pb-8 mb-4 bg-white rounded">
              <div class="mb-4">
                <z-input
                  v-model="username"
                  label="Username"
                  placeholder="请输入密码"
                />
              </div>
              <div class="mb-4">
                <label
                  class="block mb-2 text-sm font-bold text-gray-700"
                  for="password"
                >
                  Password
                </label>
                <input
                  class="bg-gray-200 border-red-500 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="password"
                  type="password"
                  placeholder="******************"
                />
                <p class="text-xs italic text-red-500">
                  Please choose a password.
                </p>
              </div>
              <div class="mb-4">
                <input
                  class="mr-2 leading-tight"
                  type="checkbox"
                  id="checkbox_id"
                />
                <label class="text-sm" for="checkbox_id">
                  Remember Me
                </label>
              </div>
              <div class="mb-6 text-center">
                <button
                  class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 transition-bg focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Sign In
                </button>
              </div>
              <hr class="mb-6 border-t" />
              <div class="text-center">
                <p class="text-gray-600">
                  &copy;2019 https://github.com/zhouchang2017. All rights
                  reserved.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: ''
    }
  }
}
</script>

<style></style>
