'use strict'

import Vue from 'vue'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.VUE_APP_BASE_API || process.env.apiUrl || ''
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (store.getters.token) {
      // 每次请求携带token
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    if (_.has(response, 'headers.refresh-token')) {
      let refreshToken = _.get(response, 'headers.refresh-token')
      if (refreshToken) {
        store.commit('auth/SET_TOKEN', refreshToken)
      }
    }
    return response
  },
  async function(error) {
    // Do something with response error
    const { status } = error.response

    switch (status) {
      case 401:
        Message({
          message: error.response.statusText,
          type: 'error',
          duration: 5 * 1000
        })
        await store.dispatch('auth/resetToken')
        // 跳转登录页
        router.replace({ name: 'login' }).catch(err => {})
        break
      case 403:
        Message({
          message: error.response.statusText,
          type: 'error',
          duration: 5 * 1000
        })
        return
      case 500:
        let message = _.get(
          error,
          'response.data.message',
          _.get(error, 'response.statusText')
        )
        Message({
          message: message,
          type: 'error',
          duration: 5 * 1000
        })
        return
    }
    return Promise.reject(error)
  }
)

Plugin.install = function(Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      }
    },
    $axios: {
      get() {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)
export default Plugin
