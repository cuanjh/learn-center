export default {
  updateCourseLangsList (state, data) {
    state.courseLangsList = data
  },
  // 更新快速登录登录用户的信息
  updateLoginInfo (state, data) {
    state.loginInfo = data
    console.log('快速登录用户信息', data)
  },
  // 更新用户信息
  updateUserInfo (state, data) {
    state.userInfo = data.info
    sessionStorage.setItem('userInfo', JSON.stringify(state.userInfo))
    console.log('userInfo', state.userInfo)
  }
}
