/* eslint-disable */
import Cookies from 'js-cookie'
import EventEmitter from "EventEmitter";
let $event = new EventEmitter()
var qiniu = require('qiniu-js')
// or
// import * as qiniu from 'qiniu-js'

require('./date_format')
// 兼容
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

//如果看不懂,可以参考下面注释中封装的工厂函数
class Recorder {
    constructor(stream, _config) {
        stream = stream || null;
        this.config             = _config || {};
        this.config.sampleBits  = this.config.sampleBits || 16; //采样数位 8, 16
        this.config.sampleRate  = this.config.sampleRate || 11025; //采样率(1/6 44100)
        // 是否支持录音

        this.canRecording     = (navigator.getUserMedia != null)
        this.context          = new(window.AudioContext || window.webkitAudioContext);
        this.audioInput       = this.context.createMediaStreamSource(stream);
        this.recorder         = this.context.createScriptProcessor(4096, 1, 1);
        this.analyser         = this.context.createAnalyser();
        this.analyser.fftSize = 32;
        this.audioData = {
            size: 0, //录音文件长度

            buffer: [], //录音缓存

            inputSampleRate: this.context.sampleRate, //输入采样率

            inputSampleBits: 16, //输入采样数位 8, 16

            outputSampleRate: this.config.sampleRate, //输出采样率

            oututSampleBits: this.config.sampleBits, //输出采样数位 8, 16

            input(data) {
                this.buffer.push(new Float32Array(data));
                this.size += data.length;
            },
            compress() { //合并压缩
                //合并
                let data = new Float32Array(this.size);
                let offset = 0;
                for (let i = 0; i < this.buffer.length; i++) {
                    data.set(this.buffer[i], offset);
                    offset += this.buffer[i].length;
                }
                //压缩
                let compression = parseInt(this.inputSampleRate / this.outputSampleRate);
                let length = data.length / compression;
                let result = new Float32Array(length);
                let index = 0,
                    j = 0;
                while (index < length) {
                    result[index] = data[j];
                    j += compression;
                    index++;
                }
                return result;
            },
            encodeWAV() {
                let sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
                let sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
                let bytes = this.compress();
                let dataLength = bytes.length * (sampleBits / 8);
                //console.log("datalen:", bytes.length);
                let buffer = new ArrayBuffer(44 + dataLength);
                let data = new DataView(buffer);

                let channelCount = 1; //单声道
                let offset = 0;

                let writeString = function (str) {
                    for (let i = 0; i < str.length; i++) {
                        data.setUint8(offset + i, str.charCodeAt(i));
                    }
                }

                // 资源交换文件标识符
                writeString('RIFF');
                offset += 4;
                // 下个地址开始到文件尾总字节数,即文件大小-8
                data.setUint32(offset, 36 + dataLength, true);
                offset += 4;
                // WAV文件标志
                writeString('WAVE');
                offset += 4;
                // 波形格式标志
                writeString('fmt ');
                offset += 4;
                // 过滤字节,一般为 0x10 = 16
                data.setUint32(offset, 16, true);
                offset += 4;
                // 格式类别 (PCM形式采样数据)
                data.setUint16(offset, 1, true);
                offset += 2;
                // 通道数
                data.setUint16(offset, channelCount, true);
                offset += 2;
                // 采样率,每秒样本数,表示每个通道的播放速度
                data.setUint32(offset, sampleRate, true);
                offset += 4;
                // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
                data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
                offset += 4;
                // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
                data.setUint16(offset, channelCount * (sampleBits / 8), true);
                offset += 2;
                // 每样本数据位数
                data.setUint16(offset, sampleBits, true);
                offset += 2;
                // 数据标识符
                writeString('data');
                offset += 4;
                // 采样数据总数,即数据总大小-44
                data.setUint32(offset, dataLength, true);
                offset += 4;
                // 写入采样数据
                if (sampleBits === 8) {
                    for (let i = 0; i < bytes.length; i++, offset++) {
                        let s = Math.max(-1, Math.min(1, bytes[i]));
                        let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                        val = parseInt(255 / (65535 / (val + 32768)));
                        data.setInt8(offset, val, true);
                    }
                } else {
                    for (let i = 0; i < bytes.length; i++, offset += 2) {
                        let s = Math.max(-1, Math.min(1, bytes[i]));
                        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                    }
                }

                return new Blob([data], {
                    type: 'audio/wav'
                });
            }
        };

        //音频采集
        this.recorder.onaudioprocess = e => {
            this.audioData.input(e.inputBuffer.getChannelData(0));
            $event.emit("record_setVolume", [e.inputBuffer.getChannelData(0)]);
        }

    }

    //开始录音
    start() {
        this.audioData.buffer = [];
        this.audioData.size = 0;
        this.audioInput.connect(this.recorder);
        this.recorder.connect(this.context.destination);
    }

    //停止
    stop() {
        this.audioInput.disconnect(0);
        this.recorder.disconnect(0);
    }

    //获取音频文件
    getBlob() {
        this.stop();
        return this.audioData.encodeWAV();
    }

