import Vue from 'vue'
import config from './config'
import Cookies from 'js-cookie'
import { deviceId } from './../tool/untils.js'
import $ from 'jquery'

export const httpLogin = (_url, _params) => { // 已经登录
  if (!_params) { // 无参数请求情况
    _params = {}
  }
  _params.HTTP_API_VERSION = config.API_VERSION
  _params.device_id = Cookies.get('device_id')
  _params.user_id = Cookies.get('user_id')
  _params.verify = Cookies.get('verify')
  return Vue.http.jsonp(config.apiUrl + _url, {params: _params})
    .then(res => {
      if (res['data']['success']) {
        return new Promise((resolve, reject) => {
          resolve((res['data']))
        })
      } else {
        if (res['data']['code'][0] === 1005) {
          localStorage.setItem('isLogin', 0)
          window.location.href = '' // 回到登录
        } else {
          return new Promise((resolve, reject) => {
            resolve((res['data']))
          })
        }
      }
    }, error => {
      // 请求异常处理
      console.log(error)
    })
}
export const httpGetToken = (_url) => { // 已经登录
  var data = {
    HTTP_API_VERSION: config.API_VERSION,
    device_id: Cookies.get('device_id'),
    user_id: Cookies.get('user_id'),
    verify: Cookies.get('verify')
  }

  var p = new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: config.apiUrl + _url,
      data: data,
      dataType: 'jsonp',
      success: (res) => {
        resolve(res)
      },
      error: (err) => {
        console.log(err)
        reject(err)
      }
    })
  })
  return p
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
  return Vue.http.jsonp(config.apiUrl + _url, {params: _params})
    .then(res => {
      return res['data']
    }, error => {
      // 请求异常处理
      console.log(error)
    })
}
export const httpAssets = (_url) => { // 请求资源
  return Vue.http.get(_url)
    .then(res => {
      return new Promise((resolve, reject) => {
        resolve(res['data'])
      })
    }, error => {
      console.log(error)
    })
}
