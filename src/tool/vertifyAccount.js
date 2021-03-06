const vertifyEmail = (mail, password) => {
  let regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let regPsw = /^(\w){6,15}$/
  if (regEmail.test(mail) && regPsw.test(password)) {
    return true
  } else {
    return false
  }
}
const phoneNumber = (number) => {
  var myreg = /^((1[3-9]{1})+\d{9})$/
  console.log(myreg.test(number))
  if (!myreg.test(number)) {
    return false
  } else {
    return true
  }
}
const vertifyPhone = (phone, password) => {
  let regPhone = /^1(3|4|5|6|7|8)\d{9}$/
  let regPsw = /^(\w){6,15}$/
  if (regPhone.test(phone) && regPsw.test(password)) {
    return true
  } else {
    return false
  }
}

export default {
  vertifyEmail,
  vertifyPhone,
  phoneNumber
}