    //回放
    play(audio) {
        audio.src = window.URL.createObjectURL(this.getBlob());
        audio.play();
    }

    getSoundTime(cb) {
        let audio = new Audio;
        audio.src = window.URL.createObjectURL(this.getBlob());
        if (this.getBlob().size == 44) {
            cb(0);
            return;
        }
        audio.onloadedmetadata = function () {
            cb(audio.duration)
        }

    }

    //上传
    upload(url, callback) {
        let fd = new FormData();
        fd.append("audioData", this.getBlob());
        fd.append("url", url.source);
        fd.append("type", "speech");
        let xhr = new XMLHttpRequest();
        if (callback) {
            xhr.upload.addEventListener("progress", function (e) {
                callback('uploading', e);
            }, false);
            xhr.addEventListener("load", function (e) {
                callback('ok', JSON.parse(e.target.response));
            }, false);
            xhr.addEventListener("error", function (e) {
                callback('error', e);
            }, false);
            xhr.addEventListener("abort", function (e) {
                callback('cancel', e);
            }, false);
        }
        xhr.open("POST", url.des);
        xhr.send(fd);
    }
    // 录音上传到七牛
    uploadQiniu(token, code, sentence, callback) {
      var that = this;
      var config = {
        useCdnDomain: true,
        region: qiniu.region.z0
      };
      var courseCode = code.split('-')[0] + '-' +code.split('-')[1]
      var putExtra = {
        fname: "",
        params: {
          'x:course_code': courseCode,
          'x:form_code': code,
          'x:user_id': Cookies.get('user_id'),
          'x:sentence': sentence
        },
        mimeType: [] || null
      };

      var key = this.GetKey(code);

      var next = function(res) {
        console.log(res)
      }

      var error = function(err) {
        console.log(err)
      }

      var complete = function(res) {
        console.log(res);
      }

      var observer = {
        next: next,
        error: error,
        complete: complete
      };

      var observable = qiniu.upload(this.getBlob(), key, token, putExtra, config);
      var subscription = observable.subscribe(observer);
      // subscription.unsubscribe();

    }

    GetKey (code) {
      var date = new Date()
      var d = date.format('yyyy/MM/dd');
      var userId = Cookies.get('user_id');
      var time = date.getTime()

      return d + '/' + code + '/' + userId + '/' + time + '.wav';
    }

    // 抛出异常
    static throwError(message) {
        Config.refuseRecord = true;
        console.log(message);
    }

}


// 获取录音机
let init = (callback, config) => {
    let userMedia = navigator.getUserMedia;
    if (callback) {
        if (userMedia) {
            navigator.getUserMedia({
                    audio: true
                }, //只启用音频,
                stream => {
                    let rec = new Recorder(stream, config);
                    callback(rec);
                },
                error => {
                    callback(false);
                    switch (error.code || error.name) {
                        case 'PERMISSION_DENIED':
                        case 'PermissionDeniedError':
                            Recorder.throwError('抱歉，未获取到麦克风设备。');
                            Config.refuseRecord = true;
                            break;
                        case 'NOT_SUPPORTED_ERROR':
                        case 'NotSupportedError':
                            Recorder.throwError('浏览器不支持硬件设备。');
                            break;
                        case 'MANDATORY_UNSATISFIED_ERROR':
                        case 'MandatoryUnsatisfiedError':
                            Recorder.throwError('无法发现指定的硬件设备。');
                            break;
                        default:
                            Recorder.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                            break;
                    }
                })
        } else {
            Recorder.throwError('当前浏览器不支持录音功能。');
            return;
        }
    }
}

export default {
    recorder: null,
    recorderUrl: '',
    audio: new Audio(),
    init: function () {
        init( (rec) => {
          console.log(1212121212)
            if (rec) {
                this.recorder = rec;
            } else {
                this.recorder = false;
            }

        });
    },
    startRecording: function () {
        if (this.recorder) {
            this.recorder.start();
            return true;
        } else {
            return false;
        }

    },
    stopRecording: function () {
        if (this.recorder) {
            this.recorder.stop();
            return true;
        } else {
            return false;
        }
    },
    upload: function (url, cb) {
        this.recorder.upload(url, cb);
    },
    uploadQiniu: function (token, code, sentence, cb) {
      this.recorder.uploadQiniu(token, code, sentence)
      this.recorderUrl = this.recorder.GetKey(code)
    },
    playRecording: function () {
        if (this.recorder) this.recorder.play(this.audio);
    },
    stopRecordSoud: function () {
        this.audio.pause();
    },
    getSndData: function () {
        return this.recorder ? this.recorder.getBlob() : null;
    },
    getTime: function (cb) {
        return this.recorder ? this.recorder.getSoundTime(cb) : 0;
    },
    // 是否激活
    isActivity: function (speakwork, canRecord) {

        if (speakwork) {
            if (this.recorder) return true;
        } else {
            if (this.recorder && canRecord) return true;
        }

        return false;
    }

}
