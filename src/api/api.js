import Vue from 'vue'
import config from './config'
import Cookies from 'js-cookie'
import { deviceId } from './../tool/untils.js'
export const httpLogin = (_url, _params) => { // 已经登录
  if (!_params) { // 无参数请求情况
    _params = {}
  }
  _params.HTTP_API_VERSION = config.API_VERSION
  _params.device_id = Cookies.get('device_id')
  _params.user_id = Cookies.get('user_id')
  _params.verify = Cookies.get('verify')
  return Vue.http.jsonp(config.apiUrl + _url, {params: _params}).then(res => {
    if (res['data']['success']) {
      return res['data']
    } else {
      if (res['data']['code'] === 1005) {
        window.location.href = '' // 回到登录
      } else {
        return res['data']
      }
    }
  }, error => {
    // 请求异常处理
    console.log(error)
  })
}
export const httpNoLogin = (_url, _params) => { // 未登录
  if (!_params) { // 无参数请求情况
    _params = {}
  }
  _params.HTTP_API_VERSION = config.API_VERSION
  if (Cookies.get('device_id')) {
    _params.device_id = Cookies.get('device_id')
  } else {
    let _deviceId = deviceId()
    _params.device_id = _deviceId
    Cookies.set('device_id', _deviceId)
  }
  _params.device_id = Cookies.get('device_id')
  return Vue.http.jsonp(config.apiUrl + _url, {params: _params}).then(res => {
    return res['data']
  }, error => {
    // 请求异常处理
    console.log(error)
  })
}
