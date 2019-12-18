<template>
<div class="word-item">
  <div class="item" v-for="(item, index) in newWords" :key="index">
    <div class="item-content">
      <div class="review-item">
        <p class="core-word">
          <span class="word" :class="{'right': colorClass(item.score) == 'right', 'wrong': colorClass(item.score) == 'wrong'}">{{item.word}}</span>
          <i class="icon-horn" @click="startTTS($event, item.word)"></i>
        </p>
        <table class="syllable">
          <tr v-for="(syll, index) in item.syllInfos" :key="'phone-' + index">
            <td>{{ '音节 [' + syll.content + ']' }}</td>
            <td>{{ syll.score >= 60 ? '读得真棒' : '继续加油' }}</td>
          </tr>
        </table>
      </div>
      <p class="score-color">
        <span class="score" :class="{'right': colorClass(item.score) == 'right', 'wrong': colorClass(item.score) == 'wrong'}">{{Math.round(item.score)}}<em>分</em></span>
      </p>
    </div>
  </div>
</div>

</template>

<script>
import $ from 'jquery'
import TTS from '../../../../plugins/xf_tts'
import { PCM2WAV } from '../../../../plugins/pcm2wav'

export default {
  props: ['newWords'],
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
    colorClass (totalScore) {
      if (totalScore >= 80) {
        return 'right'
      } else if (totalScore < 60) {
        return 'wrong'
      }
    },
    startTTS (event, word) {
      let ttsRecorder = new TTS.TtsRecorder({
        lang: 'en',
        text: word,
        onClose: (e) => {
          console.log('onClose')
        },
        onError: (data) => {
          alert('WebSocket连接失败')
        },
        onMessage: (e) => {
          let jsonData = JSON.parse(e.data)
          if (jsonData.data) {
            // atob ascii to binary
            let bstr = atob(jsonData.data.audio)
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            let pcm2wav = new PCM2WAV()
            pcm2wav.write(u8arr, (res) => {
              let data = pcm2wav.read()
              let blob = new Blob([data], {type: 'audio/wav'})
              let audio = new Audio()
              audio.src = URL.createObjectURL(blob)
              audio.oncanplay = () => {
                $(event.target).addClass('playing')
                audio.play()
              }
              audio.onended = () => {
                $(event.target).removeClass('playing')
              }
            })
          }
        },
        onStart: () => {
          console.log('onStart')
        }
      })
      ttsRecorder.start()
    }
  }
}
</script>

<style lang="less" scoped>
.word-item {
  width: 470px;
  min-height: 260px;
  max-height: 600px;
  padding: 0px 32px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  // overflow: -moz-scrollbars-none;
  // overflow: -moz-scrollbars-none;
  &::-webkit-scrollbar {
    // display: none;
  }
}
.item .item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 2px solid rgba(151, 151, 151, .15);
  &:last-child {
    border-bottom: none;
  }
  .review-item {
    .core-word {
      display: flex;
      align-items: center;
      .word {
        font-size: 22px;
        font-weight: 500;
        line-height: 28px;
        color: #3C5B6F;
        margin-right: 10px;
      }
      .icon-horn {
        cursor: pointer;
        display: inline-block;
        width:20px;
        height:16px;
        background: url('../../../../../static/images/kid/icon-laba.png') no-repeat center;
        background-size: cover;
        margin-top: 5px;
      }
      .playing {
        background-image: url('../../../../../static/images/kid/icon-laba.gif');
      }
    }
    .syllable {
      tr {
        td {
          padding: 6px 6px 0 0;
          font-size: 14px;
          color: #5D717F;
          line-height: 20px;
          font-weight: 400;
        }
      }
    }
  }
  .score-color {
    .score {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 91px;
      height: 65px;
      font-size:26px;
      font-weight:bold;
      line-height:65px;
      color: #3C5B6F;
      border-radius: 4px;
      background:rgba(0,0,0,.01);
      em {
        font-size:16px;
        padding-top: 8px;
      }
    }
  }
}
.wrong {
  color: #FF3B30 !important;
  background:rgba(253,58,47,.01)!important;
}
.right {
  color: #1FBD3A !important;
  background:rgba(31,189,58,.01)!important;
}
@media (max-height: 610px){
  .word-item {
    width: 400px;
    max-height: 400px;
  }
}
</style>
