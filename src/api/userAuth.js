import { httpNoLogin } from './api.js'
import config from './config.js'
export default {
  courseLists () {
    return httpNoLogin(config.courseList_v2)
  },
  login (params) {
    return httpNoLogin(config.userLogin, params)
  },
  sendCode (params) {
    return httpNoLogin(config.phoneVertify, params)
  },
  checkCaption (params) {
    return httpNoLogin(config.checkCaptionCode, params)
  },
  signUp (params) {
    return httpNoLogin(config.register, params)
  },
  checkPhone (params) {
    return httpNoLogin(config.checkPhonenumber, params)
  },
  checkEmail (params) {
    return httpNoLogin(config.checkEmail, params)
  },
  sendEmail (params) {
    return httpNoLogin(config.sendEmail, params)
  },
  sendCodeReset (params) {
    return httpNoLogin(config.getPhoneVertify, params)
  },
  resetPwdPhone (params) {
    return httpNoLogin(config.resetPwdPhone, params)
  },
  resetPwdEmail (params) {
    return httpNoLogin(config.resetPwdEmail, params)
  }
}
