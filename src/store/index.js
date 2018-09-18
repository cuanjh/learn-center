import user from './modules/user'
import course from './modules/course'
import learnSystem from './modules/learnSystem'
// import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({modules: {
  user,
  course,
  learn: learnSystem
}})
