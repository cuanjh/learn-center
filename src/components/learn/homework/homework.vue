<template>
  <div class="homework-wrap">
    <div class="homework-container">
      <div class="homework-balk">
        <i></i>
        <span>返回</span>
      </div>
      <div class="homework-content">
        <div class="homework-title">
          <p>英语.中级B1.课程1</p>
        </div>
        <div class="my-work">
          <p class="line"></p>
          <span>我的作业</span>
        </div>
        <!-- 作业列表，分为语音和写作 -->
        <div class="homework-list">
          <ul>
            <li class="speak">
              <div class="question">
                <i></i>
                <span>请根据文字内容录音。</span>
              </div>
              <div class="que-con">
                <p>The fifth girl in line is my elder sister line is my elder sister.</p>
              </div>
              <div class="footer">
                <p class="btn submint disable">未完成</p>
              </div>
            </li>
            <li class="speak">
              <div class="question">
                <i></i>
                <span>请根据文字内容录音。</span>
              </div>
              <div class="que-con">
                <p class="repeatSpeak">The fifth girl in line is my elder sister line is my elder sister.</p>
              </div>
              <div class="footer">
                <p class="btn submint disable">未完成</p>
              </div>
            </li>
            <li class="write">
              <div class="question">
                <i></i>
                <span>用下列单词造句</span>
              </div>
              <div class="que-con">
                <p class="repeatWrite">
                  <span>write</span>
                  <span>man</span>
                  <span>girl</span>
                  <span>walk</span>
                  <span>woman</span>
                  <span>run</span>
                  <span>read</span>
                  <span>read</span>
                  <span>woman</span>
                </p>
              </div>
              <div class="footer">
                <p class="btn submint disable">未完成</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 语音的弹框 -->
      <div class="repeatSpeak-box">
        <div class="repeatSpeak-container">
          <div class="repeatSpeak-content">
            <div class="repeatSpeak-header">
              <i></i>
              <span>请根据文字内容录音。</span>
            </div>
            <div class="speak-con">
              <p>The fifth girl in line is my elder sister line is my elder sister.</p>
            </div>
            <div class="m-b">
              <canvas width="112" height="112"></canvas>
              <div class="m-bg">
                <div class="m-track" style="height: 0px;"></div>
              </div>
              <div class="mac"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 写作弹框 -->
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {}
  },
  created () {},
  mounted () {
    this.$parent.$emit('initLayout')
    let curChapterCode
    // 判断如果currentChapterCode不存在去localStorgae中取
    if (!this.currentChapterCode) {
      curChapterCode = localStorage.getItem('currentChapterCode')
    } else {
      curChapterCode = this.currentChapterCode
    }
    curChapterCode = 'ENG-Basic-Level3-Unit1-Chapter1'
    let activityCode = curChapterCode + '-A8'
    this.homeworkContent(activityCode).then((res) => {
      console.log('=====>', res)
    })
  },
  components: {},
  computed: {
    ...mapState({
      'currentChapterCode': state => state.course.currentChapterCode
    })
  },
  methods: {
    ...mapActions({
      homeworkContent: 'course/homeworkContent'
    })
  }
}
</script>

<style lang="less" scoped>
  .homework-container {
    width: 890px;
    margin: 80px auto 0;
    .homework-balk {
      width: 80px;
      height: 30px;
      background: #ffffff;
      text-align: center;
      line-height: 30px;
      border-radius: 6px;
      margin-bottom: 28px;
      i {
        display: inline-block;
        background: url("../../../../static/images/homework/balck.png")no-repeat;
        background-size: 100% 100%;
        background-position-y: 3px;
        width: 12px;
        height: 18px;
      }
    }
    .homework-content {
      width: 100%;
      .homework-title {
        width: 100%;
        height: 70px;
        background: #2A9FE4;
        p {
          display: inline-block;
          vertical-align: middle;
          line-height: 70px;
          font-size: 26px;
          color: #ffffff;
          margin-left: 20px;
        }
      }
      .my-work {
        width: 100%;
        height: 60px;
        background: #ffffff;
        .line{
          display: inline-block;
          vertical-align: middle;
          line-height: 60px;
          width: 8px;
          height: 20px;
          background: #2A9FE4;
          margin: 20px 10px 20px 20px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
          border-bottom-left-radius: 8px;
        }
        span {
          font-size: 24px;
        }
      }
      .homework-list {
        width: 100%;
        margin-top: 20px;
      }
      ul {
        width: 100%;
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
        li {
          width: 280px;
          // height: 180px;
          background: #ffffff;
          margin: 20px 0;
          border-radius: 6px;
        }
        .speak {
          .question {
            width: 100%;
            margin: 20px 0;
            i {
              display: inline-block;
              background: url('../../../../static/images/homework/yuyingsmall.png') no-repeat;
              background-size: 100% 100%;
              width: 12px;
              height: 18px;
              margin: 0 4px 0 16px;
              outline: 0;
              vertical-align: middle;
            }
            span {
              color: #999999;
              font-size: 16px;
            }
            .sentence {
              color: #999999;
              font-size: 16px;
            }
          }
          .que-con {
            overflow: hidden;
            margin: 10px auto;
            font-size: 16px;
            color: #4A4A4A;
            margin-left: 16px;
          }
          .footer {
            width: 66px;
            height: 36px;
            margin-top: 28px;
            margin-left: 16px;
            .btn {
              width: 66px;
              height: 30px;
              border-radius: 6px;
              text-align: center;
              background-color: #2A9FE4;
              line-height: 30px;
            }
            .disable {
              background-color: #e9ecf6;
              color: #b5bccf;
              cursor: default;
            }
          }
        }
        .write {
          .question {
            width: 100%;
            margin: 20px 0;
            i {
              display: inline-block;
              background: url('../../../../static/images/homework/write.png') no-repeat;
              background-size: 100% 100%;
              width: 12px;
              height: 18px;
              margin: 0 4px 0 16px;
              outline: 0;
              vertical-align: middle;
            }
            span {
              color: #999999;
              font-size: 16px;
            }
            .sentence {
              color: #999999;
              font-size: 16px;
            }
          }
          .que-con {
            overflow: hidden;
            margin: 10px auto;
            font-size: 16px;
            color: #4A4A4A;
            margin-left: 16px;
          }
          .footer {
            width: 66px;
            height: 36px;
            margin-top: 28px;
            margin-left: 16px;
            .btn {
              width: 66px;
              height: 30px;
              border-radius: 6px;
              text-align: center;
              background-color: #2A9FE4;
              line-height: 30px;
            }
            .disable {
              background-color: #e9ecf6;
              color: #b5bccf;
              cursor: default;
            }
          }
        }
      }
    }
  }
</style>
