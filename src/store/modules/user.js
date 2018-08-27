import { httpLogin } from '../../api/api'
import config from '../../api/config'

const state = {
  isLogin: '0',
  userInfo: {}
}

const getters = {
  langCode (state) {
    return state.userInfo.current_course_code ? state.userInfo.current_course_code.split('-')[0] : ''
  }
}

const actions = {
  getUserInfo ({commit}) {
    return httpLogin(config.userInfo).then((res) => {
      commit('updateUserInfo', res)
    })
  },
  logout ({commit}) {
    return httpLogin(config.logout)
  }
}
const mutations = {
  updateUserInfo: function (state, data) {
    state.userInfo = data
    localStorage.setItem('userInfo', JSON.stringify(data))
  },
  updateIsLogin (state, isLogin) {
    state.isLogin = isLogin
    localStorage.setItem('isLogin', isLogin)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
