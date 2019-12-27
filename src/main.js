import Vue from 'vue'
import Element from 'element-ui'

import './plugins/axios'
import './plugins/lodash'

import App from './App.vue'
import router from './router'
import store from './store'
import './assets/tailwind.scss'
import './filters'
import Global from './mixins/Global'
Vue.config.productionTip = false

const forms = require.context(`@/components/form`, true, /\.vue$/i)
const icons = require.context(`@/components/icons`, true, /\.vue$/i)
const IndexFields = require.context(`@/components/Index`, true, /\.vue$/i)
const DetailFields = require.context(`@/components/Detail`, true, /\.vue$/i)
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
automaticGlobalRegistration(IndexFields, 'index')
automaticGlobalRegistration(DetailFields, 'detail')

Vue.component('heading', () => import('@/components/Heading'))
Vue.prototype.$Bus = new Vue()

Vue.use(Element)
Vue.mixin(Global)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
