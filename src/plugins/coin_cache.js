/* eslint-disable */
/*
	备份当前会话用户学习所得金币
*/

import Cookie from '../tool/cookie'

function encryption (str) {   // 加密
  return window.btoa(str)
}
function decryption (str) {   // 解密
  return window.atob(str)
}

export default {
	get (path) {
    var cache = Cookie.getCookie('sessionCache')
    if (cache === null) { return null }
    var cacheArr = decryption(cache).split('=')
    if (cacheArr[0] !== path) {
      this.set(path, 0)
      return 0
    } else {
      return parseInt(cacheArr[1])
    }
	},
	set (path, data) {
    return Cookie.setCookieSession('sessionCache', encryption([path, data].join('=')))
	},
  update (data) {
    var cache = Cookie.getCookie('sessionCache')
    if (!cache){ return console.log('找不到sessionCache') }
    var cacheArr = decryption(cache).split('=')
    this.del()
    this.set(cacheArr[0], data)
  },
	del () {
		var exp = new Date();
		exp.setTime(exp.getTime() - 10000);
		document.cookie = 'sessionCache' + '=' + null + ';expires=' + exp.toGMTString() + ';path=/' + ';domain=.talkmate.com;';
	}
}
