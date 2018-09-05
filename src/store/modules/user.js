import { httpLogin, httpNoLogin, httpLoginUrl } from '../../api/api'
import config from '../../api/config'
import * as useMethod from './userMethod'
import expense from './expense'

const state = {
  showLoading: true, // 用来判断加载状态程序
  courseShow: false, // 课程为空时的逻辑判断
  productList: {}, // 会员产品接口
  courseRader: {}, // 档案和课程数据接口
  courseRaderRastart: {}, // 档案和课程数据过渡防止刷新和数据过渡报错
  courseArchives: {}, // 新的档案接口---后端直接生成
  coinsProduct: [], // 充值金币
  purchaseIconPay: false,
  confirmAlert: false,
  successAlert: false,
  purchaseSuccess: false,
  errorTip: false,
  anonymousCover: false,
  alertType: false,
  uploadPhotoUrl: '',
  codeNum: '',
  isLogin: '0',
  languageHandler: 'zh-CN',
  userInfo: {},
  record: {}, // 金币的交易记录
  num: 0, // 收支详细默认的数据分页
  payShow: false, // 支付数据请求成功后显示
  pay: {
    aliWebPayUrl: '', // 阿里支付URL跳转地址
    tradeNo: '', // 订单号
    productId: '' // 套餐ID
  },
  loadingMore: false // 显示收支详细是否加载完成
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
  // 用于给还没有绑定该手机号码的用户发送验证码
  sendCode ({commit}, params) {
    return httpNoLogin(config.phoneVertify, params)
  },
  // 绑定邮箱
  bindEmail ({commit}, email) {
    return httpLogin(config.bindEmail, { email: email })
  },
  // 新的档案接口
  getCourseArchives ({commit}) {
    httpLogin(config.getCourseArchives).then((result) => {
      commit('updateCourseArchives', result)
    })
  },
  getTradeRecord ({commit, dispatch, state}) {
    commit('dataPageing') // 用于分页展示使用
    commit('showLoading')
    var timeTemp = new Date().getTime()
    var pageSize = state.num * 16 // 默认显示的数量
    httpLogin(config.getTradeRecord, {
      page_time: timeTemp,
      page_size: pageSize,
      money_type: 'coins'
    }).then((res) => {
      console.log(res)
      if (res['trade_records'].length === pageSize) {
        commit('showloadingMore')
      } else {
        commit('hideloadingMore')
      }
      commit('hideLoading')
      commit('updateTradeRecord', res['trade_records'])
    })
  },
  // 获取金币充值获取金币后要更新用户信息 升级会员也是如此要更新用户信息
  getCoinsProduct ({commit, dispatch}) {
    httpLogin(config.getCoinsProduct, {
      product_type: 'coins',
      pay_area: 'CN',
      plat_form: 'WEB',
      inner_product_version: 1
    }).then((res) => {
      commit('updateCoinsProduct', res['products'])
    })
  },
  // 创建ali支付订单
  createAliWebOrder ({commit, state}, productId) {
    commit('getpayshow')
    httpLogin(config.createAliWebOrder, { product_id: productId }).then((result) => {
      /**
       * 先临时这么处理, 这里不应该使用vuex进行数据的传递, 这是根本问题
       */
      result.productId = productId
      commit('createAliWebOrderMutation', result)
      commit('getpayhide')
    })
  },
  // 会员产品接口的实现
  getMemberProductsList ({commit, state}) {
    commit('showLoading')
    httpLogin(config.getMemberProductsList, {
      product_type: 'member',
      pay_area: 'CN',
      plat_form: 'WEB',
      inner_product_version: 1
    }).then((res) => {
      commit('updateMemberProductsList', res['products'])
      commit('hideLoading')
    })
  },
  // 会员卡激活账号
  getMemberCard ({commit, state}, codeNum) {
    return httpLogin(config.getMemberCard, { card_no: this.codeNum })
  },
  updateInfo ({commit}, params) {
    return httpLogin(config.updateInfo, params)
  },
  resetPwd ({commit}, params) {
    return httpLogin(config.resetPwd, params)
  },
  changePwd ({commit}, params) {
    return httpLogin(config.changePwd, params)
  },
  getCountries ({commit}, params) {
    return httpLogin(config.getCountries, params)
  },
  getLanguages ({commit}, params) {
    return httpNoLogin(config.getLanguages, params)
  },
  bindPhoneNumber ({commit}, params) {
    return httpLogin(config.bindPhoneNumber, params)
  },
  resetAnonymous ({commit}, params) {
    return httpLogin(config.resetAnonymous, params)
  },
  unbindIdentity ({commit}, params) {
    return httpLogin(config.unbindIdentity, params)
  },
  uploadUserPhoto ({ commit }, params) {
    return httpLogin(config.uploadUserPhoto, params)
  },
  getUploadPhotoUrl ({ commit }, params) {
    var url = httpLoginUrl(config.uploadUserPhoto)
    commit('updateUploadPhotoUrl', url)
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
  getCourseProgress (state) {
    state.courseRader = state.courseRaderRastart
    state.showLoading = false
  },
  updateCourseArchives (state, response) {
    state.courseArchives = response
  },
  updateTradeRecord (state, record) {
    var rec = useMethod.expense(record, expense['expense'][state.languageHandler], state.languageHandler, expense['describle'][state.languageHandler])
    state.record = rec
  },
  dataPageing (state) {
    state.num++
  },
  showLoading (state) {
    state.showLoading = true
  },
  hideLoading (state) {
    state.showLoading = false
  },
  showloadingMore (state) {
    state.loadingMore = false
  },
  hideloadingMore (state) {
    state.loadingMore = true
  },
  updateCoinsProduct (state, product) {
    state.coinsProduct = product
  },
  getpayshow (state) {
    state.payShow = false
  },
  getpayhide (state) {
    state.payShow = true
  },
  createAliWebOrderMutation (state, response) {
    state.pay.aliWebPayUrl = response.redirect_url
    state.pay.productId = response.productId
    state.pay.tradeNo = response.trade_no
  },
  updateMemberProductsList (state, response) {
    state.productList = response
  },
  updatePurchaseIconPay (state, flag) {
    state.purchaseIconPay = flag
  },
  UserVipCode (state, num) {
    state.codeNum = num
  },
  updateConfirmAlert (state, flag) {
    state.confirmAlert = flag
  },
  updateSuccessAlert (state, flag) {
    state.successAlert = flag
  },
  updateErrorTip (state, flag) {
    state.errorTip = flag
  },
  updatePurchaseSuccess (state, flag) {
    state.purchaseSuccess = flag
  },
  updateUserAnonymous (state, flag) {
    state.anonymousCover = flag
  },
  updateAlertType (state, flag) {
    state.alertType = flag
  },
  updateUploadPhotoUrl (state, url) {
    state.uploadPhotoUrl = url
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
