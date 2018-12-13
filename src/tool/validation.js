// 验证手机号邮箱密码等
export default {
  phoneNumber (number) {
    var phoneReg = /^((1[3-9]{1})+\d{9})$/
    return phoneReg.test(number)
  },
  pwd (string) {
    return /^[A-Za-z0-9]{6,15}$/.test(string)
  },
  verfiyCode (string) {
    return /^\d{5,6}$/.test(string)
  },
  email (string) {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+\.([a-zA-Z0-9_-])+$/.test(string)
  }
}
