/**
 * Created by Peak on 21/1/17.
 */
/* eslint-disalbe */
var getGenderByCode = function (code) {
  if (code === undefined || code === '') {
    return ''
  }
  if (generConfig[code] === undefined) {
    var msgStr = 'gener code ' + code + ' undefined!'
    throw msgStr
  }
  return generConfig[code]
}

var getGenderSelectorDataByCode = function (code) {
  var _tmp = {
    name: '',
    language: ''
  }
  _tmp.language = code
  _tmp.name = this.getGenderByCode(code)
  return _tmp
}

var generConfig = {
  male: '男',
  female: '女'
}

export default {
  getGenderByCode,
  getGenderSelectorDataByCode
}
