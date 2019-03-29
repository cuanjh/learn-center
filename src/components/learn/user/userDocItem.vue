<template>
  <!-- <div class="userdoc-item">
    <div class='userdoc-item-top'>
      <div class='user-doc-item-img'>
        <img :src="'https://course-assets1.talkmate.com/course/covers/'+archive.course_code+'-2x.webp?imageView2/0/w/400/h/400/format/jpg'">
        <div class='user-doc-item-tips'>
          <p>
            <span>全球说《 {{archive.course_name[languagueHander]}} 》</span>
            <span><em>{{ levelDes[archive.current_chapter_code.split('-')[2]] }}</em></span>
          </p>
          <p v-text="archive['complete_rate']>=0?archive['complete_rate']*100+'%':'暂无数据' "></p>
        </div>
      </div>
      <echart4-user-doc :echartdata="archive" class='userdoc-item-echart'></echart4-user-doc>
    </div>
    <div class="userdoc-item-bottom">
      <p><span>正确率</span><span v-text="archive['correct_rate']>0?archive['correct_rate']*100+'%':'暂无数据'"></span></p>
      <p><span>累计学习时长</span><span>{{ archive['learn_time']>0?parseInt(archive['learn_time']/60)+'分钟':'暂无数据' }}</span></p>
    </div>
  </div> -->
  <div class='userdoc-item-wrap'>
    <div class="userdoc-item">
      <div class='userdoc-item-left'>
        <div class="userdoc-item-left-content">
          <div class="userdoc-item-top">
            <div class="img">
              <img :src="archive.course_flag" alt="">
            </div>
            <div class="course-text">
              <p v-if="archive.course_name">
                <span>{{archive.course_name[languagueHander]}}</span>
              </p>
               <p v-if="archive.current_chapter_code">
                <span>{{ levelDes[archive.current_chapter_code.split('-')[2]] }}</span>
              </p>
            </div>
          </div>
          <div class="userdoc-item-bottom" v-if="archive">
            <div class="userdoc-item-bottom-left">
              <!-- <div class="progress-bg">
                <div class="progress"></div>
              </div> -->
              <canvas-circle :percent="archive['complete_rate'] >= 0 ? archive['complete_rate'] * 100 : '0'" ></canvas-circle>
              <p class="text"><span>课程完成度</span></p>
            </div>
            <div class="userdoc-item-bottom-right">
              <div class="right-content">
                <p>
                  <span>{{archive.word_num}}<em>个</em></span>
                  <span>累计词汇量</span>
                </p>
                <p>
                  <span>{{archive.correct_rate * 100}}<em>%</em></span>
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
          <echart4-user-doc :echartdata="archive" class='userdoc-item-echart'></echart4-user-doc>
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
    })
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
    display: inline-block;
    width: 300px;
    background: #ffffff;
    margin-left: 6px;
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
