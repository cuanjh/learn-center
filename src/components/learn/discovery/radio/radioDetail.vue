<template>
  <div class="radio-wrap">
    <div class="radio-container">
      <nav-comp />
      <div class="radio-left">
        <div class="course">
          <div class="top-course">
            <img v-lazy="courseInfo.cover" :key="courseInfo.cover" alt="">
            <div class="course-right">
              <div class="module-name" v-text="courseInfo.module_name"></div>
              <div class="count">
                <span v-text="'共计 ' + courseInfo.cards_count + ' 课'"></span>
                <span v-text="'订阅 ' + courseInfo.buy_num + ' 次'"></span>
              </div>
            </div>
          </div>
          <!-- 价钱 -->
           <div class="member">
             <!-- 免费课程 -->
            <div class="money-nopay" v-if="courseInfo.money == 0">
              <span v-text="$t('free')"></span>
            </div>
            <!-- 花钱 -->
            <div class="money-pay" v-else>
              <!-- 会员不免费 -->
              <div class="money" v-if="courseInfo.free_for_member == 0 || courseInfo.free_for_member == false">
                <p class="cny" v-if="courseInfo.money_type == 'CNY'">
                  <span v-text="'￥' + courseInfo.money"></span>
                  <span>元/年</span>
                </p>
                <p class="coins" v-else>
                  <span v-text="courseInfo.money"></span> {{$t('coins')}}
                </p>
              </div>
              <!-- 会员免费 -->
              <div class="vip-free" v-else>
                <p class="cny" v-if="courseInfo.money_type == 'CNY'">
                  <span v-text="'￥' + courseInfo.money"></span>
                  <span>元/年</span>
                  <span>会员免费</span>
                </p>
                <p class="cny" v-else-if="courseInfo.money_type == 'USD'">
                  <span v-text="courseInfo.money*(3.03030303)"></span>
                  <span>元/年</span>
                  <span>会员免费</span>
                </p>
                <p class="coins" v-else>
                  <span v-text="courseInfo.money"></span> {{$t('coins')}}
                  <span>会员免费</span>
                </p>
              </div>
            </div>
          </div>
          <!-- 介绍 -->
          <div class="introduce">
            <div class="introduce-content">
              <span class="title">简介：</span>
              <div class="tags">
                <span v-for="tag in courseInfo.tags" :key="tag.tag_id" v-text="tag.tag_name[languagueHander]"></span>
              </div>
            </div>
            <div class="introduce-text">
              <span>{{courseInfo.description}}</span>
            </div>
          </div>
          <!-- 收听订阅分享等 -->
          <div class="subscription">
            <div class="bottom">
              <div class="gradient-layer-play" @click="loadRadioList($event, courseInfo)">
                <i class="play"></i>
                <span>立即收听</span>
              </div>
              <div class="subscibeno-play">
                <p class="have-course" v-if="subscibenoInfo.purchased_state == 4 || subscibenoInfo.purchased_state == 1">
                  <i class="subscibe"></i>
                  <span>已订阅</span>
                </p>
                <p class="have-no-course" v-else>
                  <i class="subscibeno"></i>
                  <span @click="subscibe()">订阅</span>
                </p>
              </div>
            </div>
            <div class="share" v-show="false">
              <div class="li weixin"></div>
              <div class="li weibo"></div>
              <div class="li friend"></div>
              <div class="li qq"></div>
            </div>
          </div>
        </div>
        <!-- 作者介绍 -->
        <div class="author-brief">
          <div class="title">
            作者简介:
          </div>
          <div class="author-info">
            <div @click="goToUser(authorInfo.user_id)" class="author-info-left">
              <img v-lazy="authorInfo.photo" :key="authorInfo.photo" alt="">
            </div>
            <div class="author-info-right">
              <div class="nickname">
                <a @click="goToUser(authorInfo.user_id)" v-text="authorInfo.nickname"></a>
              </div>
              <div class="passed">
                <div class="passed-user">
                  <span><i></i>认证用户</span>
                  <p v-show="false">
                    <span>英语外教</span>
                  </p>
                </div>
                <p class="flowed" @click="relation()">
                  <a v-if="authorInfo.has_followed === 0"><i></i>关注</a>
                  <a class="followed" v-else>已关注</a>
                </p>
              </div>
            </div>
          </div>
          <div class="author-text">
            <div class="desc" v-text="authorInfo.tech_desc ? authorInfo.tech_desc : '暂无数据'"></div>
          </div>
        </div>
        <vip-prompt class="vip-width"></vip-prompt>
        <!-- 课程列表 -->
        <div class="course-list">
          <div class="title">课程列表</div>
          <div class="course-item" v-for="card in cards" :key="card.card_id">
            <div class="course-play-img">
              <img v-lazy="card.cover_url" :key="card.cover_url" alt="">
              <div class="gradient-layer-play" @click="loadRadioList($event, courseInfo)">
                <i class="play"></i>
              </div>
            </div>
            <div class="course-item-right">
              <div class="course-title"><span class="audition" v-if="courseInfo.money != 0">试听</span><span>{{card.title}}</span></div>
              <div class="course-desc" v-text="card.description"></div>
              <div class="course-bottom">
                <p>
                  <span><i></i>{{toParseTime(card.sound_time)}}</span>
                  <span><i></i>{{card.comment_count}}</span>
                </p>
                <span>{{card.create_time | formatDate}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 评论 -->
        <div class="comments" v-if="comments">
          <div >
            <div class="title">{{comments.length}}条评论</div>
            <div v-if="comments">
              <div class="comment-item" v-for="(item, index) in comments" :key="'comment' + index">
                <div class="img">
                  <img v-lazy="item.user.photo" alt="">
                </div>
                <div class="img-right">
                  <div class="nickname" v-text="item.user.nickname"></div>
                  <div class="date">{{item.created_on | formatDate}}</div>
                  <div class="comment" v-text="item.comment"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="comment-item" v-show="false">
            <span>暂时没有评论~~~</span>
          </div>
        </div>
      </div>
      <!-- 右边的内容 -->
      <div class="radio-right">
        <radio-detail-other :otherRadios="otherRadios" v-if="otherRadios"></radio-detail-other>
        <students-listening :studentsListening="studentsListening"></students-listening>
      </div>
      <!-- <bounceBox @hidden="hiddenShow" v-show="isShowBox"></bounceBox> -->
      <!-- <buy-coins-radio-box @hidBuyCoinsBox="hiddenBuyCoinsBox"/> -->
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../../bus'
import $ from 'jquery'
import bounceBox from '../../../common/bounceBox'
import { formatDate } from '../../../../tool/date.js'
import VipPrompt from '../../../common/vipPrompt.vue'
import NavComp from '../../../common/nav.vue'
import RadioDetailOther from './radioDetailOther.vue'
import StudentsListening from './studentsListening.vue'
// import BuyCoinsRadioBox from '../../../common/buyCoinsRadioBox.vue'

export default {
  data () {
    return {
      isShowBox: false,
      radioDetail: {},
      courseInfo: {},
      authorInfo: {},
      cards: [],
      subscibenoInfo: {},
      comments: [],
      otherRadios: [],
      studentsListening: []
    }
  },
  components: {
    // BuyCoinsRadioBox,
    RadioDetailOther,
    VipPrompt,
    StudentsListening,
    bounceBox,
    NavComp
  },
  filters: {
    formatDate (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy.MM.dd')
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.name === 'radioDetail') {
      next()
      this.loadData()
    } else {
      next()
    }
  },
  mounted () {
    let navList = [
      {id: 1, path: '/app/index', text: '我的学习账户'},
      {id: 2, path: '/app/discovery/radio-home', text: '电台'},
      {id: 3, path: '/app/discovery/radio-list', text: '分类'},
      {id: 4, path: '', text: '电台详情'}
    ]
    Bus.$emit('loadNavData', navList)
    this.loadData()
    this.getOtherRecommends({current_radio_code: this.$route.params.code}).then(res => {
      console.log('其他人也在听', res)
      this.studentsListening = res.data
      console.log('其他人也在听', this.studentsListening)
    })
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
    radioCode () {
      return this.$route.params.code
    }
  },
  methods: {
    ...mapActions({
      postRadioDetail: 'course/postRadioDetail', // 电台详情
      postPurchaseCourse: 'course/postPurchaseCourse', // 金币订阅课程
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel', // 取消关注
      getOtherRecommends: 'getOtherRecommends' // 其他人也在听
    }),
    // 作者详情页面
    goToUser (userId) {
      this.$router.push({
        path: `/app/discovery/author-detail/${userId}`
      })
    },
    // 跳转vip
    toVip () {
      this.$router.push({
        path: '/app/user/vip'
      })
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
    // 关注
    relation () {
      if (!this.userInfo) {
        Bus.$emit('showGoLoginBox')
        return
      }
      let _this = this
      let followId = _this.authorInfo.user_id
      if (_this.authorInfo.has_followed === 1) { // 关注了
        console.log('关注了')
        _this.remRadioRelationCancel({following_id: followId}).then((data) => {
          console.log('取消关注', data)
          if (data.success === true) {
            // _this.text = '关注'
            _this.authorInfo.has_followed = 0
          }
        })
      } else if (_this.authorInfo.has_followed === 0) { // 没关注
        console.log('没关注')
        _this.getRadioRelationFollow({following_id: followId}).then((data) => {
          console.log('关注', data)
          if (data.success === true) {
            // _this.text = '取消关注'
            _this.authorInfo.has_followed = 1
          }
        })
      }
    },
    // 发请求获取radio的详情页面
    async loadData () {
      let _this = this
      console.log('电台详情的参数', _this.radioCode)
      await _this.postRadioDetail(_this.radioCode).then((res) => {
        console.log('电台详情返回', res)
        _this.radioDetail = res.result
        _this.courseInfo = res.result.course_info
        _this.authorInfo = res.result.course_info.author_info
        _this.cards = res.result.course_info.cards
        _this.comments = res.result.course_info.comments
        _this.otherRadios = res.result.realated_courses
        _this.subscibenoInfo = res.result.relation
      })
    },
    // 立即收听
    loadRadioList (e, radio) {
      if (this.isPlay && radio.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
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
          Bus.$emit('radioPlay')
        }
      }
      this.isPlay = !this.isPlay
    },
    // 点击订阅
    subscibe () {
      console.log('courseInfo', this.courseInfo)
      let radio = this.courseInfo
      console.log('组件中的radio', this.radioDetail)
      console.log('subscibenoInfo', this.subscibenoInfo)
      if (!this.userInfo) {
        Bus.$emit('showGoLoginBox')
        return
      }
      if (radio.money !== 0) { // 收费
        if (this.isVip !== 1) { // 不是会员
          if (this.subscibenoInfo.purchased_state !== 1) { // 没订阅
            if (radio.money_type === 'CNY') {
              // 人民币提示
              Bus.$emit('showBuyRadio', this.radioDetail)
            } else if (radio.money_type === 'coins') {
              // 金币提示
              Bus.$emit('showBuyCoinsRadio', radio)
              Bus.$emit('hiddenBuyCoinsBox', this.radioDetail)
            }
          }
        } else { // 是会员
          if (radio.free_for_member === 0 || radio.free_for_member === false) { // 会员不免费
            if (this.subscibenoInfo.purchased_state !== 1) { // 没订阅
              if (radio.money_type === 'CNY') {
                // 人民币提示
                Bus.$emit('showBuyRadio', this.radioDetail)
              } else if (radio.money_type === 'coins') {
                // 金币提示
                Bus.$emit('showBuyCoinsRadio', radio)
                Bus.$emit('hiddenBuyCoinsBox', this.radioDetail)
              }
            }
          } else {
            this.initSubscibe(radio)
          }
        }
      } else {
        this.initSubscibe(radio)
      }
    },
    // 初始化订阅的状态
    async initSubscibe (radio) {
      await this.postPurchaseCourse({code: radio.code}).then(res => {
        console.log('订阅课程返回', res)
        if (res.success) {
          // purchased_state状态值显示隐藏 0未购买 1已购买 隐藏 2购买已删除
          this.subscibenoInfo.purchased_state = 1
        }
      })
    }
  }
}
</script>

<style scope="less" scoped>
.vip-width {
  margin: 10px 0 !important;
  width: 100%;
  height: 60px !important;
}
.radio-wrap {
  /* background: #ecf4f7; */
  width: 100%;
  min-height: 1000px;
}

.radio-container {
  width: 1200px;
  margin: 0px auto 100px;
}

.radio-left {
  margin-top: 8px;
  width: 880px;
  height: auto;
  display: inline-block;
}

.radio-left .course {
  width: 100%;
  /* height: 330px; */
  background-color: #ffffff;
  border-radius: 3px;
  padding: 60px 40px 40px;
}
.radio-left .course .top-course {
  display: flex;
}

.radio-left .course .introduce {
  width: 100%;
}
.radio-left .course .introduce .introduce-content {
  width: 100%;
  display: flex;
  padding: 24px 0 10px;
}
.radio-left .course .introduce .introduce-content .tags {
  font-size:12px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(113,191,247,1);
}
.radio-left .course .introduce .introduce-content .tags span {
  padding: 0px 7px;
  border-radius:4px;
  border:1px solid #C8D4DB;
  margin-right: 10px;
}
.radio-left .course .introduce .introduce-content .title {
  font-size:14px;
  font-family:PingFang-SC-Regular;
  font-weight:400;
  color:rgba(136,136,136,1);
}
.radio-left .course .introduce .introduce-text {
  font-size:14px;
  font-family:PingFang-SC-Regular;
  font-weight:400;
  color:rgba(136,136,136,1);
  line-height: 22px;
  padding-bottom: 27px;
}

.radio-left .course img {
  width: 240px;
  height: 126px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}

.radio-left .course .course-right {
  width: 504px;
  height: 124px;
  /* display: flex; */
  flex-direction: column;
  justify-content: space-around;
}
.radio-left .course .module-name {
  color: #333333;
  word-break: break-all;
  font-size: 20px;
  line-height: 32px;
  margin-top: 8px;
  width: 200px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.radio-left .course .count {
  color: #999999;
  font-size: 14px;
  margin-top: 38px;
  width: 100%;
}

.radio-left .course .count span:first-child {
  margin-right: 25px;
}
/* 免费 */
 .member .money-nopay {
   margin-top: 30px;
 }
.member .money-nopay span {
  font-size:24px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(255,131,49,1);
  margin-right: 5px;
}
/* 收费 */
/* 会员免费 */
.member .money-pay .vip-free {
  margin-top: 30px;
}
.member .money-pay .vip-free .cny {
  display: flex;
    align-items: center;
}
.member .money-pay .vip-free .cny span {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.member .money-pay .vip-free .cny span:nth-child(1) {
  font-size:24px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(255,131,49,1);
  margin-right: 5px;
}
.member .money-pay .vip-free  .cny span:nth-child(3) {
  cursor: pointer;
  font-size:12px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(245,166,35,1);
  padding: 0 10px;
  border-radius:12px;
  border:1px solid;
  border-color:linear-gradient(270deg, rgba(250,217,97,1), rgba(247,107,28,1)) 1 1;
  text-align: center;
  margin: 0 10px;
}
.member .money-pay .vip-free .coins {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
  padding: 0 5px;
  display: flex;
  align-items: center;
}
.member .money-pay .vip-free  .coins span:nth-child(2) {
  cursor: pointer;
  font-size:12px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(245,166,35,1);
  padding: 0 10px;
  border-radius:12px;
  border:1px solid;
  border-color:linear-gradient(270deg, rgba(250,217,97,1), rgba(247,107,28,1)) 1 1;
  text-align: center;
  margin: 0 10px;
}
/* 会员不免费 */
.member .money-pay .money {
  margin-top: 30px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.member .money-pay .money .cny {
  display: flex;
  align-items: center;
}
.member .money-pay .money .cny span:nth-child(1) {
  font-size:24px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(255,131,49,1);
  margin-right: 5px;
}
.member .money-pay .money .coins {
  display: flex;
  align-items: center;
}
.member .money-pay .money .coins span {
  font-size:24px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(255,131,49,1);
  margin-right: 5px;
}

.course .subscription {
  margin-top: 27px;
  display: flex;
  justify-content: space-between;
}
.course .subscription .bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.course .subscription .bottom .gradient-layer-play {
  display: flex;
  align-items: center;
  font-size:15px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(255,255,255,1);
  background:linear-gradient(270deg,rgba(130,214,255,1) 0%,rgba(81,147,231,1) 100%);
  border-radius:21px;
  padding: 8px 24px;
  margin-right: 17px;
  cursor: pointer;
}

.course .subscription .bottom .gradient-layer-play i {
  width: 14px;
  height: 14px;
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
}
.course .subscription .bottom .gradient-layer-play i.play {
  background-image: url('../../../../../static/images/listenDetail.svg');
}
.course .subscription .bottom .gradient-layer-play i.pause {
  background-image: url('../../../../../static/images/listenDetailplay.svg');
}
.course .subscription .bottom .subscibeno-play p {
  display: flex;
  align-items: center;
  font-size:15px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(98,169,239,1);
  background:rgba(245,247,248,1);
  border-radius:21px;
  padding: 8px 24px;
}
.have-no-course {
  cursor: pointer;
}
.course .subscription .bottom .subscibeno-play i {
  width: 15px;
  height: 15px;
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
}
.course .subscription .bottom .subscibeno-play .subscibeno {
  background-image: url('../../../../../static/images/subscibeNo.svg');
}
.course .subscription .bottom .subscibeno-play .have-course span{
  color: #B2C0C9;
}
.course .subscription .bottom .subscibeno-play .subscibe {
  background-image: url('../../../../../static/images/subscibe.svg');
}

.course .subscription .share {
  display: flex;
}
.course .subscription .share .li {
  width: 26px;
  height: 26px;
  background: pink;
  cursor: pointer;
  margin-right: 11px;
}
.course .subscription .share .weixin {
  background: url('../../../../../static/images/discovery/radio-play.png') no-repeat center;
  background-size: cover;
}
.course .subscription .share .weibo {
  background: url('../../../../../static/images/discovery/radio-play.png') no-repeat center;
  background-size: cover;
}
.course .subscription .share .friend {
  background: url('../../../../../static/images/discovery/radio-play.png') no-repeat center;
  background-size: cover;
}
.course .subscription .share .qq {
  background: url('../../../../../static/images/discovery/radio-play.png') no-repeat center;
  background-size: cover;
}
.radio-left .apply-vip {
  width: 880px;
  height: 60px;
  line-height: 60px;
  background-color: #D63B3B;
  border-radius: 3px;
  margin-top: 20px;
  padding: 0 44px;
}
.radio-left .apply-vip span:first-child {
  color: #ffffff;
  font-size: 20px;
}
.radio-left .apply-vip span:first-child i {
  width: 26px;
  height: 20px;
  background-image: url('../../../../../static/images/discovery/radio-vip.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 19px;
  margin-right: 10px;
}
.radio-left .apply-vip span:last-child {
  cursor: pointer;
  width: 140px;
  height: 36px;
  color: #A92222;
  font-size: 14px;
  background-color: #ffffff;
  border-radius: 18px;
  line-height: 36px;
  text-align: center;
  float: right;
  margin-top: 12px;
}
.radio-left .author-brief {
  width: 880px;
  background-color: #ffffff;
  border-radius: 3px;
  padding: 30px 40px;
  margin-top: 10px;
}
.radio-left .author-brief .title {
  font-size:16px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:#333;
}
.author-brief .author-info {
  display: flex;
  padding-top: 16px;
}
.author-brief .author-info .author-info-left {
  cursor: pointer;
  display: inline-block;
  margin-right: 20px;
  height: 100%;
}
.author-brief .author-info .author-info-left img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}
.author-brief .author-info .author-info-right {
  width: 724px;
  height: 60px;
}
.author-info .author-info-right .nickname {
  font-size:16px;
  font-family:PingFang-SC-Bold;
  font-weight:bold;
  color:rgba(51,51,51,1);
}
.author-info .author-info-right .nickname p {
  display: inline-block;
  position: absolute;
  top: 16px;
  right: 0;
}
.author-info .author-info-right .nickname p span {
  cursor: pointer;
  background: #F7F7F7;
  color: #2A9FE4;
  font-size: 20px;
  padding: 0 12px;
  border-radius: 4px;
}
.author-info .author-info-right .nickname a:hover {
  color: #2A9FE4;
}
.author-info .author-info-right .passed {
  margin-top: 4px;
  line-height: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.author-info .author-info-right .passed .flowed:hover {
  cursor: pointer;
  border-color: #2A9FE4;
  color: #2A9FE4;
}
.author-info .author-info-right .passed .flowed:hover i {
  display: inline-block;
  width: 11px;
  height: 11px;
  background: url('../../../../../static/images/authorFllow.svg') no-repeat center;
  background-size: cover;
  margin-right: 3px;
}
.author-info .author-info-right .passed .flowed a {
  display: flex;
  align-items:center;
}
.author-info .author-info-right .passed .flowed a i{
  display: inline-block;
  width: 11px;
  height: 11px;
  background: url('../../../../../static/images/follow.svg') no-repeat center;
  background-size: cover;
  margin-right: 3px;
}
.author-info .author-info-right .passed .flowed .followed {
  color: #90A2AE;
}
.author-info .author-info-right .passed p {
  font-size:14px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(60,91,111,1);
  padding: 6px 20px;
  border-radius:19px;
  border:1px solid rgba(178,192,201,1);
}
.author-info .author-info-right .passed .passed-user {
  display: flex;
  align-items: center;
}

.author-info .author-info-right .passed .passed-user span {
  font-size: 14px;
  color: #999;
}

.author-info .author-info-right .passed .passed-user span i{
  width: 13px;
  height: 13px;
  background-image: url('../../../../../static/images/discovery/radio-passed.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
}
.author-info .author-info-right .passed .passed-user p {
  color:rgba(158,218,98,1);
  border-color:#9EDA62FF;
  margin-left: 38px;
  font-size:10px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(158,218,98,1);
  padding: 3px 8px;
  border-radius:11px;
}
.author-info .author-info-right .bottom span{
  cursor: pointer;
  float: right;
  color: #999999;
  font-size: 16px;
  line-height: 10px;
}
.author-info .author-info-right .bottom span i {
  width: 7px;
  height: 10px;
  background-image: url('../../../../../static/images/discovery/radio-more.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-left: 10px;
}
.author-text {
  margin-top: 24px;
}
.author-text .desc {
  font-size:14px;
  font-family:PingFang-SC-Regular;
  font-weight:400;
  color:rgba(136,136,136,1);
  line-height:22px;
}
.radio-left .course-list {
  width: 880px;
  height: auto;
  background-color: #ffffff;
  /* margin-top: 25px; */
  border-radius: 3px;
  padding: 30px 40px 44px;
}

.radio-left .course-list .title {
  font-size:16px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(68,68,68,1);
  padding-bottom: 15px;
  border-bottom: 1px solid #EAEAEA;
}

.radio-left .course-list .course-item {
  position: relative;
  display: flex;
  /* cursor: pointer; */
  /* height: 120px; */
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #EAEAEA;
}
.course-item .course-play-img {
  position: relative;
  width: 60px;
  height: 60px;
  margin-right: 20px;
}
.course-item .course-play-img .gradient-layer-play {
  width: 60px;
  height: 60px;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(18, 18, 18, .16);
  border-radius: 7px;
}
.course-item .course-play-img .gradient-layer-play i {
  display: inline-block;
  width: 31px;
  height: 31px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}
.course-item .course-play-img .gradient-layer-play i:hover {
  opacity: 0.6;
}
.course-item .course-play-img .gradient-layer-play .play {
  width: 24px;
  height: 24px;
  background-image: url('../../../../../static/images/discovery/noplay.svg');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
}
.course-item .course-play-img .gradient-layer-play .pause {
  width: 24px;
  height: 24px;
  background-image: url('../../../../../static/images/discovery/play.svg');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
}
.radio-left .course-list .course-item .course-item-right {
  width: 100%;
}
.radio-left .course-list .course-item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.radio-left .course-list .course-item img {
  /* float: left; */
  width: 60px;
  height: 60px;
  object-fit: cover;
  /* display: inline-block; */
  border-radius: 8px;
}

.radio-left .course-list .course-item .course-title {
  font-size:14px;
  font-family:PingFang-SC-Bold;
  font-weight:bold;
  color:rgba(51,51,51,1);
  /* width: 160px; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
}
.radio-left .course-list .course-item .course-title .audition {
  font-size:11px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:rgba(214,59,59,1);
  line-height:16px;
  padding: 1px 5px;
  border:1px solid rgba(214,59,59,1);
  border-radius: 5px;
  margin-right: 8px;
}
.radio-left .course-list .course-item .course-desc {
  width: 368px;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(184,184,184,1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 4px 0 15px;
}

.radio-left .course-list .course-item .course-bottom {
  position: relative;
  font-size:14px;
  font-family:Helvetica;
  color:#b8b8b8;
  display: flex;
  justify-content: space-between;
}
.radio-left .course-list .course-item .course-bottom p {
  display: inline-block;
}

.radio-left .course-list .course-item .course-bottom span:first-child i {
  width: 14px;
  height: 14px;
  line-height: 14px;
  background-image: url('../../../../../static/images/discovery/radio-clock.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
}
.radio-left .course-list .course-item .course-bottom p {
  display: flex;
}
.radio-left .course-list .course-item .course-bottom p span {
  display: flex;
  align-items: center;
}
.radio-left .course-list .course-item .course-bottom span:nth-child(2) {
  margin-left: 23px;
}

.radio-left .course-list .course-item .course-bottom span:nth-child(2) i {
  width: 16px;
  height: 13px;
  line-height: 14px;
  background-image: url('../../../../../static/images/discovery/radio-message.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
}

.radio-left .course-list .course-item .course-bottom p span i {
  margin-right: 10px;
}
.radio-left .comments {
  width: 100%;
  height: auto;
  background-color: #ffffff;
  margin-top: 25px;
  border-radius: 3px;
  padding: 30px 40px;
}

.radio-left .comments .title {
  font-size:18px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(51,51,51,1);
  padding-bottom: 20px;
  border-bottom: 1px solid #EAEAEA;
}

.radio-left .comments .comment-item {
  width: 100%;
  padding: 23px 0px 0;
  display: flex;
}
.radio-left .comments .comment-item  .img-right{
  width: 100%;
  padding-bottom: 23px;
  border-bottom: 1px solid #EAEAEA;
}
.radio-left .comments .comment-item:last-child .img-right{
  width: 100%;
  padding-bottom: 23px;
  border-bottom: 0px;
}
.radio-left .comments .comment-item:last-child {
  border-bottom: 0;
}

.radio-left .comments .comment-item img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 20px;
}

.radio-left .comments .comment-item .nickname {
  font-size:14px;
  font-family:Helvetica-Bold;
  font-weight:bold;
  color:rgba(51,51,51,1);
  width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.radio-left .comments .comment-item .date {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(216,216,216,1);
  padding: 6px 0 16px;
}

.radio-left .comments .comment-item .comment {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(51,51,51,1);
}

.radio-right {
  margin-top: 8px;
  width: 280px;
  height: auto;
  display: inline-block;
  margin-left: 20px;
  border-radius: 3px;
}
</style>
