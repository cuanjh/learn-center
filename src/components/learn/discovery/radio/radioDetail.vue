<template>
  <div class="radio-wrap">
    <div class="radio-container">
      <div class="nav">
        <router-link :to="{path: '/app/user/course'}">
          <span>个人账户</span>
        </router-link>
        >
        <router-link :to="{path: '/app/discovery/radio-home'}">
          <span>电台</span>
        </router-link>
        >
        <router-link :to="{path: '/app/book-case'}">
          <span>分类</span>
        </router-link>
        >
        <div class="nav-current">
          课程详情
        </div>
      </div>
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
            <div class="money" v-if="courseInfo.money === 0">
              <span v-text="$t('free')"></span>
            </div>
            <div class="money" v-else-if="courseInfo.money_type === 'CNY'">
              <span v-text="'￥' + courseInfo.money"></span>
              <span>元/年</span>
              <span>会员免费</span>
            </div>
            <div class="money" v-else>
              <span v-text="courseInfo.money"></span> {{$t('coins')}}
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
              <span><i></i>立即收听</span>
              <span><i></i> 订阅</span>
                <!-- <span @click="showBox()">分享</span> -->
            </div>
            <div class="share">
              <div class="li weixin"></div>
              <div class="li weibo"></div>
              <div class="li friend"></div>
              <div class="li qq"></div>
            </div>
          </div>
        </div>
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
                <span v-text="authorInfo.nickname"></span>
              </div>
              <div class="passed">
                <p>
                  <span><i></i>认证用户</span>
                  <span>英语外教</span>
                </p>
                <p @click="relation()">
                  <span v-if="authorInfo.has_followed === 0">+关注</span>
                  <span v-else>取消关注</span>
                </p>
              </div>
            </div>
          </div>
          <div class="author-text">
            <div class="desc" v-text="authorInfo.tech_desc ? authorInfo.tech_desc : '暂无数据'"></div>
          </div>
        </div>
        <vip-prompt class="vip-width"></vip-prompt>
        <div class="course-list">
          <div class="title">课程列表</div>
          <div class="course-item" v-for="card in cards" :key="card.card_id">
            <img v-lazy="card.cover_url" :key="card.cover_url" alt="">
            <div class="course-title" v-text="card.title"></div>
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
        <div class="comments">
          <div v-if="comments">
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
          <div class="comment-item" v-else>
            <span>暂时没有评论~~~</span>
          </div>
        </div>
      </div>
      <div class="radio-right">
        <radio-detail-other :otherRadios="otherRadios"></radio-detail-other>
        <students-listening></students-listening>
      </div>
      <!-- <bounceBox @hidden="hiddenShow" v-show="isShowBox"></bounceBox> -->
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import bounceBox from '../../../common/bounceBox'
import { formatDate } from '../../../../tool/date.js'
import VipPrompt from '../../../common/vipPrompt.vue'
import RadioDetailOther from './radioDetailOther.vue'
import StudentsListening from './studentsListening.vue'

export default {
  data () {
    return {
      isShowBox: false,
      courseInfo: {},
      authorInfo: {},
      cards: [],
      comments: [],
      otherRadios: []
    }
  },
  components: {
    RadioDetailOther,
    VipPrompt,
    StudentsListening,
    bounceBox
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
    this.loadData()
  },
  computed: {
    ...mapState({
      languagueHander: state => state.course.languagueHander
    })
  },
  methods: {
    ...mapActions({
      postRadioDetail: 'course/postRadioDetail',
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel' // 取消关注
    }),
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
    // 发请求获取radio的详情页面
    async loadData () {
      let _this = this
      let code = _this.$route.params.code
      await _this.postRadioDetail(code).then((res) => {
        console.log('电台详情返回', res)
        _this.courseInfo = res.result.course_info
        _this.authorInfo = res.result.course_info.author_info
        _this.cards = res.result.course_info.cards
        _this.comments = res.result.course_info.comments
        _this.otherRadios = res.result.realated_courses
      })
    }
    // 分享弹框
    // showBox () {
    //   this.isShowBox = true
    // },
    // hiddenShow () {
    //   let that = this
    //   that.isShowBox = false
    // }
  }
}
</script>

<style scoped>
.vip-width {
  width: 100%;
}
.nav {
  margin: 20px 0;
  font-weight: bold;
  font-size: 16px;
}
.nav a {
  text-decoration:none;;
}
.nav a span {
  color: #999999;
}
.nav .nav-current {
  display: inline-block;
  color: #2A9FE4;
}
.radio-wrap {
  background: #ecf4f7;
  width: 100%;
  min-height: 1000px;
}

.radio-container {
  width: 1200px;
  margin: 25px auto 100px;
}

.radio-left {
  width: 880px;
  height: auto;
  display: inline-block;
}

.radio-left .course {
  width: 100%;
  /* height: 330px; */
  background-color: #ffffff;
  border-radius: 3px;
  padding: 42px 50px;
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
  padding: 2px 7px;
  border-radius:4px;
  border:1px solid rgba(200,212,219,1);
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
  width: 250px;
  height: 124px;
  object-fit: cover;
  border-radius: 3px;
  margin-right: 20px;
}

