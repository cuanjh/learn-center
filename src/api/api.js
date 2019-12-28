/* jshint esversion: 6 */
import Vue from 'vue'
import MD5 from 'md5'
import Moment from 'moment'
import $ from 'jquery'

import config from './config'
import Cookie from '../tool/cookie'
import errorCode from './errorCode'
import { deviceId, randomString } from './../tool/untils.js'

/**
 * 新登录流程接口加密说明文档
 * http://wiki.200h.com/pages/viewpage.action?pageId=5636098
 */

export const httpLogin = (_url, _params) => { // 已经登录
  if (!_params) { // 无参数请求情况
    _params = {}
  }
  _params.appKey = process.env.APP_KEY
  let secret = process.env.APP_SECRET
  _params.HTTP_API_VERSION = '4.1'
  _params.timeStamp = Moment().format('YYYYMMDDHHmmss')
  _params.reqId = randomString(16)
  _params.device_id = Cookie.getCookie('device_id')
  _params.user_id = Cookie.getCookie('user_id') ? Cookie.getCookie('user_id') : ''
  _params.verify = Cookie.getCookie('verify') ? Cookie.getCookie('verify') : ''
  let paramsStr = ''
  let str = ''
  let keys = Object.keys(_params).sort()
  keys.forEach(key => {
    let val = _params[key]
    if ((typeof val === 'object') && val.constructor === Array) {
      val.forEach(item => {
        paramsStr += '&' + key + '=' + item
        str += key + item
      })
    } else {
      paramsStr += '&' + key + '=' + val
      str += key + val
    }
  })
  let sign = MD5(secret + str).toUpperCase()
  return Vue.http.jsonp(process.env.API_HOST + _url + '?sign=' + sign + paramsStr)
    .then(res => {
      if (!res['data']) {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      if (res['data']['success']) {
        return new Promise((resolve, reject) => {
          resolve((res['data']))
        })
      } else {
        if (res['data']['code'][0] + '' === '1005') {
          Cookie.setCookie('isLogin', 0)
          window.location.href = process.env.LOGIN_URL // 回到登录
        } else {
          return new Promise((resolve, reject) => {
            let code = res['data']['code'][0]
            let obj = res['data']
            obj['errorMsg'] = errorCode.get(code)
            resolve(obj)
          })
        }
      }
    }, error => {
      // 请求异常处理
      console.log(error)
    })
}

export const httpLoginGet = (_url, _params) => { // 已经登录
  if (!_params) { // 无参数请求情况
    _params = {}
  }
  _params.appKey = process.env.APP_KEY
  let secret = process.env.APP_SECRET
  _params.HTTP_API_VERSION = '4.1'
  _params.timeStamp = Moment().format('YYYYMMDDHHmmss')
  _params.reqId = randomString(16)
  _params.device_id = Cookie.getCookie('device_id')
  _params.user_id = Cookie.getCookie('user_id') ? Cookie.getCookie('user_id') : ''
  _params.verify = Cookie.getCookie('verify') ? Cookie.getCookie('verify') : ''
  // let paramsStr = ''
  let str = ''
  let keys = Object.keys(_params).sort()
  keys.forEach(key => {
    let val = _params[key]
    if ((typeof val === 'object') && val.constructor === Array) {
      val.forEach(item => {
        // paramsStr += '&' + key + '=' + item
        str += key + item
      })
    } else {
      // paramsStr += '&' + key + '=' + val
      str += key + val
    }
  })
  let sign = MD5(secret + str).toUpperCase()
  _params['sign'] = sign
  let origin = '/apiprefix'
  if (process.env.NODE_ENV === 'production') {
    origin = process.env.API_HOST
  }
  return Vue.http.get(origin + _url, {params: _params})
    .then(res => {
      if (!res['data']) {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      if (res['data']['success']) {
        return new Promise((resolve, reject) => {
          resolve((res['data']))
        })
      } else {
        if (res['data']['code'][0] + '' === '1005') {
          Cookie.setCookie('isLogin', 0)
          window.location.href = process.env.LOGIN_URL // 回到登录
        } else {
          return new Promise((resolve, reject) => {
            let code = res['data']['code'][0]
            let obj = res['data']
            obj['errorMsg'] = errorCode.get(code)
            resolve(obj)
          })
        }
      }
    }, error => {
      // 请求异常处理
      console.log(error)
    })
}

export const httpLoginPost = (_url, _params) => { // 已经登录
  if (!_params) { // 无参数请求情况
    _params = {}
  }
  _params.appKey = process.env.APP_KEY
  let secret = process.env.APP_SECRET
  _params.HTTP_API_VERSION = '4.1'
  _params.timeStamp = Moment().format('YYYYMMDDHHmmss')
  _params.reqId = randomString(16)
  _params.device_id = Cookie.getCookie('device_id')
  _params.user_id = Cookie.getCookie('user_id') ? Cookie.getCookie('user_id') : ''
  _params.verify = Cookie.getCookie('verify') ? Cookie.getCookie('verify') : ''
  // let paramsStr = ''
  let str = ''
  let keys = Object.keys(_params).sort()
  keys.forEach(key => {
    let val = _params[key]
    if ((typeof val === 'object') && val.constructor === Array) {
      val.forEach(item => {
        // paramsStr += '&' + key + '=' + item
        str += key + item
      })
    } else {
      // paramsStr += '&' + key + '=' + val
      str += key + val
    }
  })
  let sign = MD5(secret + str).toUpperCase()
  _params['sign'] = sign
  let origin = '/apiprefix'
  if (process.env.NODE_ENV === 'production') {
    origin = process.env.API_HOST
  }
  return Vue.http.post(origin + _url, _params, {emulateJSON: true})
    .then(res => {
      if (!res['data']) {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      if (res['data']['success']) {
        return new Promise((resolve, reject) => {
          resolve((res['data']))
        })
      } else {
        if (res['data']['code'][0] + '' === '1005') {
          Cookie.setCookie('isLogin', 0)
          window.location.href = process.env.LOGIN_URL // 回到登录
        } else {
          return new Promise((resolve, reject) => {
            let code = res['data']['code'][0]
            let obj = res['data']
            obj['errorMsg'] = errorCode.get(code)
            resolve(obj)
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
    device_id: Cookie.getCookie('device_id'),
    user_id: Cookie.getCookie('user_id'),
    verify: Cookie.getCookie('verify')
  }

  var p = new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: process.env.API_HOST + _url,
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

  _params.appKey = process.env.APP_KEY
  let secret = process.env.APP_SECRET
  _params.HTTP_API_VERSION = '4.1'
  _params.timeStamp = Moment().format('YYYYMMDDHHmmss')
  _params.reqId = randomString(16)
  if (Cookie.getCookie('device_id')) {
    _params.device_id = Cookie.getCookie('device_id')
  } else {
    let _deviceId = deviceId()
    _params.device_id = _deviceId
    Cookie.setCookie('device_id', _deviceId)
  }
  let paramsStr = ''
  let str = ''
  let keys = Object.keys(_params).sort()
  keys.forEach(key => {
    let val = _params[key]
    if ((typeof val === 'object') && val.constructor === Array && val.length > 0) {
      val.forEach(item => {
        paramsStr += '&' + key + '=' + item
        str += key + item
      })
    } else {
      paramsStr += '&' + key + '=' + val
      str += key + val
    }
  })
  let sign = MD5(secret + str).toUpperCase()
  return Vue.http.jsonp(process.env.API_HOST + _url + '?sign=' + sign + paramsStr)
    .then(res => {
      // return res['data']
      if (!res['data']) {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      if (res['data']['success']) {
        return new Promise((resolve, reject) => {
          resolve((res['data']))
        })
      } else {
        if (res['data']['code'][0] === '1005') {
          Cookie.setCookie('isLogin', 0)
          window.location.href = process.env.LOGIN_URL // 回到登录
        } else {
          return new Promise((resolve, reject) => {
            let code = res['data']['code'][0]
            let obj = res['data']
            obj['errorMsg'] = errorCode.get(code)
            resolve(obj)
          })
        }
      }
    }, error => {
      // 请求异常处理
      console.log(error)
    })
}

export const httpNoLoginGet = (_url, _params) => { // 未登录
  if (!_params) { // 无参数请求情况
    _params = {}
  }

  _params.appKey = process.env.APP_KEY
  let secret = process.env.APP_SECRET
  _params.HTTP_API_VERSION = '4.1'
  _params.timeStamp = Moment().format('YYYYMMDDHHmmss')
  _params.reqId = randomString(16)
  if (Cookie.getCookie('device_id')) {
    _params.device_id = Cookie.getCookie('device_id')
  } else {
    let _deviceId = deviceId()
    _params.device_id = _deviceId
    Cookie.setCookie('device_id', _deviceId)
  }
  let paramsStr = ''
  let str = ''
  let keys = Object.keys(_params).sort()
  keys.forEach(key => {
    let val = _params[key]
    if ((typeof val === 'object') && val.constructor === Array && val.length > 0) {
      val.forEach(item => {
        paramsStr += '&' + key + '=' + item
        str += key + item
      })
    } else {
      paramsStr += '&' + key + '=' + val
      str += key + val
    }
  })
  console.log(paramsStr)
  let sign = MD5(secret + str).toUpperCase()
  _params['sign'] = sign
  let origin = '/apiprefix'
  if (process.env.NODE_ENV === 'production') {
    origin = process.env.API_HOST
  }
  return Vue.http.get(origin + _url, {params: _params})
    .then(res => {
      // return res['data']
      if (!res['data']) {
        return new Promise((resolve, reject) => {
          resolve()
        })
      }
      if (res['data']['success']) {
        return new Promise((resolve, reject) => {
          resolve((res['data']))
        })
      } else {
        if (res['data']['code'][0] === '1005') {
          Cookie.setCookie('isLogin', 0)
          window.location.href = process.env.LOGIN_URL // 回到登录
        } else {
          return new Promise((resolve, reject) => {
            let code = res['data']['code'][0]
            let obj = res['data']
            obj['errorMsg'] = errorCode.get(code)
            resolve(obj)
          })
        }
      }
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

export const httpLoginUrl = (_url, _params) => {
  if (!_params) { // 无参数请求情况
    _params = {}
  }
  _params.HTTP_API_VERSION = config.API_VERSION
  _params.device_id = Cookie.getCookie('device_id')
  _params.user_id = Cookie.getCookie('user_id')
  _params.verify = Cookie.getCookie('verify')

  let url = process.env.API_HOST + _url + '?'
  Object.keys(_params).forEach((key) => {
    url += key + '=' + _params[key] + '&'
  })
  url = url.toString().substring(0, url.length - 1)
  return url
}

export const httpSnsUrl = (_url, _params) => {
  if (!_params) {
    _params = {}
  }
  _params.appKey = process.env.APP_KEY
  if (Cookie.getCookie('device_id')) {
    _params.deviceid = Cookie.getCookie('device_id')
  } else {
    let _deviceId = deviceId()
    _params.deviceid = _deviceId
  }
  _params.loginurl = process.env.HOME_URL

  let url = process.env.API_HOST + _url + '?'
  Object.keys(_params).forEach((key) => {
    url += key + '=' + _params[key] + '&'
  })
  url = url.toString().substring(0, url.length - 1)
  return url
}

export const clearCookie = () => {
  Cookie.delCookie('user_id')
  Cookie.delCookie('device_id')
  Cookie.delCookie('verify')
  Cookie.delCookieTalkmate('user_id')
  Cookie.delCookieTalkmate('device_id')
  Cookie.delCookieTalkmate('verify')
}
