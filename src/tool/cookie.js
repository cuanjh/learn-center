/* eslint-disable */
var getCookie = function (name) {
  // console.log(document.cookie);
	var curCookie = document.cookie.split(';');
	var itemVal = null;
	for (var i = 0; i < curCookie.length; i++) {
		if (curCookie[i].split('=')[0].trim() === name) {
			itemVal = curCookie[i].split('=')[1];
		}
	}
	return itemVal;
}
var setCookie = function(key, val) {
  var exp = new Date();
  exp.setTime(exp.getTime() + 30 * 86400 * 1000);
  document.cookie = key + '=' + val + ';expires=' + exp.toGMTString() + ';path=/';
  return document.cookie;
}

var delCookie = function(name) {
	var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval !== null) {
        document.cookie = name + "=" + '' + ';expires=' + exp.toGMTString() + ';path=/';
        return document.cookie;
    }
}

var delCookieTalkmate = function(name) {
	var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval !== null) {
        document.cookie = name + "=" + '' + ';expires=' + exp.toGMTString() + ';path=/' + ';domain=.talkmate.com;';
        return document.cookie;
    }
}
// 保持30天登录状态
var setCookieAuto = function (key, val) {
  var exp = new Date();
  exp.setTime(exp.getTime() + 30 * 86400 * 1000);
  document.cookie = key + '=' + val + ';expires=' + exp.toGMTString() + ';path=/' + ';domain=.talkmate.com;';
  return document.cookie;
}
 // 保持在会话期内有效
var setCookieSession = function(key, val) {
  document.cookie = key + '=' + val + ';path=/' + ';domain=.talkmate.com;';
  return document.cookie;
}


export default {
  getCookie,
  setCookie,
  delCookie,
  delCookieTalkmate,
  setCookieAuto,
  setCookieSession
}
