<template>
  <div class="card-wrap">
    <div class="card-container">
      <NavComp/>
      <!-- 上面电台部分 -->
      <div class="card-radio">
        <div class="card-content">
          <div class="radio-left">
            <div class="round-img">
              <div class="background-img">
                <img :src="cardDetail.cover_url" alt="">
              </div>
            </div>
            <div class="radio-play-box">
              <div class="radio-info">
                <p class="radio-name">{{cardDetail.title}}</p>
                <div class="author">
                  <span class="author-name">作者：{{authorInfo.nickname}}</span>
                  <p class="label">
                    <span v-for="tag in courseInfo.tags" :key="tag.tag_id">{{tag.tag_name[languagueHander]}}</span>
                  </p>
                </div>
              </div>
              <!-- 播放 -->
              <div class="radio-play" :id="cardDetail.card_id">
                <div class="gradient-layer-play" @click="loadRadioList($event, courseInfo)">
                  <i class="play"></i>
                </div>
                <div class="swiper-list">
                  <ul class="box">
                    <li>
                      <div class="lists">
                        <span>时长：{{toParseTime(cardDetail.sound_time)}}</span>
                      </div>
                    </li>
                    <li>
                      <div class="lists" v-if="cardDetail.comments">
                        <span>评论：{{cardDetail.comments.length>0?cardDetail.comments.length:'暂无评论'}}</span>
                      </div>
                    </li>
                    <li>
                      <div class="lists" v-if="cardDetail">
                        <span>更新：{{cardDetail.created_on | formatDate}}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <share-box :type="type"/>
        </div>
      </div>
      <!-- 下面内容面部分 -->
      <div class="card-radio-content">
        <div class="card-radio-box">
          <!-- 左边部分 -->
          <div class="card-content-left">
            <!-- 作者部分介绍 -->
            <div class="author-desc">
              <div class="desc-content">
                <div class="top">
                  <p class="title">简介</p>
                  <p :class="showUnfold ? 'desc' : 'desc-up'">{{cardDetail.description}}</p>
                </div>
                <div class="button" v-if="cardDetail.description !==''">
                  <a @click="unfold()" v-text="showUnfold?'查看全文':'收起'"></a>
                  <i :class="{'active':!showUnfold}"></i>
                </div>
              </div>
            </div>
            <!-- 评论 -->
            <div class="card-comment">
              <div class="comment-content">
                <div class="comment-top">
                  <span>{{commentLists.length}}条评论</span>
                </div>
                <div class="comment-card">
                  <div class="user-pic">
                    <img :src="userInfo ? userInfo.photo : './../../../static/images/learnIndex/user-photo.svg'" alt="当前用户头像">
                  </div>
                  <div class="text">
                    <!-- 说点什么吧... -->
                    <div class="impose-num">
                      <textarea id="comment-content"
                                class="input-comment"
                                @blur.prevent="blurFn()"
                                @focus.prevent="focusFn()"
                                :placeholder="placeholder"
                                maxlength="200"
                                @input="descInput"
                                v-model="desc"
                                autocomplete="off">
                      </textarea>
                      <p class="pay-service-textarea-text"><span>{{remnant}}</span>/200</p>
                    </div>
                    <div class="two-button">
                      <a class="face-pic" @click="showEmoji = !showEmoji">
                        <i :class="{'active':showEmoji}"></i>添加表情
                      </a>
                      <!-- :class="{disabled:desc == ''}" -->
                      <button class="release" v-bind:disabled="isGoRelease == ''" @click="commentCard()">
                        <span>发表评论</span>
                      </button>
                    </div>
                    <transition name="fade" mode="">
                      <div class="emoji-box" v-if="showEmoji" >
                        <ul class="emojiWrap">
                          <li v-for="(item,i) in emojiData" :key="i" v-html="item" @click="chooseEmoji(i, $event)" ></li>
                        </ul>
                      </div>
                    </transition>
                  </div>
                </div>
                <!-- 评论成功的弹框 -->
                <div class="success-box" v-show="showSuccessBox">
                  <div class="success-content">
                    <span>评论成功！</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 评论列表 -->
            <div class="card-comment-list">
              <div class="card-comment-content" v-if="commentLists.length > 0">
                <ul>
                  <li v-for="(item, index) in commentLists" :key="index">
                    <div class="card-item">
                      <img :src="item.user.photo" alt="">
                      <div class="left">
                        <a class="title">{{item.user.nickname}}</a>
                        <p class="time">{{item.created_on | formatDate}}</p>
                        <p class="content">{{item.comment}}</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="card-comment-content" v-else>
                <span>暂时没有评论~~~</span>
              </div>
              <div class="more-comments" v-if="commentLists.length > 0">
                <div class="button" v-if="loadMore">
                  <a class="more" @click="uploadMore()">更多评论</a>
                  <i></i>
                </div>
                <div class="button-no" v-else>
                  <span class="more">已显示全部内容</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 右边部分 -->
          <div class="card-content-right">
            <radio-card-star :authorDetail="authorDetail" :courseInfo="courseInfo" v-if="courseInfo"></radio-card-star>
            <radio-detail-other :otherRadios="otherRadios" v-if="otherRadios"></radio-detail-other>
            <students-listening :studentsListening="studentsListening" v-if="studentsListening"></students-listening>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../../bus.js'
