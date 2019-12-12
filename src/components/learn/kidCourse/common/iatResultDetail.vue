<template>
  <div class="iat-result">
    <div class="iat-result-item" :id="item.form_code" v-for="item in iatResult" :key="item.form_code">
      <i class='icon-horn' @click="play(item, $event)"></i>
      <div class="grade-color">
        <p class="sentence" v-html="item.originSentence"></p>
        <span :class="['score', {'right': item.score >= 80, 'wrong': item.score < 60}]">{{item.score}}<em>分</em></span>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  props: ['iatResult'],
  data () {
    return {
      playAudio: null
    }
  },
  mounted () {
    console.log(this.iatResult)
  },
  methods: {
    play (item, event) {
      $('.iat-result-item').find('i').removeClass('playing')
      if (this.playAudio) {
        this.playAudio.pause()
      }
      let audio = new Audio()
      audio.src = item.recordUrl
      this.playAudio = audio
      audio.addEventListener('canplay', () => {
        $('#' + item.form_code).find('i').addClass('playing')
        audio.play()
      })
      audio.addEventListener('ended', () => {
        $('#' + item.form_code).find('i').removeClass('playing')
      })
    },
    reset () {
      if (this.playAudio) {
        $('.iat-result-item').find('i').removeClass('playing')
        this.playAudio.pause()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.iat-result {
  min-height: 262px;
  max-height: 430px;
  margin: 28px 48px 14px;
  box-shadow:0px 0px 16px 0px rgba(0,0,0,0.14);
  border-radius: 8px;
  // white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  overflow: -moz-scrollbars-none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.iat-result-item {
  padding: 20px 24px 20px;
  border-bottom: 1px solid rgba(151, 151, 151, .13);
  &:last-child {
    border-bottom: 0px;
  }
  .icon-horn {
    cursor: pointer;
    display: inline-block;
    width:20px;
    height:16px;
    background-image: url('../../../../../static/images/kid/icon-laba.png');
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 5px;
  }
  .playing {
    background-image: url('../../../../../static/images/kid/icon-laba.gif');
  }
  .grade-color {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .sentence {
      font-size:18px;
      font-weight:500;
      color:#3c5b6f;
      max-width: 430px;
    }
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

.blue {
  color:#2ca0e5 !important;
}

.wrong {
  color: #FF3B30 !important;
  background:rgba(253,58,47,.01)!important;
}

.right {
  color: #1FBD3A !important;
  background:rgba(31,189,58,.01)!important;
}
</style>
