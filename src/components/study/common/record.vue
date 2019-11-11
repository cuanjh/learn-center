<template>
  <div class="record-container">
    <div class="start-record" v-if="!isRecord"><i class="start-img" @click.stop.prevent="startRecord()"></i></div>
    <div class="record-content" v-if="isRecord">
      <div class="recording-btns" @click.stop.prevent="recordStop()" v-if="recording">
        <div class="record-decibel">
          <span v-for="(height, index) in thumbHeightLeft" :key="'left' + index" :style="{'height': height + 'px'}"></span>
        </div>
        <div class="recording-img"></div>
        <div class="record-decibel">
          <span v-for="(height, index) in thumbHeightLeft" :key="'right' + index" :style="{'height': height + 'px'}"></span>
        </div>
      </div>
      <div class="record-end-btns" :class="{'ending': eningAnimated}" v-if="!recording">
        <div id="animatButton" class="record-playVoice-btn" @click.stop.prevent="playMySound()">
          <i :class="{'loading': animat}" >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </i>
        </div>
        <div class="record-clear-btn" @click.stop.prevent="againRecord()">
          <i ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'
import bus from '../../../bus'
import Recorder from '../../../plugins/recorder'
import SoundManager from '../../../plugins/soundManager'

export default {
  props: ['code', 'sentence'],
  data () {
    return {
      thumbHeightLeft: _.fill(Array(5), 2), // 左侧录音声音幅度
      thumbHeightRight: _.fill(Array(5), 2), // 右侧录音声音幅度
      eningAnimated: false,
      isRecord: false, // 这个是表示是否开始录音
      recording: false, // 是否是正在录音
      animat: false, // 播放自己录音的动画
      recordActivity: false, // 录音是否激活
      time: 0, // 累计时间
      timerInterval: null // 时间间隔器
    }
  },
  created () {
    this.$on('init', () => {
      this.init()
    })
  },
  watch: {
    time (val) {
      if (val === 60) {
        this.recordStop()
      }
    }
  },
  cumputed: {
    ...mapState({
      qiniuToken: state => state.learn.qiniuToken
    })
  },
  mounted () {
    console.log('录音组件父组件的数值', this.sentence, this.code)
    // 初始化
    Recorder.init()
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken' // 获取七牛token
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken', // 更新七牛token
      'updateLocked': 'learn/updateLocked'
    }),
    // 点击开始录音
    startRecord () {
      if (this.recording) {
        this.recordStop()
        return
      }
      this.isRecord = true
      this.recording = true
      _.delay(() => {
        SoundManager.playSnd('recordPro')
      }, 500)
      _.delay(() => {
        Recorder.startRecording()
        this.updateLocked(true)
      }, 1000)
      this.timerInterval = setInterval(() => {
        this.time++
      }, 1000)
      bus.$on('record_setVolume', data => {
        var res = []
        for (var i = 0; i < data[0].length; i = i + 820) {
          var value = Math.abs(data[0][i]) * 20
          value = value * value * 16
          value = value >= 50 ? 50 - 2 : value
          value = parseInt(value + 2)
          res.push(value)
        }
        let copy = res
        let copyReverse = copy.reverse()
        this.thumbHeightLeft = res
        this.thumbHeightRight = copyReverse
      })
    },
    // 点击停止录音
    recordStop () {
      Recorder.stopRecording()
      bus.$off('record_setVolume')
      console.log('record stop!!!!!')
      clearInterval(this.timerInterval)
      this.time = 0
      this.recording = false
      this.eningAnimated = false
      this.recordActivity = false
      this.playMySound()
      this.uploadQiniu()
    },
    // 点击播放自己的录音
    playMySound () {
      this.animat = !this.animat
      if (this.animat) {
        let audio = Recorder.audio
        Recorder.playRecording()
        audio.addEventListener('ended', () => {
          this.animat = false
        })
      } else {
        Recorder.stopRecordSoud()
      }
    },
    // 点击重新开始录音
    againRecord (e) {
      this.eningAnimated = true
      setTimeout(() => {
        this.startRecord()
      }, 500)
    },
    // 关闭录音
    closeRecord () {
      this.isRecord = false
      this.recording = false
      this.animat = false
      Recorder.stopRecording()
      bus.$off('record_setVolume')
    },
    uploadQiniu () {
      let isHaveRecord = Recorder.isHaveRecord()
      if (isHaveRecord) {
        this.getQiniuToken().then(res => {
          if (res.success) {
            let qiniuToken = res.token
            console.log(qiniuToken)
            Recorder.uploadQiniu(qiniuToken, this.code, this.sentence)
          }
        })
      }
      console.log(isHaveRecord)
    }
  }
}
</script>

<style lang="less" scoped>
.record-decibel {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  span {
    width: 2px;
    height: 2px;
    border-radius: 2px;
    background: #fff;
    margin: 0 5px;
    transition: height 0.3s ease;
  }
}
</style>
