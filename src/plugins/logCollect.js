/**
 * 日志打点收集
 * 日志的详细文档参见http://wiki.200h.com/pages/viewpage.action?pageId=853488
 */
/* eslint-disable */
import $ from 'jquery'
import { Cookie } from './cookie'
import Config from '../api/config'
// 依赖index.php返回的Config数据

var LOG_URL = 'https://statistics.talkmate.com/log.gif';
var LOG_VERSION = '1.1';
var PLATFORM = 'web';
var APP_VERSION = '1.0.0';


function learnStart(p13){
	 _reportLearn('LEARN-START', [p13]);
};
function learnEnd(p13, p14, p15, p16){
	 _reportLearn('LEARN-END', [p13, p14, p15, p16]);
};
function learnExit(p13, p14){
	 _reportLearn('LEARN-EXIT', [p13, p14]);
};
function learnProg(p13, p14, p15, p16, p17){
	 _reportLearn('LEARN-PROG', [p13, p14, p15, p16, p17]);
};

function _reportLearn(businessNo, otherInfo) {
	var _currentOnlyId = Cookie.getCookie('currentOnlyId');
	// var _partNumArr = window.location.href.split('index/')[1].replace(/#/g,'').split('/').slice(0,-1);
	// if(_partNumArr.length === 5){
	// 	_partNumArr.push('A7');
  // }
  var currentChapterCode = localStorage.getItem('currentChapterCode')
  var chapterType = localStorage.getItem('chapterType')
	// var _partNum = _partNumArr.join('-');
  // var _currentCoin = Config.userData.coin;
  var _partNum = currentChapterCode + '-' + chapterType
  var _currentCoin = localStorage.getItem('userCoin')
	var _arr = [_currentOnlyId, _partNum, _currentCoin].concat(otherInfo);
	var _other = _arr.join('&');

	_report(businessNo, _other);
}

function _report(businessNo, otherInfo) {
	//如果是教师进入不再提交日志信息
	// if(Config.userData.is_teacher){ return }
  var userInfo = JSON.parse(localStorage.getItem('userInfo'))
	var _businessNo = businessNo;
	var	_userId = Cookie.getCookie('user_id');
	var	_memberType = userInfo.member_info.member_type;
	var	_logId = Math.round(new Date().getTime());
	var	_timeZone = new Date().getTimezoneOffset() / 60;
	if (_timeZone <= 0) {
		_timeZone = '+' + Math.abs(_timeZone);
	} else {
		_timeZone = '-' + Math.abs(_timeZone);
	}
	var	_logVersion = LOG_VERSION;
	var	_platform = PLATFORM;
	var	_appVersion	= APP_VERSION;
	var	_channelNo = Config.URL.channelCode;


	var _paramArr = [
		_businessNo,
		_userId,
		_memberType,
		_logId,
		_timeZone,
		_logVersion,
		_platform,
		_appVersion,
		_channelNo
	];
	var _url = LOG_URL + '?' + _paramArr.join('&');
	if(otherInfo){
		_url = _url + '&' + otherInfo;
	}
	if(Config.URL.channelCode === 'web_test_1'){
		console.log(_url.split('?')[1].split('&'));
	}
	$.ajax(_url);
};


export default {
	learnStart,
	learnEnd,
	learnExit,
	learnProg
}
