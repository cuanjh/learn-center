import { httpLogin } from '../../api/api'
import config from '../../api/config'

const state = {
  showLoading: true, // 用来判断加载状态程序
  courseShow: false, // 课程为空时的逻辑判断
  courseRader: {}, // 档案和课程数据接口
  courseRaderRastart: {}, // 档案和课程数据过渡防止刷新和数据过渡报错
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
  },
  // 删除已订阅的课程的接口实现
  getDeletePurchase ({ commit, dispatch }, payload) {
    commit('showLoading')
    httpLogin(config.getStudyDelCourse, { code: payload.code }).then((res) => {
      dispatch('getLearnCourses')
    })
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
  },
  showLoading (state) {
    state.showLoading = true
  },
  hideLoading (state) {
    state.showLoading = false
  },
  getCourseProgress (state) {
    state.courseRader = state.courseRaderRastart
    state.showLoading = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
