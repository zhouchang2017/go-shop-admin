import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/getPageTitle'
import store from '@/store'
import resources from '@/store/resources'

Vue.use(VueRouter)

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/layout/Default'),
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home'),
        name: 'dashboard',
        meta: { title: 'Dashboard', icon: 'icons-home', Group: 'App' },
        hidden: false
      }
    ]
  },
  {
    path: '/auth/login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/auth/Login'),
    name: 'login',
    hidden: true
  },
  {
    path: '/auth/auth-redirect',
    component: () => import('@/views/auth/AuthRedirect'),
    hidden: true
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/404')
  }
  // {
  //   name: 'catch-all',
  //   path: '*',
  //   component: () => import('@/views/404')
  // }
]

const createRouter = () =>
  new VueRouter({
    mode: 'history', // require service support
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else {
        if (to.name === from.name) {
          return {}
        }
        return { x: 0, y: 0 }
      }
    },
    routes: constantRoutes,
    linkActiveClass: 'active'
  })

const router = createRouter()

// Detail see:
// https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/auth/login', '/auth/auth-redirect'] // no redirect whitelist
// load async routers
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(_.get(to, 'meta.Title'))

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/auth/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      if (store.getters['auth/hasUser'] || store.getters['routerLoaded']) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('auth/getInfo')
          // 获取系统配置
          let modules = await store.dispatch('loadConfig')
          // 动态注册vuex模块
          modules.forEach(resource => {
            store.registerModule(resource.resourceName, _.cloneDeep(resources))
          })

          // 获取用户路由表
          const accessRouters = await store.dispatch('loadRouters')

          // 路由表排序
          let groupRouters = _.groupBy(accessRouters, item => {
            return item.path.split('/')[0]
          })
          let routers = _.flatten(
            _.map(groupRouters, items => {
              return _.sortBy(items, item => /\:/.test(item.path))
            })
          )
          // 动态追加路由
          router.addRoutes([
            {
              path: '/',
              component: () => import('@/layout/Default'),
              meta: { title: 'Layout' },
              children: routers
            }
          ])

          // // hack method to ensure that addRoutes is complete
          // // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('auth/resetToken')
          next(`/auth/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/auth/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
