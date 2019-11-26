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
      <a class="score-report" @click="scoreReport()" v-show="xfSpeechType === 'ise' && isShowIseReport">
        <p v-show="isShowAnimate"></p>
        <i></i>
      </a>
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
      isShowAnimate: true
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
        width: 42px;
        height: 42px;
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
  .score-report {
    position: relative;
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
</style>
