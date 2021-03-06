import Vue from 'vue'
import Vuex from 'vuex'
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/app'
Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default new Vuex.Store({
  modules,
  state: {
    sidebarOpen: false,
    routers: [],
    addRouters: [],
    routerLoaded: false,
    resources: [],
    config: {}
  },
  getters: {
    resources: state => state.resources,
    sidebarOpen: state => state.sidebarOpen,
    routerLoaded: state => state.routerLoaded,
    routers: state => state.routers,
    token: state => state.auth.token,
    appConfig: state => state.config
  },
  mutations: {
    TOGGLE_SIDEBAR: (state, flag) => (state.sidebarOpen = flag),
    SET_ROUTES: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
      state.routerLoaded = true
    },
    SET_RESOURCES: (state, resources) => {
      state.resources = resources
    },
    SET_GLOBAL_CONFIG: (state, config) => {
      state.config = config
    }
  },
  actions: {
    loadRouters({ commit }) {
      return new Promise((resolve, reject) => {
        getRouters()
          .then(res => {
            if (res.status === 200) {
              let accessedRouters = transformAsyncRouters(res.data)
              commit('SET_ROUTES', accessedRouters)
              resolve(accessedRouters)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    async loadConfig({ commit }) {
      let { data } = await axios.get('/config')
      const { resources, config } = data
      commit('SET_RESOURCES', resources)
      commit('SET_GLOBAL_CONFIG', config)
      return resources
    }
  }
})

const transformAsyncRouters = routers => {
  return _.reduce(
    routers,
    (res, router) => {
      if (_.has(router, 'children') && router.children.length > 0) {
        router.children = transformAsyncRouters(_.get(router, 'children'))
      }
      router.component = resolveComponent(router.component)
      res.push(router)
      return res
    },
    []
  )
}

const resolveComponent = path => {
  return resolve => {
    require.ensure([], require => {
      resolve(require(`@/views/${path}`))
    })
  }
}
