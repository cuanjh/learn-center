// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
// import BootstrapVue from 'bootstrap-vue'

import routes from './router/index'
import store from './store/index'
import moreLanguage from './vueI18/locale.js'
import {urlfix} from './filter/index'
import Cookie from './tool/cookie'
import {getOSAndBrowser} from './tool/browser'
// import 'babel-polyfill'

require('./../static/css/animate.css')
require('./../static/css/reset.css')
require('./../static/css/style.css')
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

// require('../static/jquery-1.10.2.js')
// require('./../static/cropper.min.js')
// require('./../static/sitelogo')
require('./../static/bootstrap.min.js')

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueI18n)
// Vue.use(BootstrapVue)

Vue.filter('urlFix', urlfix)

Vue.config.productionTip = false
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    let isLogin = Cookie.getCookie('isLogin')
    if (isLogin === '1') {
      next()
    } else if (to.path !== '/') {
      next({ path: '/auth/login' })
    }
  } else {
    let browser = getOSAndBrowser().browser
    let reg = new RegExp('\\d+', 'g')
    let version = browser.match(reg)[0]
    if ((browser.indexOf('Edge') > -1) || !((browser.indexOf('Firefox') > -1 && version >= 21) || (browser.indexOf('Chrome') > -1 && version >= 17) || (browser.indexOf('Opera') > -1 && version >= 18))) {
      if (to.path === '/download') {
        next()
      } else {
        next({ path: '/download' })
      }
    } else {
      next()
    }
  }
})

Vue.config.lang = 'cn'

const i18n = new VueI18n({
  locale: Vue.config.lang,
  messages: moreLanguage
})

// store.subscribe((mutation, state) => {
//   console.log(mutation.type)
//   console.log(mutation.payload)
// })

// store.subscribeAction((action, state) => {
//   console.log(action.type)
//   console.log(action.payload)
// })
/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store,
  i18n
}).$mount('#app')
