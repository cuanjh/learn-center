// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import routes from './router/index'
import store from './store/index'
import moreLanguage from './vueI18/locale.js'
import './../static/css/animate.css'
import './../static/css/reset.css'
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueI18n)
Vue.config.productionTip = false
const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
const i18n = new VueI18n({
  locale: 'english',
  messages: moreLanguage
})
/* eslint-disable no-new */
new Vue({
  // el: '#app',
  router,
  store,
  i18n
}).$mount('#app')
