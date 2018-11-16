// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import moment from 'moment'

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

require('./../static/bootstrap.min.js')

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueI18n)

Vue.filter('urlFix', urlfix)

// 全局过滤器
Vue.filter('dateFmt', (input, formatString = 'YYYY-MM-DD') => {
  // es5函数参数设置默认值
  // const lastFormatString = formatString || ''
  // moment(input) 把时间字符串转成时间对象
  // format(formatString) 把时间对象，按照指定格式，格式化成符合条件的字符串
  return moment(input).format(formatString)
})

Vue.config.productionTip = false
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    // savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。
    // if (savedPosition) {
    //   return savedPosition
    // } else {
    //   return { x: 0, y: 0 }
    // }
    if (to.meta.keepAlive) {
      let scrollTop = store.state.course.scrollPos[to.name] || 0
      if (!scrollTop) {
        return
      }
      // 对scroll元素进行设置
      setTimeout(() => {
        let documentElem = document.querySelector('html,body')
        if (documentElem) {
          documentElem.scrollTop = scrollTop
        }
      }, 0)
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  // 记录上一个页面的scroll位置
  if (from.name) {
    let contentElem = document.querySelector('html,body')
    let scrollTop = contentElem ? contentElem.scrollTop : '0'
    store.state.course.scrollPos[from.name] = scrollTop
  }
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
    console.log(browser)
    if ((browser.indexOf('Edge') > -1) || !((browser.indexOf('Firefox') > -1 && version >= 21) || (browser.indexOf('Chrome') > -1 && version >= 17) || (browser.indexOf('Opera') > -1 && version >= 18) || (browser.indexOf('Safari') > -1 && version >= 603))) {
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
