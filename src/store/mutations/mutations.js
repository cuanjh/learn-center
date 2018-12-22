export default {
  updateCourseLangsList (state, data) {
    state.courseLangsList = data
  },
  updateLoginInfo (state, data) {
    state.loginInfo = data
  },
  updateUserInfo (state, data) {
    state.userInfo = data.info
  }
}
