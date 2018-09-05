/* eslint-disable */
export var Cookie = {
	getCookie: function(name) {
	var curCookie = document.cookie.split(';');
	var itemVal = null;
	for (var i = 0; i < curCookie.length; i++) {
		if (curCookie[i].split('=')[0].trim() === name) {
			itemVal = curCookie[i].split('=')[1];
		}
	}
	return itemVal;
},
 setCookie: function(key, val) {
  var exp = new Date();
  exp.setTime(exp.getTime() + 30 * 86400 * 1000);
  document.cookie = key + '=' + val + ';expires=' + exp.toGMTString() + ';path=/';
  return document.cookie;
 },
delCookie: function(name) {
	var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Cookie.getCookie(name);
    if (cval !== null) {
        document.cookie = name + "=" + '' + ';expires=' + exp.toGMTString() + ';path=/';
        return document.cookie;
    }
},
delCookieTalkmate: function(name) {
	var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Cookie.getCookie(name);
    if (cval !== null) {
        document.cookie = name + "=" + '' + ';expires=' + exp.toGMTString() + ';path=/' + ';domain=.talkmate.com;';
        return document.cookie;
    }
},
// 保持30天登录状态
setCookieAuto: function(key, val) {
  var exp = new Date();
  exp.setTime(exp.getTime() + 30 * 86400 * 1000);
  document.cookie = key + '=' + val + ';expires=' + exp.toGMTString() + ';path=/' + ';domain=.talkmate.com;';
  return document.cookie;
 },
 // 保持在会话期内有效
 setCookieSession: function(key, val) {
  document.cookie = key + '=' + val + ';path=/' + ';domain=.talkmate.com;';
  return document.cookie;
 }
}
