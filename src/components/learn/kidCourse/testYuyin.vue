<template>
  <div class="service-item service-item-taste">
    <h2 class="service-item-title">产品体验</h2>
    <div class="service-item-content service-item-taste-content">
      <div class="taste-content">
        <button class="taste-button ready-button" id="taste_button" @click="tasteBtn">开始识别</button>
      </div>
      <div class="start-taste">
        <div class="start-taste-left">
          <div class="time-box">
            <span class="start-taste-line">
              <hr class="hr hr1">
              <hr class="hr hr2">
              <hr class="hr hr3">
              <hr class="hr hr4">
              <hr class="hr hr5">
              <hr class="hr hr6">
              <hr class="hr hr7">
              <hr class="hr hr8">
              <hr class="hr hr9">
              <hr class="hr hr10">
            </span>
            <span class="total-time">
                <span class="used-time">00: 00</span> / 01: 00
            </span>
          </div>
          <div class="start-taste-button">
            <button class="taste-button start-button" @click="startBtn($event)">结束识别</button>
          </div>
        </div>
        <div class="output-box" id="result_output"></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import ASR from '../../../plugins/asr.js'
export default {
  data () {
    return {
      notSupportTip: '请试用chrome浏览器且域名为localhost或127.0.0.1测试',
      iatRecorder: null,
      resultText: '',
      counterDownDOM: null,
      counterDownTime: 0,
      counterDownTimeout: null,
      text: {
        start: '开始识别',
        stop: '结束识别'
      }
    }
  },
  mounted () {
    this.iatRecorder = new ASR.IatRecorder({
      onClose: () => {
        this.stop()
        this.reset()
      },
      onError: (data) => {
        this.stop()
        this.reset()
        alert('WebSocket连接失败')
      },
      onMessage: (e) => {
        let jsonData = JSON.parse(e.data)
        if (jsonData.data && jsonData.data.result) {
          this.setResult(jsonData.data.result)
        }
      },
      onStart: () => {
        $('hr').addClass('hr')
        var dialect = $('.dialect-select').find('option:selected').text()
        $('.taste-content').css('display', 'none')
        $('.start-taste').addClass('flex-display-1')
        $('.dialect-select').css('display', 'none')
        $('.start-button').text('结束识别')
        $('.time-box').addClass('flex-display-1')
        $('.dialect').text(dialect).css('display', 'inline-block')
        this.counterDown()
      }
    })
    let worker = this.$worker.create([
      {
        message: 'transformpcm',
        func: (arg1, arg2) => {
          console.log(arg1)
          console.log(arg2)
        }
      }
    ])
    this.iatRecorder.createWorker(worker)
    this.counterDownDOM = $('.used-time')
  },
  methods: {
    tasteBtn () {
      if (navigator.getUserMedia && ASR.AudioContext && ASR.recorderWorker) {
        this.start()
      } else {
        alert(this.notSupportTip)
      }
    },
    startBtn (e) {
      if (e.currentTarget.innerText === this.text.start) {
        $('#result_output').text('')
        this.resultText = ''
        this.start()
      } else {
        this.reset()
        this.stop()
      }
    },
    start () {
      this.iatRecorder.start()
    },
    stop () {
      $('hr').removeClass('hr')
      this.iatRecorder.stop()
    },
    reset () {
      this.counterDownTime = 0
      clearTimeout(this.counterDownTimeout)
      this.iatRecorder.reset()
      $('.time-box').removeClass('flex-display-1').css('display', 'none')
      $('.start-button').text(this.text.start)
      $('.dialect').css('display', 'none')
      $('.dialect-select').css('display', 'inline-block')
    },
    setResult (data) {
      var str = ''
      var resultStr = ''
      let ws = data.ws
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w
      }
      // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
      // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
      if (data.pgs === 'apd') {
        this.resultText = $('#result_output').text()
      }
      resultStr = this.resultText + str
      $('#result_output').text(resultStr)
    },
    counterDown () {
      if (this.counterDownTime === 60) {
        this.counterDownDOM.text('01: 00')
        this.stop()
      } else if (this.counterDownTime > 60) {
        this.reset()
        return false
      } else if (this.counterDownTime >= 0 && this.counterDownTime < 10) {
        this.counterDownDOM.text('00: 0' + this.counterDownTime)
      } else {
        this.counterDownDOM.text('00: ' + this.counterDownTime)
      }
      this.counterDownTime++
      this.counterDownTimeout = setTimeout(() => {
        this.counterDown()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.service-item-taste button {
  cursor: pointer;
}

.service-item-taste .taste-button {
  background: #187cff;
  border: 1px solid;
  border-color: #478eea;
  color: #fff;
  text-align: center;
  border-radius: 3px;
}

.service-item-taste .taste-header .dialect-select {
  margin-left: 20px;
  height: 26px;
}

.service-item-taste .taste-header .dialect {
  margin-left: 20px;
  height: 26px;
  line-height: 26px;
  display: none;
}

.service-item-taste .taste-header a {
  border: none;
  border-radius: 4px;
  color: #fff;
  height: 26px;
  width: 100px;
  float: right;
  text-align: center;
  line-height: 26px;
}

.service-item-taste .taste-content {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 100px;
}

.service-item-taste .start-taste {
  margin-top: 30px;
  display: none;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.service-item-taste .start-taste .start-taste-left {
  width: 40%;
  margin-left: 30px;
}

.service-item-taste .start-taste .start-taste-left .time-box {
  margin-top: 40px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  justify-content: center;
}

.service-item-taste .start-taste .start-taste-left .time-box .total-time {
  margin-left: 20px;
}

.service-item-taste .start-taste .start-taste-left .time-box .start-taste-line {
  display: inline-block;
  margin-right: 20px;
}

.service-item-taste .start-taste .start-taste-left .time-box .start-taste-line hr {
  background-color: #187cff;
  width: 3px;
  height: 10px;
  margin: 0 5px;
  display: inline-block;
  border: none;
}

.service-item-taste .start-taste .start-taste-left .start-taste-button {
  display: -ms-flexbox;
  display: flex;
  margin-top: 70px;
}

.service-item-taste .start-taste .output-box {
  height: 200px;
  overflow: auto;
  background: #f0f0f0;
  width: 50%;
  line-height: 1.5;
  padding-left: 10px;
  padding-top: 10px;
}

.flex-display-1 {
  display: -ms-flexbox !important;
  display: flex !important;
}

.hr {
  animation: note 0.2s ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.hr1 {
  animation-delay: -1s;
}

.hr2 {
  animation-delay: -0.9s;
}

.hr3 {
  animation-delay: -0.8s;
}

.hr4 {
  animation-delay: -0.7s;
}

.hr5 {
  animation-delay: -0.6s;
}

.hr6 {
  animation-delay: -0.5s;
}

.hr7 {
  animation-delay: -0.4s;
}

.hr8 {
  animation-delay: -0.3s;
}

.hr9 {
  animation-delay: -0.2s;
}

.hr10 {
  animation-delay: -0.1s;
}

@keyframes note {
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(4);
  }
}

.ready-button,
.start-button {
  margin: 0 auto;
  height: 40px;
  width: 160px;
  font-size: 16px;
  letter-spacing: 6px;
}

.taste-button:hover {
  background: #0b99ff;
}
</style>
