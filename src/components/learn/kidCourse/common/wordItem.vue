<template>
<div class="word-item">
  <div class="item" v-for="(word, index) in newWords" :key="index">
    <div class="review-item">
      <p class="core-word">
        <span class="word" :class="{'right': colorClass(word.total_score) == 'right', 'wrong': colorClass(word.total_score) == 'wrong'}">{{word.content}}</span>
        <i class="icon-horn" @click="startTTS($event, word.content)"></i>
      </p>
      <table class="syllable">
        <tr v-for="(phone, index) in word.phones" :key="'phone-' + index">
          <td class="first">{{ (index == 0) ? word.sylls : '' }}</td>
          <td>{{ '音素 [' + xfSyllPhone[phone.content] + ']' }}</td>
          <td>{{ phone.dp_message == '0' ? '朗读正常' : '未朗读' }}</td>
        </tr>
      </table>
    </div>
    <p class="score-color">
      <span class="score" :class="{'right': colorClass(word.total_score) == 'right', 'wrong': colorClass(word.total_score) == 'wrong'}"><em>{{Math.round(word.total_score)}}</em>分</span>
    </p>
  </div>
</div>

</template>

<script>
import $ from 'jquery'
import { mapState } from 'vuex'
import TTS from '../../../../plugins/xf_tts'
import { PCM2WAV } from '../../../../plugins/pcm2wav'

export default {
  props: ['newWords'],
  data () {
    return {}
  },
  computed: {
    ...mapState({
      xfSyllPhone: state => state.xfSyllPhone // 因素的对应表
    })
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
  padding: 24px 32px;
  overflow-y: auto;
}
.word-item::-webkit-scrollbar { /*滚动条整体样式*/
  width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  scrollbar-arrow-color:#fff;
}
.word-item::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background: rgba(0,0,0,0);
  scrollbar-arrow-color:#fff;
}
.word-item::-webkit-scrollbar-track {/*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
  border-radius: 0;
  background: rgba(0,0,0,0);
}
.item {
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
      }
      .playing {
        background-image: url('../../../../../static/images/kid/icon-laba.gif');
      }
    }
    .syllable {
      tr {
        td {
          padding: 6px 12px 0 0;
          font-size: 14px;
          color: #5D717F;
          line-height: 20px;
          font-weight: 400;
          &:first-child {
            font-size: 16px;
            font-weight: 500;
          }
        }
      }
    }
  }
  .score-color {
    .score {
      font-size:18px;
      font-weight:bold;
      line-height:35px;
      color: #3C5B6F;
      em {
        font-size:22px;
        font-weight:bold;
        line-height:28px;
      }
    }
  }
}
.wrong {
  color: #FF3B30 !important;
}
.right {
  color: #1FBD3A !important;
}
</style>
