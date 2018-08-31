<template>
  <div>
    <section class="module-environment-test guide-body" :class="{testani:ani}">
      <header class="guide-header">
        <span v-text="testing ? testing : guide.testing"></span>
      </header>
      <section class="error-region">
        <p class="desc" v-if="guide.tip">{{guide.tip}}</p>
        <p class="pass clearfix" v-if="all"><span :class="{finishIcon}"></span><span v-text="finish"></span></p>
      </section>
      <section class="guide-container">
        <table class="testing-table" el="table">
          <thead>
            <tr>
              <td></td>
              <td>{{ $t('guide.obj') }}</td>
              <td>{{ $t('guide.status') }}</td>
              <td>{{ $t('guide.result') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowspan="2" class="cls">{{ $t('guide.soft') }}</td>
              <td><span class="item-region">{{ $t('guide.oper') }}</span></td>
              <td v-text="os ? os : this.guide._testing"></td>
              <td :class="[osStateColor ? osStateColor : this.guide.wait,osCheck]">
                <span :class="{osIcon}"></span>
                <span v-text="osState ? osState : this.guide.wait"></span>
              </td>
            </tr>
            <tr class="border">
              <td><span class="item-region">{{ $t('guide.browser') }}</span></td>
              <td v-text="browser ? browser : this.guide._testing"></td>
              <td :class="[bStateColor ? bStateColor : this.guide.wait,bCheck]">
                <span :class="{bIcon}"></span>
                <span v-text="bState ? bState : this.guide.wait"></span>
              </td>
            </tr>
            <!-- <tr style="display: none">
              <td rowspan="2" class="cls">{{ $t('guide.net') }}</td>
              <td><span class="item-region">{{ $t('guide.speed') }}</span></td>
              <td v-text="download ? download : this.guide._testing"></td>
              <td :class="[dStateColor ? dStateColor : this.guide.wait,dCheck]">
                <span :class="{dIcon}"></span>
                <span v-text="dState ? dState : this.guide.wait"></span>
              </td>
            </tr>
            <tr class="border"  style="display: none">
              <td><span class="item-region">{{ $t('guide.upload') }}</span></td>
              <td v-text="upload ? upload : this.guide._testing"></td>
              <td :class="[uStateColor ? uStateColor : this.guide.wait,uCheck]">
                <span :class="{uIcon}"></span>
                <span v-text="uState ? uState : this.guide.wait"></span>
              </td>
            </tr> -->
            <tr>
              <td rowspan="2" class="cls">{{ $t('guide.hard') }}</td>
              <td><span class="item-region">{{ $t('guide.ear') }}</span></td>
              <td v-text="ear ? ear : this.guide._testing"></td>
              <td :class="[eStateColor ? eStateColor : this.guide.wait,eCheck]">
                <span :class="{eIcon}"></span>
                <span v-text="eState ? eState : this.guide.wait"></span>
              </td>
            </tr>
            <tr class="border">
              <td><span class="item-region">{{ $t('guide.mic') }}</span></td>
              <td v-text="micro ? micro : this.guide._testing"></td>
              <td :class="[mStateColor ? mStateColor : this.guide.wait,mCheck]">
                <span :class="{mIcon}"></span>
                <span v-text="mState ? mState : this.guide.wait"></span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="bottom-region clearfix">
        <ul class="error-list">
          <li class="li clearfix" v-if="mStateColor=='error'">
            <span class="error-icon"></span>
            {{ $t('guide.microError') }}
          </li>
          <li class="li clearfix" v-if="eStateColor=='error'">
            <span class="error-icon"></span>
            {{ $t('guide.soundError') }}
          </li>
          <li class="li clearfix" v-if="uStateColor=='error' || dStateColor=='error'">
            <span class="error-icon"></span>
            {{ $t(guide["networkErrorDesc"]) }}
          </li>
          <li class="li clearfix" v-if="bStateColor=='error'">
            <span class="error-icon"></span>
            {{ $t('guide.bower') }}<a href="http://www.google.cn/intl/zh-CN/chrome/browser/desktop/index.html" class="download">{{ $t('guide.download') }}</a> {{ $t('guide.chrome') }}
          </li>
        </ul>
        <a class="start-btn" href="javascript:;" @click="start" :class="{disabled:disabled}">{{ $t('content.start') }}</a>
      </section>
    </section>
    <test-dialog :microFinishCallback="microFinish" :soundFinishCallback="soundFinish"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import $ from 'jquery'

import TestDialog from '../testDialog.vue'

import common from '../../../plugins/common.js'
import microphone from '../../../plugins/recorder'
microphone.init() // 初始化麦克风

// let dialog = null

export default {
  data () {
    return {
      // tip: this.guide.tip, // 环境错误提示
      testing: '', // 测试title文案
      os: '', // 系统检测结果
      osState: '', // 系统检测状态
      osStateColor: '', // 系统检测显示颜色
      osIcon: '', // 系统检测图标
      osCheck: '', // 是否检测过
      browser: '', // 浏览器检测结果
      bState: '', // 浏览器检测状态
      bStateColor: '', // 浏览器检测显示颜色
      bIcon: '', // 浏览器检测图标
      bCheck: '', // 是否检测过
      download: '', // 下载速度检测结果
      dState: '', // 下载检测状态
      dStateColor: '', // 下载检测颜色
      dIcon: '', // 下载检测图标
      dCheck: '', // 是否检测过
      upload: '', // 上传检测结果
      uState: '', // 上传检测状态
      uStateColor: '', // 上传检测颜色
      uIcon: '', // 上传检测图标
      uCheck: '', // 是否检测过
      ear: '', // 耳机检测结果
      eState: '', // 耳机检测状态
      eStateColor: '', // 耳机检测颜色
      eIcon: '', // 耳机检测图标
      eCheck: '', // 是否检查过
      micro: '', // 麦克风检测结果
      mState: '', // 麦克风检测状态
      mStateColor: '', // 麦克风检测颜色
      mIcon: '', // 麦克风检测图标
      mCheck: '', // 是否检查过
      all: false, // 是否全部通过
      ani: '', // 动画名称
      disabled: true, // 是否可点击
      finish: '', // 是否完成
      finishIcon: '' // 完成图标
    }
  },
  components: {
    TestDialog
  },
  mounted () {
    this.softwareCheck()
    // this.checkUpload()
    // this.checkDownload()
  },
  computed: {
    ...mapState({
      guide: state => state.learn.guide,
      testDialog: state => state.learn.testDialog
    })
  },
  methods: {
    // 结束环境检测
    start () {
      history.back()
    },
    // 麦克风检测完成回调
    microFinish (state) {
      if (state) {
        this.micro = this.testDialog.soundSuccess
        this.mState = this.guide.ok
        this.mStateColor = 'pass'
        this.mIcon = 'pass-icon'
      } else {
        this.micro = this.testDialog.soundFail
        this.mState = this.guide.unnormal
        this.mStateColor = 'error'
        this.mIcon = 'error-icon'
      }
      this.mCheck = 'checked'
      this.checkAll()
    },
    // 声音检测回调
    soundFinish (state) {
      if (state) {
        this.ear = this.testDialog.soundSuccess
        this.eState = this.guide.ok
        this.eStateColor = 'pass'
        this.eIcon = 'pass-icon'
      } else {
        this.ear = this.testDialog.soundFail
        this.eState = this.guide.unnormal
        this.eStateColor = 'error'
        this.eIcon = 'error-icon'
      }
      this.eCheck = 'checked'
      this.checkAll()
    },
    // 检查是否所有项都检查完毕
    checkAll () {
      Vue.nextTick(
        function () {
          let table = $('.testing-table')
          if (table) {
            if (table.find('.checked').length === 4) {
              this.tip = ''
              this.all = true
              this.testing = this.guide.finish
              this.disabled = false
              if (table.find('.pass').length === 4) {
                this.finish = this.guide.pass
                this.finishIcon = 'pass-icon'
              } else {
                this.finish = this.guide.error
                this.finishIcon = 'error-icon'
              }
            } else {
              this.disabled = true
            }
          }
        }.bind(this)
      )
    },
    // 系统及浏览器检测
    softwareCheck () {
      let na = common.getOSAndBrowser()
      let reg = new RegExp('\\d+', 'g')
      let browser = na.browser
      this.os = na.os
      this.osState = this.guide.ok
      this.osStateColor = 'pass'
      this.osIcon = 'pass-icon'
      this.osCheck = 'checked'
      // 兼容OPERA
      if (browser.indexOf('OPR') > -1) {
        this.browser = browser.replace('OPR', 'Opera')
      } else {
        this.browser = browser
      }

      let version = browser.match(reg)[0]
      if (
        (browser.indexOf('Firefox') > -1 && version >= 36) ||
        (browser.indexOf('Chrome') > -1 && version >= 40) ||
        (browser.indexOf('OPR') > -1 && version >= 30)
      ) {
        this.bState = this.guide.ok
        this.bStateColor = 'pass'
        this.bIcon = 'pass-icon'
        this.checkAll()
      } else {
        this.bState = this.guide.unnormal
        this.bStateColor = 'error'
        this.bIcon = 'error-icon'
      }
      this.bCheck = 'checked'
    },
    // 检查上传
    checkUpload () {
      let xhr = new XMLHttpRequest()
      let timer = new Date().getTime()
      let buffer = new Int16Array(new ArrayBuffer(1024 * 1024 * 2))
      let formData = new FormData()
      let timeStep = 0
      let upSpeed = 0
      formData.append('test_data', buffer)
      xhr.open('POST', 'https://beat.talkmate.com/api/guide/speed_test', true)

      // 上传过程
      xhr.upload.addEventListener(
        'progress',
        function (process) {
          let currentTime = new Date().getTime()
          let loaded = process.loaded
          let speed = loaded / parseInt((currentTime - timer) / 1000, 10)
          let step = currentTime - timer
          if (step - timeStep > 150) {
            if (isFinite(speed)) {
              upSpeed = speed
              this.upload = common.bytesToSize(speed) + '/S'
            }
          }
        }.bind(this),
        false
      )

      // 上传结束
      xhr.addEventListener(
        'readystatechange',
        function (response) {
          if (
            xhr.readyState === 4 &&
            xhr.status === 200 &&
            xhr.responseText !== ''
          ) {
            let speed = parseInt(this.upload, 10)
            let currentTime = new Date().getTime()
            // 如果上传过快,速度进行兼容
            if (isNaN(speed) || speed === 0) {
              speed = 1024 * 1024 / parseFloat((currentTime - timer) / 1000)
              this.upload = common.bytesToSize(speed) + '/S'
              upSpeed = speed
            }
            if (upSpeed >= 50 * 1024) {
              this.uState = this.guide.ok
              this.uStateColor = 'pass'
              this.uIcon = 'pass-icon'
              this.checkAll()
            } else {
              this.uState = this.guide.unnormal
              this.uStateColor = 'error'
              this.uIcon = 'error-icon'
              this.checkAll()
            }
          }
          this.uCheck = 'checked'
        }.bind(this),
        false
      )
      // 上传错误
      xhr.addEventListener(
        'error',
        function () {
          this.uState = this.guide['network-error']
          this.uStateColor = 'error'
          this.uIcon = 'error-icon'
          this.checkAll()
        }.bind(this),
        false
      )
      xhr.send(formData)
    },
    // 检查下载速度
    checkDownload () {
      let xhr = new XMLHttpRequest()
      let timer = new Date().getTime()
      let timeStep = 0
      let dSpeed = 0
      xhr.open('GET', 'https://statics.talkmate.com/1M?t=' + timer, true)
      xhr.send(null)
      // 下载过程
      xhr.addEventListener(
        'progress',
        function (e) {
          let currentTime = new Date().getTime()
          let loaded = e.loaded
          let speed = loaded / parseInt((currentTime - timer) / 1000, 10)
          let step = currentTime - timer
          if (step - timeStep > 150) {
            if (isFinite(speed)) {
              this.download = common.bytesToSize(speed) + '/S'
              dSpeed = speed
            }
            timeStep = step
          }
        }.bind(this),
        false
      )
      // 下载结束
      xhr.addEventListener(
        'readystatechange',
        function (response) {
          if (
            xhr.readyState === 4 &&
            xhr.status === 200 &&
            xhr.responseText !== ''
          ) {
            let speed = parseInt(this.download, 10)
            let currentTime = new Date().getTime()
            // 下载如果过快,对速度进行兼容
            if (isNaN(speed)) {
              speed = 1024 * 1024 / parseFloat((currentTime - timer) / 1000)
              this.download = common.bytesToSize(speed) + '/S'
              dSpeed = speed
            }
            if (dSpeed >= 50 * 1025) {
              this.dState = this.guide.ok
              this.dStateColor = 'pass'
              this.dIcon = 'pass-icon'
              this.checkAll()
            } else {
              this.dState = this.guide.unnormal
              this.dStateColor = 'error'
              this.dIcon = 'error-icon'
              this.checkAll()
            }
          }
          this.dCheck = 'checked'
        }.bind(this),
        false
      )
      // 下载错误
      xhr.addEventListener(
        'error',
        function () {
          this.dState = this.guide['network-error']
          this.dStateColor = 'error'
          this.dIcon = 'error-icon'
          this.checkAll()
        }.bind(this),
        false
      )
    }
  },
  created () {
    // 初始化检测
    this.$on('testing', () => {
      this.softwareCheck()
      // this.checkUpload()
      this.checkDownload()
    })
  }
}

</script>

<style lang="less" scoped>
.guide-body {
    width: 710px;
    height: 490px;
    border: #dde2ee 1px solid;
    background-color: #fff;
    padding: 36px 42px 0 42px;
    position: absolute;
    backface-visibility: hidden;
    // transform: translate3d(0, 0, 0);
    //opacity: 1;
}

.module-environment-test {
  margin: 0 auto;
  position: static;
  z-index: 99;
  margin-top: 52px;
  .guide-header {
    color: #55a4fc;
    font-size: 18px;
  }
  .qq {
    font-size: 16px;
    color: #55a4fc;
    float: right;
  }
  .error-list {
    float: left;
    .li {
      margin-top: 10px;
    }
  }
  .error-region {
    font-size: 12px;
    color: #333333;
    line-height: 20px;
    .error-icon {
      margin-top: 4px;
    }
  }
  .pass-icon {
    background: url("../../../../static/images/user-guide/guide-check.png") 0 0
      no-repeat;
    width: image-width;
    height: image-height;
    float: left;
    margin-top: 4px;
    margin-right: 5px;
  }
  .download {
    color: #4495f0;
    text-decoration: underline;
  }
  .error-icon {
    background: url("../../../../static/images/user-guide/guide-error.png") 0 0
      no-repeat;
    width: image-width;
    height: image-height;
    float: left;
    margin-right: 5px;
  }
  .guide-container {
    margin-bottom: 43px;
  }
  .testing-table {
    color: #333333;
    font-size: 14px;
    width: 100%;
    height: 100%;
    //  text-align: center;
    margin-top: 15px;
    margin-bottom: 37px;
    .btn {
      width: 49px;
      height: 19px;
      line-height: 19px;
      font-size: 12px;
      float: none;
      display: inline-block;
    }
    thead {
      border-top: 1px #f0f3fa solid;
      border-bottom: 1px #f0f3fa solid;
    }
    td {
      height: 32px;
      line-height: 32px;
    }
    tbody {
      td {
        padding-top: 10px;
      }
    }
    .border {
      border-bottom: 1px #f0f3fa solid;
      td {
        padding-top: 0;
        padding-bottom: 10px;
      }
    }
    .pass {
      color: #3be08d;
    }
    .error {
      color: #f1b22a;
    }
    .error-icon,
    .pass-icon {
      float: none;
      display: inline-block;
    }
  }
  .cls {
    padding-left: 42px;
  }
  .micro-region {
    position: relative;
  }
  .st0 {
    fill: #d2d9de;
  }
  .item-region {
    width: 65px;
    text-align: left;
  }
  .micro-text {
    padding-left: 25px;
  }
  .micro-icon {
    height: 20px;
    position: absolute;
    width: 22px;
    top: 16px;
  }
  .start-btn {
    width: 123px;
    height: 35px;
    line-height: 34px;
    color: #fff;
    font-size: 16px;
    border-radius: 3px;
    background-color: #55a4fc;
    float: right;
    text-align: center;
    margin-top: 33px;
    text-decoration: none;
    &:hover {
      background-color: #59b3ff;
    }
    &:active {
      background: -webkit-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -moz-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -o-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: -ms-linear-gradient(90deg, #59b3ff 0%, #4e9ff6 100%);
      background: linear-gradient(0deg, #59b3ff 0%, #4e9ff6 100%);
    }
  }
  .disabled {
    background-color: #dfe2ed;
    &:hover {
      background-color: #dfe2ed;
    }
    &:active {
      background: none;
      background-color: #dfe2ed;
    }
  }
}

</style>
