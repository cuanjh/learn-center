import { newHttpNoLogin, newHttpLogin } from '../../api/api'
import config from '../../api/config'

export default {
  // 新登录接口手机快速登录
  userLogin ({commit}, params) {
    return newHttpNoLogin(config.umUserLoginApi, params).then((res) => {
      commit('updateLoginInfo', res)
    })
  },
  // 获取手机验证码
  getSendCode ({commit}, params) {
    return newHttpNoLogin(config.umSendCodeApi, params)
  },
  // 获取用户信息
  getUserInfo ({commit}) {
    newHttpLogin(config.umUserInfoApi).then((res) => {
      commit('updateUserInfo', res)
    })
  },
  // 获取语言列表
  getLangsList ({commit}) {
    newHttpNoLogin(config.umLangsListApi).then(res => {
      commit('updateCourseLangsList', res.langsInfo)
    })
  }
}
