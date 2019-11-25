<template>
  <ul>
    <li v-for="(form, index) in evaluatingData" :key="form.form_code">
      <div class="li-item">
        <div class="review-item">
          <p class="core-word">
            <span class="word" :class="{'right': colorClass(form.score) == 'right', 'wrong': colorClass(form.score) == 'wrong'}">{{form.sentence}}</span>
            <i class="icon-horn" :id="'word' + index" @click="playRecordWordSound(form, index)"></i>
          </p>
          <table class="syllable">
            <tr v-for="(phone, index) in form.words_score[0].phonemes" :key="index">
              <td class="first">{{ (index == 0) ? phone.phonetic_symbol : '' }}</td>
              <td>{{ '音素 ' + phone.phoneme }}</td>
              <td>{{ phone.state == 0 ? '朗读正常' : '未朗读' }}</td>
            </tr>
          </table>
        </div>
        <p class="grade-color">
          <span class="score" :class="{'right': colorClass(form.score) == 'right', 'wrong': colorClass(form.score) == 'wrong'}"><em>{{Math.round(form.score)}}</em>分</span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'

export default {
  props: ['evaluatingData'],
  data () {
    return {
      audio: new Audio(),
      isPlay: false
    }
  },
  computed: {
    ...mapState({
      kidRecordList: state => state.kidRecordList
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
    // 截取字符串的最后一个
    stringPop (str) {
      return parseInt(str.split('-').pop())
    },
    // 点击播放自己的录音
    playRecordWordSound (word, index) {
      $('.icon-horn').removeClass('playing')
      console.log(this.kidRecordList, word, index)
      if (!this.isPlay) {
        let curorder = this.stringPop(word.form_code)
        let item = this.kidRecordList.filter(res => {
          return res.list_order === curorder
        })
        this.audio.src = item[0].record_sound_url
        this.audio.oncanplay = () => {
          this.audio.play()
          this.isPlay = true
          $('#word' + index).addClass('playing')
        }
        this.audio.onended = () => {
          this.isPlay = false
          $('#word' + index).removeClass('playing')
        }
      } else {
        this.audio.pause()
        this.isPlay = false
        $('#word' + index).removeClass('playing')
      }
    }
  }
}
</script>

<style lang="less" scoped>
ul{
  li {
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
    .li-item {
      padding: 16px 0 14px;
      border-top: 1px solid rgba(151, 151, 151, .13);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .review-item {
      .core-word {
        display: flex;
        align-items: center;
        .word {
          font-size: 18px;
          font-weight: 500;
          line-height: 28px;
          color: #3C5B6F;
          margin-right: 10px;
        }
        .collection {
          display: inline-block;
          width: 13px;
          height: 16px;
          background: url('../../../../../static/images/kid/icon-collection.png') no-repeat center;
          background-size: cover;
          margin-right: 4px;
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
    .icon-horn {
      cursor: pointer;
      display: inline-block;
      width:20px;
      height:16px;
      background-image: url('../../../../../static/images/kid/icon-laba.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    .playing {
      background-image: url('../../../../../static/images/kid/icon-laba.gif');
    }
    .score {
      font-size:16px;
      font-weight:bold;
      line-height:35px;
      color: #3C5B6F;
      em {
        font-size:26px;
        line-height:28px;
      }
    }
  }
  li:nth-child(1) {
    border-top: none;
  }
}
.wrong {
  color: #FF3B30 !important;
}
.right {
  color: #1FBD3A !important;
}
</style>
