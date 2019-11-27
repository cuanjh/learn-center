<template>
  <div class="nav-container">
    <div class="left">
      <div>
        <a href="javascript:;" @click="back" class="back">
          <i></i>
        </a>
        <span>{{ chapterDes }}</span>
        <span>{{ type == 'draw' ? '绘本阅读' : '核心单词' }}</span>
      </div>
      <div id="score-report" v-show="xfSpeechType === 'ise' && isShowIseReport">
        <a class="score-report" @click="scoreReport()" @mouseenter="isShowReportTip = true" @mouseleave="isShowReportTip = false">
          <p v-show="isShowAnimate"></p>
          <i></i>
        </a>
        <transition name="fade" mode="out-in">
          <div class="report-tip" v-show="isShowReportTip">
            <span>语音评分报告</span>
          </div>
        </transition>
      </div>
    </div>
    <record-box :chapterCode="chapterCode" :type="type"/>
  </div>
</template>

<script>
import RecordBox from './recordBox.vue'
import Bus from '../../../../bus'
import { mapState } from 'vuex'

export default {
  props: ['chapterCode', 'type'],
  data () {
    return {
      isShowIseReport: false,
      isShowAnimate: true,
      isShowReportTip: false
    }
  },
  created () {
    Bus.$on('setIsShowIseReport', (flag) => {
      this.isShowIseReport = flag
      setTimeout(() => {
        this.isShowAnimate = false
      }, 5000)
    })
  },
  components: {
    RecordBox
  },
  computed: {
    ...mapState({
      xfSpeechType: state => state.xfSpeechType
    }),
    chapterDes () {
      let arr = this.chapterCode.toLowerCase().split('-')
      return '课程' + ((parseInt(arr[3].replace('unit', '')) - 1) * 6 + parseInt(arr[4].replace('chapter', '')))
    }
  },
  methods: {
    back () {
      this.$emit('back')
    },
    scoreReport () {
      console.log('点击语言报告')
      Bus.$emit('busGradeBox')
    }
  }
}
</script>

<style lang="less" scoped>
.nav-container {
  width: 100%;
  height: 76px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  .back {
    margin-left: 76px;
    min-width: 42px;
    text-align: center;
    i {
      display: inline-block;
      text-align: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background-image: url('../../../../../static/images/kid/icon-back.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    &:hover {
      i {
        // width: 42px;
        // height: 42px;
        transform: scale(1.1);
        box-shadow:0px 4px 9px -4px rgba(24,193,255,1);
      }
    }
  }
  span {
    font-size: 24px;
    font-weight: 600;
    color:#3C5B6F;
    margin-left: 32px;
  }
  .left {
    height: 100%;
    float: left;
    display: flex;
    flex-direction: row;
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding-right: 30px;
  }
  #score-report {
    position: relative;
    .score-report {
      display: inline-block;
      position: relative;
      width: 100%;
      height: 100%;
      i {
        position: relative;
        display: inline-block;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-image: url('../../../../../static/images/kid/icon-ise-report.png');
        background-repeat: no-repeat;
        background-size: cover;
      }
      p {
        position: absolute;
        width: 38px;
        height: 38px;
        background: #89DA31;
        border-radius: 50%;
        animation: ani 2s linear infinite;
        -moz-animation: ani 2s linear infinite;
        -webkit-animation: ani 2s linear infinite;
      }
    }
    .report-tip {
      position: absolute;
      width: 153px;
      height: 77px;
      background: url('../../../../../static/images/kidcontent/pic-blue-record-list.png');
      background-repeat: no-repeat;
      background-size: cover;
      top: 32px;
      left: -56px;
      text-align: center;
      line-height: 80px;
      span {
        font-size: 15px;
        font-weight: 600;
        color: #fff;
        margin-left: 0;
      }
    }
  }
}

@keyframes ani {
  0%{
    width: 38px;
    height: 38px;
    background: #89DA31;
    border-radius: 50%;
  }
  25%{
    margin-left: -6px;
    margin-top: -6px;
    width: 50px;
    height: 50px;
    background: rgba(137, 218, 49, .25);
  }
  50%{
    margin-left: -9px;
    margin-top: -9px;
    width: 56px;
    height: 56px;
    background: rgba(137, 218, 49, .1);
  }
  75%{
    margin-left: -6px;
    margin-top: -6px;
    width: 50px;
    height: 50px;
    background: rgba(137, 218, 49, .25);
  }
  100%{
    width: 38px;
    height: 38px;
    background: #89DA31;
    border-radius: 50%;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