import $ from 'jquery'
import cookie from '../../../../tool/cookie'
import { formatDate } from '../../../../tool/date.js'
import NavComp from '../../../common/nav.vue'
import ShareBox from '../../../common/shareBox'
import RadioCardStar from './radioCardStar.vue'
import RadioDetailOther from './radioDetailOther.vue'
import StudentsListening from './studentsListening.vue'

export default {
  data () {
    return {
      showSuccessBox: false,
      showUnfold: true,
      type: '2',
      cardDetail: {},
      radioDetail: {},
      courseInfo: {},
      authorInfo: {},
      otherRadios: [],
      authorDetail: {},
      subscibenoInfo: {},
      studentsListening: [],
      showEmoji: false, // 笑脸表情
      dataList: [], // 输入的内容评论列表
      emojiDataUTF: [],
      emojiData: [],
      remnant: 0,
      desc: '',
      placeholder: '说点什么…',
      loadMore: true,
      commentLists: [],
      lastComment: '',
      lastComm: '',
      pageSize: 10
    }
  },
  components: {
    NavComp,
    ShareBox,
    RadioCardStar,
    RadioDetailOther,
    StudentsListening
  },
  filters: {
    formatDate (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy.MM.dd')
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo, // 用户信息
      languagueHander: state => state.course.languagueHander
    }),
    isVip () {
      if (!this.userInfo) {
        return
      }
      if (!this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    },
    radioCardParams () {
      let routerParams = JSON.parse(sessionStorage.getItem('routerParams'))
      return routerParams
    },
    isGoRelease () {
      return this.desc
    }
  },
  mounted () {
    console.log('radioCardParams', this.radioCardParams)
    for (let key in this.$emoji.EMOJI_MAP) {
      this.emojiDataUTF.push(key) // 和后端交互时使用UTF码
      this.emojiData.push(this.$emoji.unifiedToHTML(key))
    }
    let navList = [
      {id: 1, path: '/app/index', text: '我的学习账户'},
      {id: 2, path: '/app/discovery/radio-home', text: '电台'},
      {id: 3, path: '/app/discovery/radio-list', text: '分类'},
      {id: 4, path: '', text: '课程详情'}
    ]
    Bus.$emit('loadNavData', navList)
    // this.initCardDetail()
    this.loadData()
    this.initCommentList(this.pageSize)
    this.getOtherRecommends({current_radio_code: this.radioCardParams.radioCode}).then(res => {
      this.studentsListening = res.data
    })
  },
  methods: {
    ...mapActions({
      postRadioDetail: 'course/postRadioDetail', // 电台详情
      getAuthorDetail: 'course/getAuthorDetail', // 作者的详情
      getRadioAuthorList: 'course/getRadioAuthorList', // 作者电台
      getRadioCardDetail: 'course/getRadioCardDetail', // 卡片详情
      getRadioCardCommentLists: 'course/getRadioCardCommentLists', // 卡片评论列表
      getRadioCommentCard: 'course/getRadioCommentCard', // 评论课程卡片
      getOtherRecommends: 'getOtherRecommends' // 其他人也在听
    }),
    // 发请求获取radio的详情页面
    async loadData () {
      let _this = this
      console.log('电台详情的参数', _this.radioCardParams.radioCode)
      await _this.postRadioDetail(_this.radioCardParams.radioCode).then((res) => {
        console.log('电台详情返回', res)
        if (res.success) {
          _this.radioDetail = res.result
          _this.courseInfo = res.result.course_info
          _this.authorInfo = res.result.course_info.author_info
          _this.otherRadios = res.result.realated_courses.slice(0, 1)
          _this.subscibenoInfo = res.result.relation
          _this.initAuthorInfo(res.result.course_info.author_info.user_id)
        }
      })

      // 卡片数据
      let params = {
        code: _this.radioCardParams.radioCode,
        card_id: _this.radioCardParams.id
      }
      await _this.getRadioCardDetail(params).then(res => {
        console.log('卡片返回', res)
        _this.cardDetail = res
        Bus.$emit('shareCardContent', _this.cardDetail)
      })
    },
    // 获取卡片评论列表
    async initCommentList (pageSize) {
      let params = {
        code: this.radioCardParams.radioCode,
        card_id: this.radioCardParams.id,
        start_time: 0,
        page_size: pageSize
      }
      await this.getRadioCardCommentLists(params).then(res => {
        console.log('评论列表返回', res)
        if (res.comment_lists.length < 10) {
          this.loadMore = false
        }
        this.commentLists = res.comment_lists
        this.lastComment = this.commentLists.length
        console.log('lastComment', this.lastComment)
        if (this.lastComm === this.lastComment) {
          this.loadMore = false
          return false
        }
      })
    },
    // 发表评论
    commentCard () {
      let userId = cookie.getCookie('user_id')
      if (!userId) {
        Bus.$emit('showGoLoginBox')
        this.desc = ''
        this.remnant = 0
        return false
      }
      let that = this
      let params = {
        code: that.radioCardParams.radioCode,
        card_id: that.radioCardParams.id,
        comment: that.desc
      }
      that.getRadioCommentCard(params).then(res => {
        console.log('res====>', res)
        if (res.success) {
          console.log('========>', that.commentLists)
          that.desc = ''
          that.remnant = 0
          that.showSuccessBox = true
          setTimeout(() => {
            that.showSuccessBox = false
            that.initCommentList(10)
          }, 1000)
        }
      })
    },
    // 作者详情
    initAuthorInfo (authorId) {
      this.getAuthorDetail({partner_user_id: authorId}).then(res => {
        console.log('作者返回', res)
        this.authorDetail = res.detail
      })
    },
    // 查看更多评论列表
    uploadMore () {
      this.pageSize = this.pageSize + 10
      this.initCommentList(this.pageSize)
      this.lastComm = this.commentLists.length
      console.log('lastComm', this.lastComm)
      console.log('lastComment', this.lastComment)
    },
    // 处理radio的时间
    toParseTime (data) {
      let m = parseInt(data / 60)
      if (m < 10) {
        m = '0' + m
      }
      let s = Math.round(data % 60)
      if (s < 10) {
        s = '0' + s
      }
      return m + ':' + s
    },
    // 收听列表
    loadRadioList (e, radio) {
      console.log('卡片详情==》', radio)
      let userId = cookie.getCookie('user_id')
      if (!userId && this.radioCardParams.order > 3) {
        Bus.$emit('showGoLoginBox')
        $('#' + this.cardDetail.card_id + ' .gradient-layer-play i').removeClass('pause')
        $('#' + this.cardDetail.card_id + ' .gradient-layer-play i').addClass('play')
        $('#' + radio.code + ' .gradient-layer-play i').removeClass('pause')
        $('#' + radio.code + ' .gradient-layer-play i').addClass('play')
        Bus.$emit('radioPause')
        return false
      }
      if (this.subscibenoInfo.purchased_state !== 1 && this.subscibenoInfo.purchased_state !== 4) { // 没订阅
        if (parseInt(radio.money) !== 0) { // 收费
          if (this.isVip !== 1) { // 不是会员
            if (this.radioCardParams.order > 3) {
              if (radio.money_type === 'CNY') {
                // 人民币提示
                Bus.$emit('showBuyMoneyBox', this.radioDetail)
              } else if (radio.money_type === 'coins') {
                // 金币提示
                Bus.$emit('showBuyCoinsRadio', radio)
                Bus.$emit('hiddenBuyCoinsBox', this.radioDetail)
              }
              return false
            }
          } else { // 是会员
            if (radio.free_for_member === 0 || radio.free_for_member === false) { // 会员不免费
              if (this.radioCardParams.order > 3) {
                if (radio.money_type === 'CNY') {
                  // 人民币提示
                  Bus.$emit('showBuyMoneyBox', this.radioDetail)
                } else if (radio.money_type === 'coins') {
                  // 金币提示
                  Bus.$emit('showBuyCoinsRadio', radio)
                  Bus.$emit('hiddenBuyCoinsBox', this.radioDetail)
                }
                return false
              }
            }
          }
        }
      }
      if (this.isPlay && radio.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target).addClass('play')
        Bus.$emit('radioPause')
      } else {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target).removeClass('play')
        $(e.target).addClass('pause')
        if (radio.code !== this.lastCode) {
          Bus.$emit('getRadioCardList', radio)
          this.lastCode = radio.code
        } else {
          Bus.$emit('radioPlayList', this.radioCardParams.order)
        }
      }
      this.isPlay = !this.isPlay
    },
    // 展开简介
    unfold () {
      this.showUnfold = !this.showUnfold
    },
    // 字数限制
    descInput () {
      let txtVal = this.desc.length // desc 是设置v-model的值
      this.remnant = txtVal
    },
    // 点击表情添加到input框
    chooseEmoji (index, e) {
      console.log('e', e)
      let text = e.target.innerHTML
      this.desc = this.desc + text
      this.showEmoji = !this.showEmoji
    },
    // 失去焦点
    blurFn () {
      setTimeout(() => {
        $('.input-comment').css('height', '50px')
      }, 300)
      if (this.desc === '') {
        this.placeholder = '说点什么吧...'
      }
    },
    // 获取焦点
    focusFn () {
      $('.input-comment').css('height', '72px')
      if (this.desc === '') {
        this.placeholder = ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.card-wrap {
  width: 100%;
  min-height: 1000px;
}
.card-container {
  width: 1180px;
  margin: 0px auto 100px;
}
.card-radio {
  width: 100%;
  margin-top: 12px;
  .card-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 22px 49px 21px 27px;
    width: 100%;
    height: 100%;
    background: url("../../../../../static/images/radiobg.png") no-repeat center;
    .radio-left {
      display: flex;
      align-items: center;
      .round-img {
        width: 141px;
        height: 141px;
        display: flex;
        justify-content: center;
        align-items: center;
        .background-img {
          width: 141px;
          height: 141px;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 13px solid #0a2b40ff;
            border-color:linear-gradient(270deg,#3023AE14 0%,#51B3EC54 100%);
            object-fit: cover;
          }
        }
      }
      .radio-play-box {
        padding-left: 22px;
        .radio-info {
          .radio-name {
            font-size:22px;
            font-family:PingFang-SC-Bold;
            font-weight:bold;
            color:rgba(10,43,64,1);
            line-height:30px;
            width: 450px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .author{
            padding-top: 8px;
            display: flex;
            align-items: center;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(126,146,159,1);
            line-height:20px;
            .author-name {
              display: inline-block;
              max-width: 160px;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
            }
            .label {
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(42,159,228,1);
              line-height:14px;
              padding-left: 22px;
              span {
                padding: 2px 7px;
                border-radius:4px;
                border:1px solid rgba(178,192,201,1);
                margin-right: 10px;
              }
            }
          }
        }
        // 播放
        .radio-play {
          width: 100%;
          padding-top: 26px;
          display: flex;
          align-items: center;
          .gradient-layer-play {
            cursor: pointer;
            text-align: center;
            z-index: 2;
            padding-right: 14px;
            i {
              display: inline-block;
              width: 36px;
              height: 36px;
              background-repeat: no-repeat;
              background-size: cover;
            }
            .play {
              background-image: url("../../../../../static/images/tuijianradio.svg");
            }
            .pause {
              background-image: url("../../../../../static/images/tuijianradioplay.svg");
            }
          }
          .swiper-list {
            line-height: 36px;
            width: 372px;
            overflow: hidden;
            ul {
              display: flex;
              width: 372px;
              height: 36px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              li {
                padding-right: 22px;
                .lists {
                  display: inline-block;
                  span {
                    font-size: 14px;
                    color: #3c5b6fff;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.card-radio-content {
  width: 100%;
  margin-top: 10px;
  .card-radio-box {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .card-content-left {
      width: 880px;
      margin-right: 20px;
      .author-desc {
        width: 100%;
        background: #fff;
        .desc-content {
          width: 100%;
          .top {
            padding: 22px 40px 16px;
            .title {
              font-size:16px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(51,51,51,1);
              line-height:22px;
              padding: 0 8px 10px;
              border-bottom: 1px solid #EAEAEAFF;
            }
            .desc {
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(60,91,111,1);
              line-height:20px;
              padding-top: 8px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .desc-up {
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(60,91,111,1);
              line-height:20px;
              padding-top: 8px;
            }
          }
          .button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 42px;
            background:rgba(222,222,222,.1);
            text-align: center;
            a {
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(5,129,209,1);
              line-height:42px;
              &:hover {
                color: #2A9FE4;
              }
            }
            i {
              display: inline-block;
              width: 10px;
              height: 6px;
              margin-left: 6px;
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
              background-image: url('../../../../../static/images/upAll.svg');
            }
            .active {
              background-image: url('../../../../../static/images/upAllActive.svg');
            }
          }
        }
      }
      // 评论
      .card-comment {
        width: 100%;
        margin-top: 12px;
        .comment-content {
          position: relative;
          width: 100%;
          background: #fff;
          padding: 26px 40px 22px;
          .comment-top {
            padding: 0 8px 18px;
            border-bottom: 1px solid #DEDEDEFF;
            font-size:22px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:30px;
          }
          .comment-card {
            width: 100%;
            padding-top: 34px;
            display: flex;
            justify-content: space-between;
            .user-pic {
              width: 46px;
              height: 46px;
              img {
                width: 46px;
                height: 46px;
                border-radius: 50%;
                object-fit: cover;
              }
            }
            .text {
              position: relative;
              width: 727px;
              .impose-num {
                position: relative;
              }
              .input-comment {
                width: 100%;
                min-height: 50px;
                padding: 3px;
                outline: 0;
                font-size: 12px;
                line-height: 24px;
                padding: 10px 70px 0px 20px;
                word-wrap: break-word;
                overflow-x: hidden;
                border-radius:6px;
                border:1px solid rgba(200,212,219,1);
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#333;
                line-height:20px;
              }
              .pay-service-textarea-text {
                position: absolute;
                right: 0;
                top: 15px;
                right: 20px;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(144,162,174,1);
              }
              .two-button {
                display: flex;
                justify-content: space-between;
                padding-top: 22px;
              }
              .face-pic {
                display: inline-block;
                font-size:13px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(144,162,174,1);
                -webkit-user-select:none;
                -moz-user-select:none;
                -ms-user-select:none;
                user-select:none;
                i {
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: url('../../../../../static/images/discovery/face.svg') no-repeat center;
                  background-size: cover;
                  margin-right: 8px;
                  &.active {
                    background: url('../../../../../static/images/discovery/face-hover.svg') no-repeat center;
                    background-size: cover;
                  }
                }
                &:hover {
                  i {
                    background: url('../../../../../static/images/discovery/face-hover.svg') no-repeat center;
                    background-size: cover;
                  }
                }
              }
              .release {
                display: inline-block;
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(255,255,255,1);
                padding: 7px 22px;
                background:rgba(200,212,219,1);
                border-radius:30px;
                background: #0581D1;
                &:hover {
                  background: #2A9FE4FF;
                }
              }
              .release:disabled {
                cursor: not-allowed;
                background:rgba(200,212,219,1);
              }
              // 表情
              .emoji-box {
                position: absolute;
                z-index: 10;
                left: 10px;
                width: 400px;
                height: 200px;
                // top: 290px;
                box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
                background: white;
                ul {
                  width: 400px;
                  height: 200px;
                  overflow: auto;
                  padding: 10px;
                  li {
                    width: 30px;
                    cursor: pointer;
                    display: inline-block;
                    margin: 2px;
                  }
                }
              }
            }
          }
          .success-box {
            position: absolute;
            top: 35%;
            left: 30%;
            display: inline-block;
            background:rgba(0,0,0,0.5);
            box-shadow:0px 4px 12px 0px rgba(5,43,52,0.3);
            border-radius:5px;
            .success-content {
              width: 100%;
              height: 100%;
              padding: 18px 126px;
              span {
                font-size:18px;
                font-family:PingFang-SC-Bold;
                font-weight:bold;
                color:rgba(255,255,255,1);
                line-height:25px;
              }
            }
          }
        }
      }
      // 评论列表
      .card-comment-list {
        width: 100%;
        background: #fff;
        margin-top: 10px;
        .card-comment-content {
          padding: 42px 31px 38px 40px;
          ul {
            li {
              padding-top: 20px;
              .card-item {
                display: flex;
                img {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  margin-right: 10px;
                  object-fit: cover;
                }
                .left {
                  width: 100%;
                  padding-bottom: 24px;
                  border-bottom: 1px solid #EEF2F3FF;
                  .title {
                    display: inline-block;
                    max-width: 160px;
                    font-size:14px;
                    font-family:Helvetica-Bold;
                    font-weight:bold;
                    color:rgba(51,51,51,1);
                    line-height:16px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &:hover {
                      color: #2A9FE4;
                    }
                  }
                  .time {
                    font-size:13px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(184,184,184,1);
                    line-height:16px;
                    padding-bottom: 10px;
                  }
                  .content {
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    line-height:20px;
                  }
                }
              }
            }
            li:last-child {
              .left {
                border-bottom: 0px;
              }
            }
          }
        }
        // 加载更多
        .more-comments {
          width: 100%;
          .button {
            width: 100%;
            background:rgba(222,222,222,.1);
            display: flex;
            align-items: center;
            justify-content: center;
            .more {
              display: inline-block;
              font-size:14px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:#0581D1FF;
              line-height:20px;
              padding: 12px 0;
              margin-right: 6px;
              &:hover{
                color: #2A9FE4;
              }
            }
            i {
              display: inline-block;
              width: 10px;
              height: 8px;
              background-repeat: no-repeat;
              background-size: cover;
              background-position: center;
              background-image: url('../../../../../static/images/upAll.svg');
            }
          }
          .button-no {
            width: 100%;
            background:rgba(222,222,222,.1);
            text-align: center;
            font-size:14px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:#90a2ae;
            line-height:20px;
            padding: 12px 0;
            margin-right: 6px;
          }
        }
      }
    }
    // 右边
    .card-content-right {
      width: 280px;
    }
  }
}
</style>
