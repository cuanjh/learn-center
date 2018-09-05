// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import VueValidator from 'vue-validator'
// import BootstrapVue from 'bootstrap-vue'

import routes from './router/index'
import store from './store/index'
import moreLanguage from './vueI18/locale.js'
import {urlfix} from './filter/index'
import { Cookie } from './tool/cookie'
import './../static/css/animate.css'
import './../static/css/reset.css'
import './../static/css/style.css'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

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
    if (window.localStorage.isLogin === '1') {
      next()
    } else if (to.path !== '/') {
      next({ path: '/auth/login' })
    }
  } else {
    next()
  }
})

var lang = Cookie.getCookie('talkmateLang')
if (lang == null) {
  try {
    if (window.navigator.browserLanguage !== 'undefined' || window.navigator.browserLanguage !== null) {
      if (window.navigator.systemLanguage === 'zh-CN' || window.navigator.systemLanguage === 'zh') {
        Vue.config.lang = 'cn'
      } else {
        Vue.config.lang = 'en'
      }
    }
    if (window.navigator.language.substring(0, 2) === 'zh') {
      Vue.config.lang = 'cn'
    } else {
      Vue.config.lang = 'en'
    }
  } catch (e) {
    console.log('<=ie9')
  }
} else {
  Vue.config.lang = lang
}

// use validator
Vue.use(VueValidator)

// 验证 图片验证码
Vue.validator('validatorCodeValidator', (val) => {
  return /^\d{5}$/.test(val)
})

const i18n = new VueI18n({
  locale: Vue.config.lang,
  messages: moreLanguage
})

store.subscribe((mutation, state) => {
  console.log(mutation.type)
  console.log(mutation.payload)
})

store.subscribeAction((action, state) => {
  console.log(action.type)
  console.log(action.payload)
})
/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store,
  i18n
}).$mount('#app')
