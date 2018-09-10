/*
 * 密码加密方法
 * @password 原始密码
 * */
import md5 from 'md5'
export var encrypt = function (password) {
  var len = password.length
  var prefix = Math.floor(Math.random() * 10) % 2 ? 'a' : 'b'
  var encryptPwd = prefix
  if (len >= 10) {
    encryptPwd += '1'
  } else {
    encryptPwd += '0'
  }
  if (prefix === 'a') {
    for (var i = 1; i <= len; i++) {
      encryptPwd += password[i - 1] + randomString(i)
    }
  } else if (prefix === 'b') {
    for (var j = len; j >= 1; j--) {
      encryptPwd += password[len - j] + randomString(j)
    }
  }
  encryptPwd += len
  return encryptPwd
}
export var randomString = function (len) {
  var rdmString = ''
  for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) {}
  return rdmString.substr(0, len)
}

// 登录注册需要device_id产生方法
export var deviceId = function () {
  var time = Math.round(new Date().getTime() / 1000).toString()
  for (var i = 0; i < 6; i++) {
    time += Math.floor(Math.random() * 10)
  }
  return md5(time)
}
