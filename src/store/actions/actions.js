import { httpNoLogin, httpLogin } from '../../api/api'
import config from '../../api/config'

export default {
  // 新登录接口手机快速登录
  userLogin ({commit}, params) {
    return httpNoLogin(config.umUserLoginApi, params).then((res) => {
      commit('updateLoginInfo', res)
    })
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
    httpLogin(config.umUserInfoApi).then((res) => {
      commit('updateUserInfo', res)
    })
  },
  // 获取语言列表
  getLangsList ({commit}) {
    httpNoLogin(config.umLangsListApi).then(res => {
      commit('updateCourseLangsList', res.hotLangsInfo.concat(res.langsInfo))
    })
  }
}
