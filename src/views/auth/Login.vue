<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="container">
      <div class="flex justify-center">
        <!-- Row -->
        <div class="w-full xl:w-3/4 lg:w-11/12 flex">
          <!-- Col -->
          <div
            class="w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
            style="background-image: url('/images/login_bg.jpeg')"
          ></div>
          <!-- Col -->
          <div
            v-loading="loading"
            class="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none"
          >
            <h3 class="pt-4 text-2xl text-center text-gray-800">
              Welcome Back!
            </h3>
            <form-form-warp
              :ref="formName"
              :value="form"
              :rules="rules"
              class="px-8 pt-6 pb-8 mb-4 bg-white rounded"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
              </el-form-item>
              <el-form-item show-password label="密码" prop="password">
                <el-input type="password" v-model="form.password"></el-input>
              </el-form-item>
              <el-button type="primary" class="w-full block mt-2" @click="login"
                >Sign In</el-button
              >
            </form-form-warp>

            <hr class="mb-6 border-t" />
            <div class="text-center">
              <p class="text-gray-600 text-xs">
                &copy;2019 https://github.com/zhouchang2017. All rights
                reserved.
              </p>
            </div>
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
      formName: 'login-form',
      loading: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, min: 6, trigger: 'blur' }]
      },
      redirect: undefined,
      otherQuery: {}
    }
  },

  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },

  methods: {
    async login() {
      let data = await this.$refs[this.formName].submit()
      try {
        this.loading = true
        let res = await this.$store.dispatch('auth/login', data)
        this.loading = false
        this.$router
          .push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
          .catch(err => {})
      } catch ({ response }) {
        if (response.status === 422) {
          const message = response.data.message
          this.$message.error(message)

          this.$refs[this.formName].fields.forEach(item => {
            item.validateMessage = message
            item.validateState = 'error'
            item.showMessage = true
          })
        }
        this.loading = false
      }
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },

    async enterKeyDownEvent(event) {
      if (event.keyCode === 13) {
        await this.login()
      }
    }
  },
  mounted() {
    window.addEventListener('keypress', this.enterKeyDownEvent)
  },
  beforeDestroy() {
    window.removeEventListener('keypress', this.enterKeyDownEvent)
  }
}
</script>

<style></style>
