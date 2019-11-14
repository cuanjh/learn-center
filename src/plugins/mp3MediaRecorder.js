import { getMp3MediaRecorder } from 'mp3-mediarecorder'
var qiniu = require('qiniu-js')

class MP3Recorder {
  constructor () {
    const supportsWasm = WebAssembly && typeof WebAssembly.instantiate === 'function'
    const supportsUserMediaAPI = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function'
    const isBrowserSupported = supportsWasm && supportsUserMediaAPI
    this.audio = new Audio()
    this.mp3Blob = null
    this.recorder = null
    this.Mp3MediaRecorder = null
    if (isBrowserSupported) {
      getMp3MediaRecorder({wasmURL: '../../static/sounds/vmsg.wasm'}).then(Mp3MediaRecorder => {
        this.Mp3MediaRecorder = Mp3MediaRecorder
      })
    } else {
      if (!supportsUserMediaAPI) {
        this.renderError(
          'MP3 MediaRecorder requires the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API" class="nes-text is-error">getUserMedia API</a> but it is not supported in your browser.'
        )
      } else if (!supportsWasm) {
        this.renderError(
          'MP3 MediaRecorder requires <a href="https://developer.mozilla.org/en-US/docs/WebAssembly" class="nes-text is-error">WebAssembly</a> but it is not supported in your browser.'
        )
      }
    }
  }

  start () {
    navigator.getUserMedia({
      audio: true // 只启用音频,
    },
    stream => {
      let blobs = []
      this.recorder = new this.Mp3MediaRecorder(stream)
      this.recorder.start()
      this.recorder.onstart = e => {
        console.log('onstart', e)
        blobs = []
      }

      this.recorder.ondataavailable = e => {
        console.log('ondataavailable', e)
        blobs.push(e.data)
      }

      this.recorder.onstop = e => {
        console.log('onstop', e)
        stream.getTracks().forEach(track => {
          track.stop()
        })
        this.mp3Blob = new Blob(blobs, { type: 'audio/mpeg' })
        // const mp3BlobUrl = URL.createObjectURL(this.mp3Blob)
        // this.audio.src = mp3BlobUrl
        // this.audio.play()
      }

      this.recorder.onpause = e => {
        console.log('onpause', e)
      }

      this.recorder.onreume = e => {
        console.log('onresume', e)
      }

      this.recorder.onerror = e => {
        console.log('onerror', e)
      }
    }, error => {
      switch (error.code || error.name) {
        case 'PERMISSION_DENIED':
        case 'PermissionDeniedError':
          this.renderError('抱歉，未获取到麦克风设备。')
          break
        case 'NOT_SUPPORTED_ERROR':
        case 'NotSupportedError':
          this.renderError('浏览器不支持硬件设备。')
          break
        case 'MANDATORY_UNSATISFIED_ERROR':
        case 'MandatoryUnsatisfiedError':
          this.renderError('无法发现指定的硬件设备。')
          break
        default:
          this.renderError('无法打开麦克风。异常信息:' + (error.code || error.name))
          break
      }
    })
  }

  stop () {
    this.recorder.stop()
  }

  play (cb) {
    const mp3BlobUrl = URL.createObjectURL(this.mp3Blob)
    this.audio.src = mp3BlobUrl
    this.audio.play()
    this.audio.addEventListener('ended', () => {
      if (cb) {
        cb()
      }
    })
  }

  uploadQiniu (token, fileKey, callback) {
    return new Promise((resolve, reject) => {
      var config = {
        useCdnDomain: true,
        region: qiniu.region.z0
      }
      var putExtra = {
        fname: '',
        params: {},
        mimeType: [] || null
      }
      var next = (res) => {
        console.log(res)
      }

      var error = (err) => {
        reject(err)
      }
      var complete = (res) => {
        resolve(res)
      }
      var observer = {
        next: next,
        error: error,
        complete: complete
      }
      var observable = qiniu.upload(this.mp3Blob, fileKey, token, putExtra, config)
      observable.subscribe(observer)
    })
  }

  renderError (reason) {
    console.warn(reason)
  }
}

export default {
  MP3Recorder
}
