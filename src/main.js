import Vue from 'vue'
import Element from 'element-ui'

import './plugins/axios'
import './plugins/lodash'

import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.scss'
import './filters'

Vue.config.productionTip = false

const forms = require.context(`@/components/form`, true, /\.vue$/i)
const icons = require.context(`@/components/icons`, true, /\.vue$/i)
const automaticGlobalRegistration = (ctx, prefix = '') => {
  // 组件全局注册
  ctx.keys().forEach(key => {
    // Get component config
    const componentConfig = ctx(key)

    const name = _.upperFirst(
      _.camelCase(
        prefix +
          '' +
          key
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
      )
    )
    Vue.component(name, componentConfig.default || componentConfig)
  })
}

automaticGlobalRegistration(forms, 'z')
automaticGlobalRegistration(icons, 'i')

Vue.use(Element)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
