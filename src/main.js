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

// 全局自动懒加载组件注册
// 组件名称规则 dirname-component
// 例如 components/form/SearchInput.vue => form-search-input
//     components/Card.vue => card
//     components/icons/editor/Bold.vue => icons-editor-bold
require
  .context(`@/components`, true, /\.vue$/i)
  .keys()
  .forEach(key => {
    let path = key.replace('./', '')
    let prefix = key
      .split('/')
      .filter(item => !item.includes('.'))
      .join('-')
      .toLowerCase()

    const name = [
      prefix,
      _.kebabCase(
        key
          .split('/')
          .pop()
          .replace(/\.\w+$/, '')
      )
    ]
      .filter(item => item)
      .join('-')

    Vue.component(name, () => import(`@/components/${path}`))
  })

Vue.prototype.$Bus = new Vue()

Vue.use(Element)
Vue.mixin(Global)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
