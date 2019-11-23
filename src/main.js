import Vue from 'vue'
import './plugins/axios'
import './plugins/lodash'

import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.css'

Vue.config.productionTip = false

// form组件全局注册
const files = require.context('@/components/form', true, /\.vue$/i)
files.keys().map(key => {
  Vue.component(files(key).default.name, files(key).default)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
