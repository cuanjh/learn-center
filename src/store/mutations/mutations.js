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
  },
  // 更新上传七牛的token
  updateFileQiniuToken (state, data) {
    state.FileQiniuToken = data.token
  },
  updatereCommendRadioTeachers (state, data) {
    state.recommendRadioTeachers = data
  },
  updateLangsState (state, data) {
    let opt = []
    opt.push({'lan_code': data.currentLang.lan_code, 'text': data.currentLang.name + '优先'})
    opt.push({'lan_code': data.skillLang.lan_code, 'text': '母语优先'})
    state.langsStateSel = opt
    console.log('语言状态选项', state.langsStateSel)
  },
  updateRecommendRadios (state, res) {
    state.recommendRadioPage = res.page
    state.recommendRadios = res.data
    console.log('推荐的电台', state.recommendRadios)
  }
}
