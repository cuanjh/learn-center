<template>
  <transition name="fade">
    <div class="evaluating-modal-box" v-show="isShowEvaluatingModal">
      <div class="evaluating-content">
        <div class="close-img" @click="closeModal()"></div>
        <!-- 非会员显示 -->
        <div class="evaluating" v-if="isVip !== 1">
          <p class="title">VIP专属语音评测</p>
          <router-link :to="{path: '/app/vip-home'}" target="_blank" class="vip">
            <p><i></i><span>开通Vip会员 , 开启智能评分</span></p>
            <i class="go-vip"></i>
          </router-link>
          <div class="lists">
            <div class="swiper-container swiper-lists">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <div class="item">
                    <p>1. 智能评分颜色说明</p>
                    <i></i>
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="item">
                    <p>2. 专属智能评分</p>
                    <i></i>
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="item">
                    <p>3.专属评分详情</p>
                    <i></i>
                  </div>
                </div>
              </div>
              <div class="swiper-pagination"></div>
            </div>
          </div>
        </div>
        <!-- 是会员 -->
        <div class="evaluating" v-else>
          <!-- 这是绘本阅读 -->
          <div class="content-box" v-if="isType == 'draw'">
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
                <a href="javascript:;" class="go-intensify" @click="strengthening()">立即强化</a>
              </div>
            </div>
            <div class="swiper-content">
              <div class="swiper-container swiper-evaluating">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(score, index) in evaluatingData" :key="'score' + index">
                    <!-- 母语的句子 -->
                    <div class="mother-sentence-box">
                      <div class="mother-grade">
                        <i class="icon-horn"></i>
                        <div class="grade-color">
                          <p class="sentence" :data-content="parentList[index].content || parentList[index].word" v-html="parentList[index].formatContent"></p>
                          <span class="score" :class="{'right': colorClass(score.total_score) == 'right', 'wrong': colorClass(score.total_score) == 'wrong'}"><em>{{Math.round(score.total_score)}}</em>分</span>
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
                        <li v-for="(item, index) in score.words" :key="'sentence-word' + index">
                          <div class="li-item" v-if="item.total_score">
                            <div class="review-item">
                              <p class="core-word">
                                <span class="word" :class="{'right': colorClass(item.total_score) == 'right', 'wrong': colorClass(item.total_score) == 'wrong'}">{{item.content}}</span>
                                <i class="collection"></i>
                              </p>
                              <div class="syllable" v-for="(phone, index) in item.iphones" :key="'phone' + index">
                                <p class="first">{{'[' + phone.syll +']'}}</p>
                                <p class="syllable-list">
                                  <span>音素 [ɑː] 朗读正常</span>
                                  <span>音素 [eu] 朗读正常</span>
                                </p>
                              </div>
                              <table class="syllable">
                                <tr v-for="(phone, index) in item.phones[0]" :key="index">
                                  <td class="first">{{ (index == 0) ? item.phones[0].syll : '' }}</td>
                                  <td>{{ '音素 [' + xfSyllPhone[phone.content] + ']' }}</td>
                                  <td>{{ phone.dp_message == '0' ? '朗读正常' : '未朗读' }}</td>
                                </tr>
                              </table>
                            </div>
                            <p class="grade-score-color">
                              <span class="score" :class="{'right': colorClass(item.total_score) == 'right', 'wrong': colorClass(item.total_score) == 'wrong'}"><em>{{Math.round(item.total_score)}}</em>分</span>
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
            <div class="bottom-prompt" v-if="!isShowEndPrompt">
              <p class="bottom-title blue">读的真棒！</p>
              <p>共有<em class="blue">5</em>个</p>
              <p>核心单词需要强化，快去学习一下吧～</p>
            </div>
            <!-- 70分以上 -->
            <div class="bottom-prompt" v-else>
              <p>小朋友，你已经完成绘本阅读啦，<br/>去核心单词继续强化一下吧～</p>
            </div>
          </div>
          <!-- 绘本单词学习完展示 -->
          <div class="content-box" v-if="isType == 'word'">
            <div class="user-avatar">
              <img :src="userInfo ? userInfo.photo : ''" alt="">
              <div class="right">
                <div class="right-left">
                  <p class="nikename" v-text="userInfo ? userInfo.nickname : ''"></p>
                  <div class="star">
                    <span v-for="(itemClass,index) in itemClasslass" :class="itemClass" class="star-item" :key="index"></span>
                  </div>
                </div>
                <a href="javascript:;" class="go-intensify" @click="listenSongs()">听首儿歌</a>
              </div>
            </div>
            <div class="coreWord-content">
              <div class="coreWord-slide">
                <!-- 母语的句子 -->
                <div class="title-sentence-box">
                  <p>本课核心单词得分</p>
                </div>
                <!-- 讯飞的识别列表音节 -->
                <ul>
                  <li>
                    <div class="li-item">
                      <div class="review-item">
                        <p class="core-word">
                          <span class="word">are</span>
                          <i class="icon-horn"></i>
                        </p>
                        <div class="syllable">
                          <p class="first">[miːt]</p>
                          <p class="syllable-list">
                            <span>音素 [ɑː] 朗读正常</span>
                            <span>音素 [eu] 朗读正常</span>
                          </p>
                        </div>
                      </div>
                      <p class="grade-color">
                        <span class="score"><em>30</em>分</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 70分以上 -->
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
      totalScore: [],
      coreWords: []
    }
  },
  created () {
    Bus.$on('showScoreDetail', (params) => {
      console.log('点击了评分详情', params)
      this.initData()
      this.parentList = params
      this.isShowEvaluatingModal = true
      if (this.$parent.type === 'draw') {
        let localXfResult = JSON.parse(localStorage.getItem('xfISEResult'))
        let data = []
        this.evaluatingData = []
        for (let i in localXfResult) {
          localXfResult[i]['formatContent'] = this.formatContent(localXfResult[i].content || localXfResult[i].words)
          data.push(localXfResult[i])
        }
        console.log(data)
        data.forEach(item => {
          this.totalScore.push(Math.round(item.total_score))
          if (Array.isArray(item.sentence)) {
            let w = []
            item.sentence.forEach((sentence, index) => {
              sentence.word.forEach(word => {
                word.phones = []
                if (word.total_score) {
                  // word.phones = word.phones.concat(this.syllMethods(word))
                  word.phones.push(this.syllMethods(word))
                  w.push(word)
                }
              })
            })
            item.words = w
            this.evaluatingData.push(item)
          } else {
            item.words = item.sentence.word
            item.sentence.word.forEach(word => {
              word.phones = []
              if (word.total_score) {
                // word.phones = word.phones.concat(this.syllMethods(word))
                word.phones.push(this.syllMethods(word))
              }
            })
            this.evaluatingData.push(item)
          }
        })
      }
      console.log(this.evaluatingData)
      // this.totalScore = this.evaluatingData[this.curSwiperPage].total_score
      console.log(this.totalScore)
      this.initSwiper()
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo, // 用户信息
      xfSyllPhone: state => state.xfSyllPhone // 因素的对应表
    }),
    // 是否vip
    isVip () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    },
    // 是绘本还是单词
    isType () {
      return this.$parent.type
    },
    chapterCode () {
      let code = this.$route.query.code
      return code
    },
    // 几颗星
    itemClasslass () { // 星星的数组
      let result = []
      // let fullstar = this.totalScore
      let fullstar = 0
      for (var t in this.totalScore) {
        fullstar += this.totalScore[t]
      }
      let total = fullstar / this.totalScore.length
      // 几颗全星
      console.log(fullstar, total)
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
    },
    // 课程编码
    courseCode () {
      let code = this.$route.query.code
      let arr = code.split('-')
      return arr.slice(0, 2).join('-')
    }
  },
  updated () {
    this.swiperStyle()
  },
  mounted () {
    console.log(this.isType)
    this.initWordData()
  },
  methods: {
    ...mapActions([
      'getKidCourseContent'
    ]),
    initData () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      console.log(xfISEResult)
      console.log(Object.entries(xfISEResult))
      let totalScore = 0
      let data = []
      Object.entries(xfISEResult).forEach(item => {
        let key = item[0]
        let sentence = {}
        sentence['key'] = key
        sentence['content'] = item[1].content
        sentence['formatContent'] = this.formatContent(item[1].content)
        sentence['total_score'] = item[1].total_score
        sentence['words'] = this.getWords(item[1].sentence)
        totalScore += parseFloat(item[1].total_score)
        data.push(sentence)
      })
      let averageScore = totalScore / 3
      console.log(data)
      console.log('average score', averageScore)
    },
    getWords (sentence) {
      let words = []
      if (Array.isArray(sentence)) {
        sentence.forEach(sentence => {
          sentence.word.forEach(word => {
            if (word.content !== 'sil' && word.content !== 'fil') {
              let w = {}
              w['content'] = word.content
              w['total_score'] = word.total_score
              w['is_core'] = false
              w['phones'] = this.getPhones(word.syll)
              w['sylls'] = this.getSylls(this.getPhones(word.syll))
              words.push(w)
            }
          })
        })
      } else {
        sentence.word.forEach(word => {
          if (word.content !== 'sil' && word.content !== 'fil') {
            let w = {}
            w['content'] = word.content
            w['total_score'] = word.total_score
            w['is_core'] = false
            w['phones'] = this.getPhones(word.syll)
            w['sylls'] = this.getSylls(this.getPhones(word.syll))
            words.push(w)
          }
        })
      }
      return words
    },
    // 获取所有的音素
    getPhones (syll) {
      let phones = []
      if (Array.isArray(syll)) {
        syll.forEach(item => {
          if (Array.isArray(item.phone)) {
            item.phone.forEach(p => {
              phones.push(p)
            })
          } else {
            phones.push(item.phone)
          }
        })
      } else {
        if (Array.isArray(syll.phone)) {
          syll.phone.forEach(item => {
            phones.push(item)
          })
        } else {
          phones.push(syll.phone)
        }
      }
      return phones
    },
    // 获取单词发音
    getSylls (phones) {
      let syll = '['
      phones.forEach(p => {
        syll += this.xfSyllPhone[p.content]
      })
      syll += ']'
      return syll
    },
    // 是绘本的时候单词列表
    initWordData () {
      this.getKidCourseContent({chapter_code: this.chapterCode}).then(res => {
        console.log(res)
        this.coreWords = res.teacherContent.words
      })
    },
    // 初始化swiper
    initSwiper () {
      /* eslint-disable */
      this.$nextTick(() => {
        var swiperScore = new Swiper('.swiper-evaluating', {
          loop: false,
          autoplay: false, //自动轮播
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
            slideChange: () => {
              console.log(swiperScore.activeIndex)
              this.iseResultSet(swiperScore.activeIndex)
            }
          }
        })
        new Swiper('.swiper-lists', {
          loop: false,
          autoplay: false, //自动轮播
          initialSlide: 0,
          centeredSlides:true,
          slidesPerView: 'auto',
          slideToClickedSlide: true,
          spaceBetween: 20,
          mousewheel: true,
          pagination: {
            el: '.swiper-pagination'
          }
        })
      })
      /* eslint-enable */
    },
    closeModal () {
      this.isShowEvaluatingModal = false
    },
    // 立即强化
    strengthening () {
      this.$router.push({path: '/app/kid-course-list/' + this.courseCode})
    },
    // 听儿歌
    listenSongs () {
      this.$router.push({path: '/app/kid-course-list/' + this.courseCode})
    },
    swiperStyle () {
      $('.swiper-pagination').find('.swiper-pagination-bullet').css({
        'width': '20px',
        'height': '5px',
        'border-radius': '6px',
        'margin-right': '8px'
      })
      $('.swiper-pagination').find('.swiper-pagination-bullet .swiper-pagination-bullet-active').css({
        'width': '20px',
        'height': '5px',
        'background': '#0581D1',
        'border-radius': '6px',
        'margin-right': '8px'
      })
    },
    // 格式化内容，添加span标签
    formatContent (content) {
      if (!content) {
        return ''
      }
      let result = ''
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
                result += '<span> ' + r[l].trim() + ' </span>' + tag
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
                result += '<span> ' + r[j].trim() + tag + ' </span>'
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
                result += '<span> ' + r[k].trim() + tag + ' </span>'
              }
            }
          } else {
            if (arr[i].trim() === '—') {
              result += arr[i].trim()
            } else {
              result += '<span> ' + arr[i].trim() + ' </span>'
            }
          }
        }
      }
      return result
    },
    // 判断是否是数组
    getDataType (points) {
      if (points.constructor === Array) {
        return true
      } else {
        return false
      }
    },
    colorClass (totalScore) {
      if (totalScore >= 80) {
        return 'right'
      } else if (totalScore < 60) {
        return 'wrong'
      }
    },
    // 提取因素
    syllMethods (word) {
      let phones = []
      if (Array.isArray(word.syll)) {
        word.syll.forEach(item => {
          if (Array.isArray(item.phone)) {
            item.phone.forEach(p => {
              phones.push(p)
            })
          } else {
            phones.push(item.phone)
          }
        })
      } else {
        if (Array.isArray(word.syll.phone)) {
          word.syll.phone.forEach(item => {
            phones.push(item)
          })
        } else {
          phones.push(word.syll.phone)
        }
      }
      phones.syll = '['
      phones.forEach(p => {
        phones.syll += this.xfSyllPhone[p.content]
      })
      phones.syll += ']'
      return phones
    },
    // 评测结果处理
    iseResultSet (page) {
      console.log(this.evaluatingData)
      console.log($('.swiper-slide-active').find('.sentence p span'))
      let id = this.chapterCode + '-' + this.parentList[page].code
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      console.log(xfISEResult[id])
      if (xfISEResult[id]) {
        let words = []
        if (Array.isArray(xfISEResult[id].sentence)) {
          xfISEResult[id].sentence.forEach(sentence => {
            sentence.word.forEach(word => {
              if (word.total_score) {
                words.push(word)
              }
            })
          })
        } else {
          words = xfISEResult[id].sentence.word.filter(item => {
            return item.total_score
          })
        }
        console.log(words)
        $('.swiper-slide-active .grade-color').find('.sentence span').removeClass('right')
        $('.swiper-slide-active .grade-color').find('.sentence span').removeClass('wrong')
        words.forEach((word, index) => {
          let score = parseFloat(word.total_score)
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
    width: 600px;
    min-height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius:8px;
    background: #fff;
    .close-img {
      position: absolute;
      top: -30px;
      right: -30px;
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
      .title {
        text-align: center;
        padding: 24px 0;
        background: #2CA0E5;
        border-radius:8px 8px 0px 0px;
        font-size:24px;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
      .vip {
        display: inline-block;
        cursor: pointer;
        width: 100%;
        height: 46px;
        background: #FFB94E;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        p {
          display: flex;
          align-items: center;
          font-size:18px;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:25px;
          i {
            display: inline-block;
            width: 23px;
            height: 20px;
            background: #2CA0E5;
            margin-right: 10px;
          }
        }
        .go-vip {
          display: inline-block;
          width: 8px;
          height: 14px;
          background: #2CA0E5;
          cursor: pointer;
        }
      }
      .lists {
        padding: 32px 32px 0px;
        .item {
          text-align: center;
          p {
            font-size:20px;
            font-weight:500;
            color:rgba(60,91,111,1);
            line-height:28px;
            padding-bottom: 24px;
            text-align: left;
          }
          i {
            display: inline-block;
            width: 240px;
            height: 120px;
            background: pink;
          }
        }
        .item {
          margin-bottom: 32px;
        }
      }
    }
    .evaluating {
      .content-box {
        min-height: 500px;
        .user-avatar {
          display: flex;
          width: 100%;
          padding: 22px 32px;
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
        // 显示句子的颜色
        .swiper-content,.coreWord-content {
          .swiper-container {
            width: 100%;
            height: 100%;
            padding-top: 28px;
            padding-bottom: 16px;
          }
          .swiper-slide, .coreWord-slide {
            max-height: 430px;
            overflow-y: auto;
            width: 83%;
            padding: 20px 26px;
            background: #fff;
            box-shadow:0px 0px 16px 0px rgba(0,0,0,0.14);
            border-radius:8px;
            // margin-right: 20px;
            .icon-horn {
              cursor: pointer;
              display: inline-block;
              width:16px;
              height:13px;
              background: url('../../../../../static/images/kid/icon-horn.png') no-repeat center;
              background-size: cover;
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
      }
    }
  }
}
.blue {
  color:#2ca0e5 !important;
}
.wrong {
  color: #FF3B30 !important;
}
.right {
  color: #1FBD3A !important;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.swiper-pagination {
  bottom: -15px;
}
</style>
