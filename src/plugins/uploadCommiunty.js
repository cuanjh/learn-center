var qiniu = require('qiniu-js')
/**
 * 将图片转化成base64
 */
/* eslint-disable */
export function uploadImgToBase64 (file) {
 return new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () { // 图片转base64完成后返回reader对象
   resolve(reader)
  }
  reader.onerror = reject
 })
}
/** 将base64转换为文件对象
 *  @param {String} base64 base64字符串
 * */
let convertBase64ToBlob = (base64) => {
  var base64Arr = base64.split(',')
  var imgtype = ''
  var base64String = ''
  if (base64Arr.length > 1) {
    // 如果是图片base64，去掉头信息
    base64String = base64Arr[1]
    imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'))
  }
  // 将base64解码
  var bytes = atob(base64String)
  // var bytes = base64;
  var bytesCode = new ArrayBuffer(bytes.length)
  // 转换为类型化数组
  var byteArray = new Uint8Array(bytesCode)

  // 将base64转换为ascii码
  for (var i = 0; i < bytes.length; i++) {
    byteArray[i] = bytes.charCodeAt(i)
  }

  // 生成Blob对象（文件对象
  /* eslint-disable */
  return new Blob( [bytesCode], {type : imgtype})
  /* eslint-enable */
}
/**
 * data: base64的图片编码
 * key: 自己定义的key
 */
export const uploadQiniu = (data, token, key) => {
  return new Promise((resolve, reject) => {
    let config = {
      useCdnDomain: true,
      region: qiniu.region.z0
    }

    let putExtra = {
      fname: '',
      params: {},
      mimeType: [] || null
    }
    let blobData = convertBase64ToBlob(data) // 转二进制
    let observable = qiniu.upload(blobData, key, token, putExtra, config)

    observable.subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        reject(err)
      },
      complete: (res) => {
        resolve(res)
      }
    })
  })
}
