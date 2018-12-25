/**
 * Created by Peak on 21/1/17.
 */
let getGenderByCode = (code) => {
  if (code === undefined || code === '') {
    return ''
  }
  if (generConfig[code] === undefined) {
    var msgStr = 'gener code ' + code + ' undefined!'
    throw msgStr
  }
  return generConfig[code]
}

let getGenderSelectorDataByCode = (code) => {
  var _tmp = {
    name: '',
    language: ''
  }
  _tmp.language = code
  _tmp.name = getGenderByCode(code)
  return _tmp
}

let generConfig = {
  male: '男',
  female: '女'
}

export default {
  getGenderByCode,
  getGenderSelectorDataByCode
}
