export function emailMatch (_mail) {
  var _t = _mail.split('@')[1]
  if (!_t) return ''
  _t = _t.toLowerCase()
  if (_t === '163.com') {
    return 'mail.163.com'
  } else if (_t === 'vip.163.com') {
    return 'vip.163.com'
  } else if (_t === '126.com') {
    return 'mail.126.com'
  } else if (_t === 'qq.com' || _t === 'vip.qq.com' || _t === 'foxmail.com') {
    return 'mail.qq.com'
  } else if (_t === 'gmail.com') {
    return 'mail.google.com'
  } else if (_t === 'sohu.com') {
    return 'mail.sohu.com'
  } else if (_t === 'tom.com') {
    return 'mail.tom.com'
  } else if (_t === 'vip.sina.com') {
    return 'vip.sina.com'
  } else if (_t === 'sina.com.cn' || _t === 'sina.com') {
    return 'mail.sina.com.cn'
  } else if (_t === 'tom.com') {
    return 'mail.tom.com'
  } else if (_t === 'yahoo.com.cn' || _t === 'yahoo.cn') {
    return 'mail.cn.yahoo.com'
  } else if (_t === 'tom.com') {
    return 'mail.tom.com'
  } else if (_t === 'yeah.net') {
    return 'www.yeah.net'
  } else if (_t === '21cn.com') {
    return 'mail.21cn.com'
  } else if (_t === 'hotmail.com') {
    return 'www.hotmail.com'
  } else if (_t === 'sogou.com') {
    return 'mail.sogou.com'
  } else if (_t === '188.com') {
    return 'www.188.com'
  } else if (_t === '139.com') {
    return 'mail.10086.cn'
  } else if (_t === '189.cn') {
    return 'webmail15.189.cn/webmail'
  } else if (_t === 'wo.com.cn') {
    return 'mail.wo.com.cn/smsmail'
  } else if (_t === '139.com') {
    return 'mail.10086.cn'
  } else if (_t === 'talkmate.com') {
    return 'mail.talkmate.com'
  } else {
    return 'mail.' + _t
  }
}
