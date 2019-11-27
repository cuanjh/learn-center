<template>
  <transition name="fade">
    <div class="evaluating-modal-box" v-show="isShowEvaluatingModal && isVip">
      <div class="evaluating-content">
        <div class="close-img" @click="closeModal()"></div>
        <!-- 是会员 -->
        <div class="evaluating">
          <!-- 这是绘本阅读 -->
          <div class="user-avatar">
            <img :src="userInfo ? userInfo.photo : ''" alt="">
            <div class="right">
              <div class="right-left">
                <p class="nikename" v-text="userInfo ? userInfo.nickname : ''"></p>
                <div class="star">
                  <span
                    v-for="(itemClass,index) in itemClasslass"
                    :class="itemClass" class="star-item"
                    :key="index">
                  </span>
                </div>
              </div>
              <a href="javascript:;" class="go-intensify" @click="strengthening()">
                {{type == 'draw' ? '立即强化' : '听首儿歌'}}
              </a>
            </div>
          </div>
          <!-- 绘本阅读 -->
          <div class="content-box" v-if="type == 'draw'">
            <div class="swiper-content">
              <div class="swiper-container swiper-evaluating">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="item in evaluatingData" :key="item.form_code">
                    <!-- 母语的句子 -->
                    <div class="mother-sentence-box">
                      <div class="mother-grade">
                        <i class="icon-horn" :class="{'playing': isPlay}" @click="playRecordSound(item)"></i>
                        <div class="grade-color">
                          <p class="sentence" :data-content="item.sentence">
                            <span v-for="(content, index) in item.formatContent" :key="index" v-html="content + ' '"></span>
                          </p>
                          <span class="score" :class="{'right': colorClass(item.score) == 'right', 'wrong': colorClass(item.score) == 'wrong'}"><em>{{item.score}}</em>分</span>
                        </div>
                      </div>
                      <div class="bottom-line">
                        <p>评分详情</p>
                        <p class="collection">
                          <i></i>
                          <span>核心单词</span>
                        </p>
                      </div>
                    </div>
                    <!-- 讯飞的识别列表音节 v-if="!Array.isArray(score.sentence)" -->
                    <div >
                      <ul>
                        <li v-for="(w, index) in item.words_score" :key="'sentence-word' + index">
                          <div class="li-item" v-if="w.score">
                            <div class="review-item">
                              <p class="core-word">
                                <span class="word" :class="{'right': colorClass(w.score) == 'right', 'wrong': colorClass(w.score) == 'wrong'}">{{w.word}}</span>
                                <i class="collection" v-if="coreWords.indexOf(w.word) > -1"></i>
                              </p>
                              <table class="syllable">
                                <tr v-for="(phone, index) in w.phonemes" :key="index">
                                  <td class="first">{{ (index == 0) ? w.phonetic_symbol : '' }}</td>
                                  <td>{{ '音素 ' + phone.phoneme }}</td>
                                  <td>{{ phone.state == 0 ? '朗读正常' : '未朗读' }}</td>
                                </tr>
                              </table>
                            </div>
                            <p class="grade-score-color">
                              <span class="score" :class="{'right': colorClass(w.score) == 'right', 'wrong': colorClass(w.score) == 'wrong'}"><em>{{Math.round(w.score)}}</em>分</span>
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 不同显示70分以下 -->
            <div class="bottom-prompt" v-if="itemClasslass != 5">
              <p class="bottom-title blue">读的真棒！</p>
              <p>共有<em class="blue">{{coreWords.length}}</em>个</p>
              <p>核心单词需要强化，快去学习一下吧～</p>
            </div>
            <!-- 70分以上 -->
            <div class="bottom-prompt" v-else>
              <p>小朋友，你已经完成绘本阅读啦，<br/>去核心单词继续强化一下吧～</p>
            </div>
          </div>
          <!-- 绘本单词学习完展示 -->
          <div class="content-box" v-if="type == 'word'">
            <div class="coreWord-content">
              <div class="coreWord-slide">
                <!-- 母语的句子 -->
                <div class="title-sentence-box">
                  <p>本课核心单词得分</p>
                </div>
                <!-- 讯飞的识别列表音节 -->
                <evaluating-word :evaluatingData="evaluatingData"/>
              </div>
            </div>
            <!-- 核心单词 -->
            <div class="bottom-prompt">
              <p>小朋友，核心单词已经学完啦，<br/>去听首儿歌放松一下吧！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import $ from 'jquery'
import Bus from '../../../../bus'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import EvaluatingWord from './evaluatingWord.vue'

const lengths = 5
const starOn = 'on'
// const starHalf = 'half'
const starOff = 'off'

