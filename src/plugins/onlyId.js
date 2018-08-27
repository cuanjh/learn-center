/* eslint-disable */
/*
	生成用户当前会话的唯一id
	详细文档参考http://wiki.200h.com/pages/viewpage.action?pageId=853504
*/
import { Cookie } from './cookie'

function _onlyId() {
  	return Math.round(new Date().getTime());
}

export var onlyId = {
	get : function () {
		return	Cookie.getCookie('currentOnlyId');
	},
	set : function () {
		return	Cookie.setCookieSession('currentOnlyId',_onlyId());
	},
	del : function () {
		var exp = new Date();
		exp.setTime(exp.getTime() - 10000);
		document.cookie = 'currentOnlyId' + '=' + null + ';expires=' + exp.toGMTString() + ';path=/' + ';domain=.talkmate.com;';
	}
}



