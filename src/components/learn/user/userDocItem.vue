<template>
  <div class='userdoc-item-wrap'>
    <div class="userdoc-item">
      <div class='userdoc-item-left'>
        <div class="userdoc-item-left-content">
          <div class="userdoc-item-top">
            <div class="img">
              <img :src="archive.courseInfo ? archive.courseInfo.flag : ''" alt="">
            </div>
            <div class="course-text">
              <p>
                <span>{{archive.courseInfo ? archive.courseInfo.name : ''}}</span>
              </p>
               <p>
                <span>{{ archive.courseInfo ? levelArr[0] + ' ~ ' + levelArr[archive.courseInfo.level_num - 1] : '' }}</span>
              </p>
            </div>
          </div>
          <div class="userdoc-item-bottom" v-if="archive">
            <div class="userdoc-item-bottom-left">
              <canvas-circle :percent="completeRate ? completeRate : 0" ></canvas-circle>
              <p class="text"><span>课程完成度</span></p>
            </div>
            <div class="userdoc-item-bottom-right">
              <div class="right-content">
                <p>
                  <span>{{archive.learnInfo ? archive.learnInfo.words_num : 0}}<em>个</em></span>
                  <span>累计词汇量</span>
                </p>
                <p>
                  <span>{{archive.learnInfo ? archive.learnInfo.correct_rate * 100 : 0}}<em>%</em></span>
                  <span>正确率</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右边的思维图 -->
      <div class="userdoc-item-right" v-if="archive">
        <div class="userdoc-item-right-content">
          <p>语言能力模型</p>
          <echart4-user-doc :echartdata="archive.learnModel" class='userdoc-item-echart'></echart4-user-doc>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Echart4UserDoc from './echart4UserDoc.vue'
import CanvasCircle from './canvasCircle.vue'

export default {
  props: ['archive'],
  data () {
    return {
      levelArr: ['初级 A1', '初级 A2', '中级 B1', '中级 B2', '高级 C1', '高级 C2']
      // cicleList: {ratio: this.archive['complete_rate'] >= 0 ? this.archive['complete_rate'] * 100 : '0'}
    }
  },
  created () {
  },
  components: {
    Echart4UserDoc,
    CanvasCircle
  },
  mounted () {
  },
  computed: {
    ...mapState({
      levelDes: state => state.course.levelDes,
      languagueHander: state => state.course.languagueHander
    }),
    completeRate () {
      if (!this.archive.learnInfo) {
        return 0
      }
      let rate = Math.round((this.archive.learnInfo.lesson_finished_num / this.archive.learnInfo.lesson_num) * 100)
      console.log('rate', rate)
      return rate
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.userdoc-item {
  width: 100%;
  margin-bottom: 50px;
  .userdoc-item-left {
    display: inline-block;
    width: 578px;
    background: #ffffff;
    border-radius: 0 0 0 5px;
    .userdoc-item-left-content {
      padding: 28px 25px 70px;
      .userdoc-item-top {
        width: 100%;
        display: flex;
        padding-bottom: 74px;
        .img {
          width: 62px;
          height: 62px;
          border-radius: 6px;
          background: #C7EAFFFF;
          margin-right: 10px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
            object-fit: cover;
          }
        }
        .course-text {
          p {
            font-size:15px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(153,153,153,1);
          }
          p:nth-child(1) {
            padding: 4px 0 6px;
            padding: 4px 0 6px;
            font-size:18px;
            font-family:PingFangSC-Semibold;
            font-weight:600;
            color:rgba(51,51,51,1);
          }
        }
      }
      .userdoc-item-bottom {
        width: 100%;
        .userdoc-item-bottom-left {
          display: inline-block;
          width: 282px;
          .text {
            font-size:14px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(126,146,159,1);
            text-align: center;
            padding-top: 30px;
          }
        }
        .userdoc-item-bottom-right {
          display: inline-block;
          width: 240px;
          border-left: 1px solid #EAEAEAFF;
          .right-content {
            padding: 4px 0;
            p {
              text-align: center;
              font-size:30px;
              font-family:Helvetica;
              color:rgba(23,23,23,1);
              padding-bottom: 64px;
              em {
                font-size: 16px;
                line-height: 42px;
                padding-left: 10px;
              }
              span:nth-child(2) {
                display: block;
                font-size:14px;
                font-family:PingFang-SC-Medium;
                font-weight:500;
                color:rgba(126,146,159,1);
              }
            }
            p:last-child {
              padding-bottom: 0px;
            }
          }
        }
      }
    }
  }
  .userdoc-item-right {
    float:right;
    width: 300px;
    background: #ffffff;
    border-radius: 0 0 5px 0;
    .userdoc-item-right-content {
      width: 100%;
      height: 430px;
      padding: 28px 25px 70px;
      .userdoc-item-echart {
        // float: left;
        // background: red;
        width: 100%;
        height: 320px;
        margin-top: 60px;
      }
    }
  }
}
</style>
