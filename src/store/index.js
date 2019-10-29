import state from './state/state'
import actions from './actions/actions'
import mutations from './mutations/mutations'
import user from './modules/user'
import course from './modules/course'
import learnSystem from './modules/learnSystem'
// import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    user,
    course,
    learn: learnSystem
  }
})