.radio-left .course .course-right {
  width: 504px;
  height: 124px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.radio-left .course .module-name {
  color: #333333;
  word-break: break-all;
  font-size: 24px;
  line-height: 32px;
  margin-top: 8px;
  width: 100%;
}

.radio-left .course .count {
  color: #999999;
  font-size: 16px;
  margin-top: 20px;
  width: 100%;
}

.radio-left .course .count span:first-child {
  margin-right: 20px;
}

.member .money {
  margin-top: 30px;
  font-size: 16px;
  color: #999999;
  display: flex;
  align-items: center;
}

.member .money span {
  font-size:24px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(255,131,49,1);
  margin-right: 5px;
}
.member .money span:nth-child(2) {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
  margin-right: 10px;
}

.member .money span:nth-child(3) {
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
}
.course .subscription {
  margin-top: 27px;
  display: flex;
  justify-content: space-between;
}

.course .subscription .bottom span:nth-child(1) {
  font-size:15px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(255,255,255,1);
  cursor: pointer;
  background:linear-gradient(270deg,rgba(130,214,255,1) 0%,rgba(81,147,231,1) 100%);
  border-radius:21px;
  padding: 8px 24px;
  margin-right: 17px;
}

.course .subscription .bottom span:nth-child(1) i {
  width: 14px;
  height: 14px;
  background-image: url('../../../../../static/images/discovery/radio-play.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
  margin-top: 7px;
}
.course .subscription .bottom span:nth-child(2) {
  cursor: pointer;
  font-size:15px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(98,169,239,1);
  background:rgba(245,247,248,1);
  border-radius:21px;
  padding: 8px 24px;
}
.course .subscription .bottom span:nth-child(2) i {
  width: 12px;
  height: 13px;
  background-image: url('../../../../../static/images/discovery/radio-play.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
  margin-top: 7px;
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
  padding: 40px 50px;
  margin-top: 10px;
}
.radio-left .author-brief .title {
  font-size:16px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(144,162,174,1);
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
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
}
.author-brief .author-info .author-info-right {
  width: 724px;
  height: 60px;
}
.author-info .author-info-right .nickname {
  font-size:20px;
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
.author-info .author-info-right .passed {
  margin-top: 10px;
  line-height: 15px;
  display: flex;
  justify-content: space-between;
}
.author-info .author-info-right .passed p:nth-child(1) span:nth-child(1) {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(172,172,172,1);
  margin-right: 30px;
}
.author-info .author-info-right .passed p:nth-child(1) span:nth-child(1) i{
  width: 13px;
  height: 13px;
  background-image: url('../../../../../static/images/discovery/radio-passed.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
}
.author-info .author-info-right .passed p:nth-child(1) span:nth-child(2) {
  font-size:10px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(158,218,98,1);
  padding: 5px 8px;
  border-radius:20px;
  border:1px solid rgba(158,218,98,1);
}
.author-info .author-info-right .passed p:nth-child(2) span {
  font-size:14px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(60,91,111,1);
  padding: 5px 20px;
  border-radius:19px;
  border:1px solid rgba(178,192,201,1);
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
  margin-top: 25px;
  border-radius: 3px;
  padding: 16px 40px 44px;
}

.radio-left .course-list .title {
  font-size:18px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(68,68,68,1);
  padding-bottom: 15px;
  border-bottom: 1px solid #EAEAEA;
}

.radio-left .course-list .course-item {
  cursor: pointer;
  height: 120px;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #EAEAEA;
}

.radio-left .course-list .course-item:last-child {
  border-bottom: 0;
}

.radio-left .course-list .course-item img {
  float: left;
  width: 80px;
  height: 80px;
  object-fit: cover;
  /* display: inline-block; */
  border-radius: 5px;
  margin-right: 20px;
}

.radio-left .course-list .course-item .course-title {
  font-size:16px;
  font-family:PingFang-SC-Bold;
  font-weight:bold;
  color:rgba(51,51,51,1);
}

.radio-left .course-list .course-item .course-desc {
  width: 70%;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(184,184,184,1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.radio-left .course-list .course-item .course-bottom {
  position: relative;
  margin-left: 100px;
  margin-top: 18px;
  font-size:14px;
  font-family:Helvetica;
  color:rgba(153,153,153,1);
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
  margin-top: 6px;
  margin-right: 5px;
}

.radio-left .course-list .course-item .course-bottom span:nth-child(2) {
  margin-left: 20px;
}

.radio-left .course-list .course-item .course-bottom span:nth-child(2) i {
  width: 16px;
  height: 14px;
  line-height: 14px;
  background-image: url('../../../../../static/images/discovery/radio-message.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 8px;
  margin-right: 5px;
}

.radio-left .course-list .course-item .course-bottom span:last-child {
  float:right;
}

.radio-left .comments {
  width: 100%;
  height: auto;
  background-color: #ffffff;
  margin-top: 25px;
  border-radius: 3px;
  padding: 29px 30px;
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
  padding: 23px 10px 0;
  display: flex;
}
.radio-left .comments .comment-item  .img-right{
  width: 100%;
  padding-bottom: 23px;
  border-bottom: 2px solid #EAEAEA;
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
}

.radio-left .comments .comment-item .date {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(216,216,216,1);
}

.radio-left .comments .comment-item .comment {
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(51,51,51,1);
}

.radio-right {
  width: 280px;
  height: auto;
  display: inline-block;
  margin-left: 20px;
  border-radius: 3px;
}
</style>