export default {
  data () {
    return {
      isShowEvaluatingModal: false,
      isShowEndPrompt: true,
      isHalf: true,
      // totalScore: '',
      evaluatingData: [],
      curSwiperPage: 0,
      parentList: [],
      averageScore: null,
      coreWords: [],
      audio: new Audio(),
      isPlay: false
    }
  },
  components: {
    EvaluatingWord
  },
  created () {
    Bus.$on('showScoreDetail', (params) => {
      console.log('点击了评分详情', this.$router)
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      let curResult = xfISEResult.filter(item => {
        return item.form_code.toLowerCase().indexOf(this.chapterCode.toLowerCase() + '-' + this.type.toLowerCase()) > -1
      }).sort((obj1, obj2) => {
        if (obj1.form_code < obj2.form_code) {
          return -1
        } else if (obj1.form_code > obj2.form_code) {
          return 1
        } else {
          return 0
        }
      })
      console.log(curResult)
      // this.parentList = params
      if (this.type === 'draw') {
        this.initData(curResult)
        this.initEvaluSwiper()
      } else {
        this.initDataWord(curResult)
      }
      this.isShowEvaluatingModal = true
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo, // 用户信息
      xfSyllPhone: state => state.xfSyllPhone, // 因素的对应表
      kidRecordList: state => state.kidRecordList,
      isVip: state => state.isVip
    }),
    chapterCode () {
      return this.$route.query.code
    },
    // 是绘本还是单词
    type () {
      return this.$route.query.type
    },
    // 几颗星
    itemClasslass () { // 星星的数组
      let result = []
      let total = this.averageScore
      // // 几颗全星
      if (total > 90) {
        total = 5
      } else if (total >= 80 && total <= 90) {
        total = 4
      } else if (total >= 60 && total < 80) {
        total = 3
      } else if (total > 30 && total < 60) {
        total = 2
      } else {
        total = 1
      }
      console.log(total)
      for (var i = 0; i < total; i++) { // 放全星
        result.push(starOn)
      }
      // if (starhalf) { // 放半星
      //   result.push(starHalf)
      // }
      if (result.length < lengths) { // 如果没有满到五个星就用灰色的星星补齐9
        var offstar = lengths - result.length
        for (var j = 0; j < offstar; j++) {
          result.push(starOff)
        }
      }
      return result
    }
  },
  mounted () {
    this.initWordData()
    // this.initGuideSwiper()
    console.log(this.kidRecordList)
  },
  methods: {
    ...mapActions([
      'getKidCourseContent'
    ]),
    // 处理句子录音
    initData (result) {
      if (result.length === 0) {
        return
      }
      let totalScore = 0
      let data = []
      result.forEach(item => {
        let sentence = item
        sentence['formatContent'] = this.formatContent(item.sentence)
        totalScore += parseFloat(item.score)
        data.push(sentence)
      })
      this.averageScore = totalScore / data.length
      this.evaluatingData = data
      console.log('initData===>', data)
      console.log('average score', this.averageScore)
    },
    // 处理单词录音
    initDataWord (result) {
      if (result.length === 0) {
        return
      }
      let totalScore = 0
      let data = []
      result.forEach(item => {
        let obj = item
        totalScore += parseFloat(item.score)
        data.push(obj)
      })
      this.averageScore = totalScore / data.length
      this.evaluatingData = data
    },
    // 是绘本的时候单词列表
    initWordData () {
      this.getKidCourseContent({chapter_code: this.chapterCode}).then(res => {
        console.log('单词列表====>', res)
        this.coreWords = []
        res.teacherContent.words.forEach(item => {
          this.coreWords.push(item.word)
        })
        // this.coreWords = res.teacherContent.words
      })
    },
    // 初始化swiper
    initEvaluSwiper () {
      /* eslint-disable */
      this.$nextTick(() => {
        var swiperScore = new Swiper('.swiper-evaluating', {
          loop: false,
          autoplay: false, //自动轮播
          observer: true, // 修改swiper自己或子元素时，自动初始化swiper
          observeParents: true, // 修改swiper的父元素时，自动初始化swiper
          initialSlide: 0,
          centeredSlides:true,
          slidesPerView: 'auto',
          slideToClickedSlide: true,
          spaceBetween: 20,
          mousewheel: false,
          on: {
            init: () => {
              this.iseResultSet(0)
            },
            slideNextTransitionStart: () => {
              console.log(swiperScore.activeIndex)
              this.curSwiperPage = swiperScore.activeIndex
              let key = this.evaluatingData[swiperScore.activeIndex].form_code
              let index = this.stringPop(key)
              this.iseResultSet(this.curSwiperPage)
            },
            slideChange: () => {
              this.audio.pause()
              $('.mother-grade').find('.icon-horn').removeClass('playing')
              this.isPlay = false
            }
          }
        })
      })
      /* eslint-enable */
    },
    closeModal () {
      this.audio.pause()
      $('.mother-grade').find('.icon-horn').removeClass('playing')
      this.isPlay = false
      this.isShowEvaluatingModal = false
    },
    // 立即强化/听儿歌
    strengthening () {
      this.audio.pause()
      this.isPlay = false
      if (this.type === 'draw') {
        this.$router.push({path: '/kid/kid-stage?code=' + this.chapterCode + '&type=word'})
      } else {
        let courseCode = this.chapterCode.split('-').slice(0, 2).join('-')
        this.$router.push({path: '/app/kid-course-list/' + courseCode})
      }
    },
    // 格式化内容，添加span标签
    formatContent (content) {
      if (!content) {
        return ''
      }
      let result = []
      let arr = content.replace(new RegExp('\\n', 'g'), '<br/>').split(' ')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].trim().length > 0) {
          if (arr[i].indexOf('<br/>') > -1) {
            let r = arr[i].split('<br/>')
            for (let l = 0; l < r.length; l++) {
              if (r[l].trim().length > 0) {
                let tag = ''
                if (l === 0) {
                  tag = '<br/>'
                }
                result.push(r[l].trim() + tag)
              }
            }
          } else if (arr[i].indexOf('?') > -1) {
            let r = arr[i].split('?')
            for (let j = 0; j < r.length; j++) {
              if (r[j].trim().length > 0) {
                let tag = ''
                if (j === 0) {
                  tag = '?'
                }
                result.push(r[j].trim() + tag)
              }
            }
          } else if (arr[i].indexOf('”') > -1) {
            let r = arr[i].split('”')
            for (let k = 0; k < r.length; k++) {
              if (r[k].trim().length > 0) {
                let tag = ''
                if (k === 0) {
                  tag = '”'
                }
                result.push(r[k].trim() + tag)
              }
            }
          } else {
            if (arr[i].trim() === '—') {
              result.push(arr[i].trim())
            } else {
              result.push(arr[i].trim())
            }
          }
        }
      }
      return result
    },
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
    // 评测结果处理
    iseResultSet (page) {
      console.log('page' + page)
      let words = this.evaluatingData[page].words_score
      $('.swiper-slide-active .grade-color').find('.sentence span').removeClass('right')
      $('.swiper-slide-active .grade-color').find('.sentence span').removeClass('wrong')
      words.forEach((word, index) => {
        let score = parseFloat(word.score)
        switch (true) {
          case score >= 80:
            $('.swiper-slide-active .grade-color').find('.sentence span:nth-child(' + (index + 1) + ')').addClass('right')
            break
          case score < 60:
            $('.swiper-slide-active .grade-color').find('.sentence span:nth-child(' + (index + 1) + ')').addClass('wrong')
            break
          default:
            break
        }
      })
    },
    // 点击播放自己的录音
    playRecordSound (form) {
      if (!this.isPlay) {
        let curorder = this.stringPop(form.form_code)
        let item = this.kidRecordList.find(res => {
          return res.list_order === curorder
        })
        this.audio.src = item.record_sound_url
        this.audio.oncanplay = () => {
          this.audio.play()
          this.isPlay = true
        }
        this.audio.onended = () => {
          this.isPlay = false
        }
      } else {
        this.audio.pause()
        this.isPlay = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.evaluating-modal-box {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index:99999999;
  overflow: hidden;
  .evaluating-content {
    width: 669px;
    min-height: 200px;
    position: absolute;
    top: 52%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius:8px;
    background: #fff;
    .close-img {
      position: absolute;
      top: -44px;
      right: 0px;
      width: 30px;
      height: 30px;
      background: url('../../../../../static/images/kid/icon-close.png') no-repeat center;
      background-size: cover;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
    .evaluating {
      padding-bottom: 20px;
    }
    .evaluating {
      .user-avatar {
        display: flex;
        width: 100%;
        padding: 20px 32px;
        background: #2CA0E5;
        border-radius: 8px 8px 0 0;
        img {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 50%;
          margin-right: 20px;
        }
        .right {
          display: flex;
          flex: 1;
          justify-content: space-between;
          align-items: center;
          .right-left {
            .nikename {
              font-size:20px;
              font-weight:500;
              color:rgba(255,255,255,1);
              line-height:42px;
            }
            .star {
              .star-item {
                display: inline-block;
                width: 20px;
                height: 20px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: 20px 20px;
                margin-right: 6px;
                // box-shadow:0px 0px 4px 0px #FFC81F;
                &:last-child {
                  margin-right: 0;
                }
                &.on {
                  background-image: url('../../../../../static/images/kid/star-on.png');
                  animation: scaleDraw .5s ease-in-out;
                }
                &.on:nth-child(1) {
                  animation-delay: .5s;
                }
                &.on:nth-child(2) {
                  animation-delay: 1s;
                }
                &.on:nth-child(3) {
                  animation-delay: 1.5s;
                }
                &.on:nth-child(4) {
                  animation-delay: 2s;
                }
                &.on:nth-child(5) {
                  animation-delay: 2.5s;
                }
                &.half {
                  background-image: url('../../../../../static/images/kid/star-half.png');
                }
                &.off {
                  background-image: url('../../../../../static/images/kid/star-off.png');
                }
              }
            }
          }
          .go-intensify {
            font-size:18px;
            font-weight:500;
            color:rgba(111,89,8,1);
            padding: 4px 24px;
            background: #FECB08;
            border-radius: 22px;
            &:hover {
              opacity: .9;
            }
          }
        }
      }
      // 下面的展示
      .bottom-prompt {
        p {
          font-size:14px;
          font-weight:500;
          color:rgba(145,145,145,1);
          text-align: center;
        }
        .bottom-title {
          font-size:20px;
          font-weight:500;
          line-height:40px;
          color:#2ca0e5;
        }
        em {
          font-size:18px;
          font-weight:600;
          line-height:24px;
          padding: 0 4px;
        }
      }
      .content-box {
        min-height: 262px;
        // 显示句子的颜色
        .swiper-content,.coreWord-content {
          .swiper-container {
            width: 100%;
            height: 100%;
            padding-top: 28px;
            padding-bottom: 16px;
          }
          .swiper-slide, .coreWord-slide {
            max-height: 360px;
            overflow-y: auto;
            width: 83%;
            padding: 24px 26px;
            background: #fff;
            box-shadow:0px 0px 16px 0px rgba(0,0,0,0.14);
            border-radius:8px;
            // margin-right: 20px;
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
            .mother-sentence-box {
              .mother-grade {
                .grade-color {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  .sentence {
                    font-size:18px;
                    font-weight:500;
                    color:#3c5b6f;
                    span {
                      font-size:18px;
                      font-weight:500;
                      color:#3c5b6f;
                    }
                  }
                }
              }
              .bottom-line {
                padding-top: 22px;
                padding-bottom: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                p {
                  font-size:20px;
                  font-weight:500;
                  color:rgba(51,51,51,1);
                }
                .collection {
                  display: flex;
                  align-items: center;
                  i {
                    display: inline-block;
                    width: 13px;
                    height: 16px;
                    background: url('../../../../../static/images/kid/icon-collection.png') no-repeat center;
                    background-size: cover;
                    margin-right: 4px;
                  }
                  span {
                    font-size:14px;
                    font-weight:400;
                    color:rgba(255,200,31,1);
                  }
                }
              }
            }
            .score {
              font-size:16px;
              font-weight:bold;
              line-height:35px;
              color: #3C5B6F;
              padding: 15px 23px;
              border-radius: 4px;
              background:rgba(0,0,0,.02);
              em {
                font-size:26px;
                line-height:28px;
              }
            }
            ul {
              li {
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
                    // display: flex;
                    .first {
                      font-size: 16px;
                      font-weight: 500;
                      color: #5D717F;
                      margin-right: 10px;
                    }
                    .syllable-list {
                      display: flex;
                      flex-direction: column;
                      font-size:14px;
                      font-weight:400;
                      color:#5d717f;
                    }
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
              }
            }
          }
          .coreWord-slide {
            margin: 28px auto 32px;
            .title-sentence-box {
              font-size:20px;
              font-weight:500;
              color:rgba(90,200,250,1);
              text-align: center;
            }
            ul{
              li:nth-child(1) {
                border-top: none;
              }
            }
          }
          .swiper-slide::-webkit-scrollbar, .coreWord-slide::-webkit-scrollbar { /*滚动条整体样式*/
            width: 1px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 1px;
            scrollbar-arrow-color:#fff;
          }
          .swiper-slide::-webkit-scrollbar-thumb, .coreWord-slide::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 5px;
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
            background: rgba(0,0,0,0);
            scrollbar-arrow-color:#fff;
          }
          .swiper-slide::-webkit-scrollbar-track, .coreWord-slide::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
            border-radius: 0;
            background: rgba(0,0,0,0);
          }
        }
      }
    }
  }
}
@keyframes scaleDraw { /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
  0% {
    transform: scale(1); /*开始为原始大小*/
  }
  50% {
    transform: scale(2);
  }
}
.blue {
  color:#2ca0e5 !important;
}
.wrong {
  color: #FF3B30 !important;
  background:rgba(253,58,47,.02)!important;
}
.right {
  color: #1FBD3A !important;
  background:rgba(31,189,58,.02)!important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media (max-height: 610px){
  .evaluating-modal-box .evaluating-content {
    width: 600px;
  }
  .evaluating-modal-box .evaluating-content .evaluating .content-box .swiper-content .swiper-slide {
    max-height: 260px
  }
}
</style>
