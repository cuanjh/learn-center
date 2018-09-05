/**
 * 日志打点收集
 * 日志的详细文档参见http://wiki.200h.com/pages/viewpage.action?pageId=853488
 */
/* eslint-disable */
import Vue from 'vue'
import { Cookie } from './cookie'
import Config from '../api/config'

var LOG_URL = 'https://statistics.talkmate.com/log.gif';
var LOG_VERSION = '1.1';
var PLATFORM = 'web';
var APP_VERSION = '1.0.0';

var payCoinEnter = function(memberType, p10) {
  _report('PAY-COIN-ENTER', memberType, [p10]);
}
var payCoinBuy = function(memberType, p10, p11, p12, p13) {
  _report('PAY-COIN-BUY', memberType, [p10, p11, p12, p13]);
}
var payMemberEnter = function(memberType, p10) {
  _report('PAY-MEMBER-ENTER', memberType, [p10]);
}
var payMemberCard = function(memberType, p10, p11, p12) {
  _report('PAY-MEMBER-CARD', memberType, [p10, p11, p12]);
}
var payMemberPay = function(memberType, p10, p11, p12) {
  _report('PAY-MEMBER-PAY', memberType, [p10, p11, p12]);
}

function _report(businessNo, memberType, otherInfo) {
  var _businessNo = businessNo;
  var	_userId = Cookie.getCookie('user_id');
  var	_memberType = memberType;
  var	_logId = new Date().getTime();
  var	_timeZone = new Date().getTimezoneOffset() / 60;
  if (_timeZone <= 0) {
    _timeZone = '+' + Math.abs(_timeZone);
  } else {
    _timeZone = '-' + Math.abs(_timeZone);
  }
  var	_logVersion = LOG_VERSION;
  var	_platform = PLATFORM;
  var	_appVersion	= APP_VERSION;
  var	_channelNo = Config.URL.appChannelNo;

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
  if (otherInfo && otherInfo.length) {
    _paramArr = _paramArr.concat(otherInfo);
  }
  var _url = LOG_URL + '?' + _paramArr.join('&');
  // console.log(_url)
  Vue.http.get(_url);
}

export default {
  payCoinEnter,
  payCoinBuy,
  payMemberEnter,
  payMemberCard,
  payMemberPay
}
