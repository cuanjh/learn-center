import { httpNoLogin, httpLogin, httpSnsUrl, httpGetToken } from '../../api/api'
import config from '../../api/config'

export default {
  // 新登录接口手机快速登录
  userLogin ({commit}, params) {
    return httpNoLogin(config.umUserLoginApi, params).then((res) => {
      commit('updateLoginInfo', res)
    })
  },
  // 第三方登录
  userSnsLogin ({commit}, params) {
    return httpSnsUrl(config.umUserSnsLoginApi, params)
  },
  // 新密码登录接口
  userPwdLogin ({commit}, params) {
    return httpNoLogin(config.umUserPwdLoginApi, params)
  },
  // 用户信息里面修改密码
  userEditPwd ({commit}, params) {
    return httpNoLogin(config.umUserEditPwdApi, params)
  },
  // 获取手机验证码
  getSendCode ({commit}, params) {
    return httpNoLogin(config.umSendCodeApi, params)
  },
  // 获取用户信息
  getUserInfo ({commit}) {
    return httpLogin(config.umUserInfoApi).then((res) => {
      commit('updateUserInfo', res)
      return res
    })
  },
  // 修改用户信息
  updateUserInfo ({commit}, params) {
    return httpLogin(config.umUpdateUserInfoApi, params)
  },
  // 绑定手机号
  userBindPhone ({commit}, params) {
    return httpLogin(config.umUserBindPhoneApi, params)
  },
  // 验证手机号是否存在接口
  userExistsPhone ({commit}, params) {
    return httpLogin(config.umUserExistsPhoneApi, params)
  },
  // 语言设置状态接口
  getLangsState ({commit, dispatch}, params) {
    httpLogin(config.umLangsStateApi).then(res => {
      commit('updateLangsState', res.state)
      let curLanCode = res.state.currentLang['lan_code']
      dispatch('getRecommendRadios', {'lan_code': curLanCode, limit: 6, page: 1})
    })
  },
  getCourseList ({commit}) {
    return httpLogin(config.courseListApi)
  },
  // 获取语言列表
  getLangsList ({commit}) {
    httpNoLogin(config.umLangsListApi).then(res => {
      commit('updateCourseLangsList', res.hotLangsInfo.concat(res.langsInfo))
    })
  },
  // 动态获取token的方法
  getUploadFileToken ({ commit, start }) {
    return httpGetToken(config.qiniuFilesToken)
  },
  // 濒危语言地图列表
  getEndangeredMap ({commit}, params) {
    return httpLogin(config.endangeredMapListApi, params)
  },
  // 濒危语言详情
  getEndangeredDetail ({commit}, params) {
    return httpLogin(config.endangeredLangDetailApi, params)
  },
  // 获取推荐的电台主播
  getRecommendTeachers ({commit}, params) {
    httpLogin(config.recommendRadioTeachersApi).then(res => {
      commit('updatereCommendRadioTeachers', res.data)
    })
  },
  // 获取推荐的电台
  getRecommendRadios ({commit}, params) {
    httpLogin(config.disvRecommendRadiosApi, params).then(res => {
      commit('updateRecommendRadios', res)
    })
  },
  // 获取推荐的电台数据
  getRecommendRadiosIndex ({commit}, params) {
    return httpLogin(config.disvRecommendRadiosApi, params)
  },
  // 获取世界语言地图统计数据
  getMapLangInfo ({commit}, params) {
    return httpLogin(config.langMapInfoApi, params)
  },
  // 随机获取推荐的电台
  getRandomRadio ({commit}, params) {
    return httpLogin(config.getRandomRadioApi, params)
  }
}
