import CryptoJS from 'crypto-js'

let notSupportTip = '请试用chrome浏览器且域名为localhost或127.0.0.1测试'
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

class TtsRecorder {
  constructor (config) {
    this.config = config
    this.text = btoa(config.text || 'hello')
    this.ent = config.lang === 'en' ? 'intp65_en' : 'intp65'
    this.url = config.url || 'wss://tts-api.xfyun.cn/v2/tts'
    this.host = config.host || 'tts-api.xfyun.cn'
    // 以下信息在控制台-我的应用-语音听写（流式版）页面获取
    this.appId = process.env.XF_APPID
    this.apiKey = process.env.XF_APIKEY
    this.apiSecret = process.env.XF_APISECRET
  }

  start () {
    if (navigator.getUserMedia) {
      this.connectWebsocket()
    } else {
      var isChrome = navigator.userAgent.toLowerCase().match(/chrome/)
      console.log('isChrome', isChrome)
      alert(notSupportTip)
    }
  }

  connectWebsocket () {
    let url = this.url
    let host = this.host
    var apiKey = this.apiKey
    var apiSecret = this.apiSecret
    var date = new Date().toGMTString()
    var algorithm = 'hmac-sha256'
    var headers = 'host date request-line'
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    var authorization = btoa(authorizationOrigin)
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`

    if ('WebSocket' in window) {
      this.ws = new WebSocket(url)
    } else {
      alert(notSupportTip)
      return null
    }
    this.ws.onopen = (e) => {
      this.wsOpened(e)
      this.config.onStart && this.config.onStart(e)
    }
    this.ws.onmessage = (e) => {
      this.config.onMessage && this.config.onMessage(e)
      this.wsOnMessage(e)
    }
    this.ws.onerror = (e) => {
      this.config.onError && this.config.onError(e)
    }
    this.ws.onclose = (e) => {
      this.config.onClose && this.config.onClose(e)
    }
  }

  wsOpened () {
    if (this.ws.readyState !== 1) {
      return
    }

    var params = {
      'common': {
        'app_id': this.appId
      },
      'business': {
        'ent': this.ent, // 引擎类型，可选值：aisound（普通效果）intp65（中文）intp65_en（英文）xtts（优化效果）默认为intp65
        'aue': 'raw', // 音频编码，可选值：raw：未压缩的pcm, speex：压缩格式, speex-wb;7：压缩格式，压缩等级1~10，默认为7
        'auf': 'audio/L16;rate=16000',
        'vcn': 'xiaoyan', // 小语种可在控制台--语音听写（流式）--方言/语种处添加试用
        'tte': 'UTF8' // 文本编码格式 GB2312 GBK BIG5 UNICODE GB18030 UTF8
      },
      'data': {
        'status': 2,
        'text': this.text
      }
    }
    this.ws.send(JSON.stringify(params))
  }

  wsOnMessage (e) {
    let jsonData = JSON.parse(e.data)
    // 识别结束
    if (jsonData.code === 0 && jsonData.data.status === 2) {
      this.ws.close()
    }
    if (jsonData.code !== 0) {
      this.ws.close()
      console.log(`${jsonData.code}:${jsonData.message}`)
    }
  }
}

export default {
  TtsRecorder
}
