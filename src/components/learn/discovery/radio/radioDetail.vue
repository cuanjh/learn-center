<template>
  <div class="radio-wrap">
    <div class="radio-container">
      <div class="radio-left">
        <div class="course">
          <img :src="courseInfo.cover" alt="">
          <div class="tags">
            <span v-for="tag in courseInfo.tags" :key="tag.tag_id" v-text="tag.tag_name[languagueHander]"></span>
          </div>
          <div class="course-right">
            <div class="module-name" v-text="courseInfo.module_name"></div>
            <div class="count">
              <span v-text="'共计 ' + courseInfo.cards_count + ' 课'"></span>
              <span v-text="'订阅 ' + courseInfo.buy_num + ' 次'"></span>
            </div>
            <div class="member">
              <div class="money" v-if="courseInfo.money === 0">
                <span v-text="$t('free')"></span>
              </div>
              <div class="money" v-else-if="courseInfo.money_type === 'CNY'">
                <span v-text="'￥' + courseInfo.money"></span> 元/年
                <span>会员免费</span>
              </div>
              <div class="money" v-else>
                <span v-text="courseInfo.money"></span> {{$t('coins')}}
              </div>
            </div>
            <div class="bottom">
              <span><i></i>立即收听</span>
              <div class="button-group">
                <span>订阅</span>
                <span>分享</span>
              </div>
            </div>
          </div>
        </div>
        <div class="apply-vip">
          <span><i></i>开通全球说会员，立享免费课程</span>
          <span>成为VIP会员</span>
        </div>
        <div class="author-brief">
          <div class="title">
            作者简介
          </div>
          <div class="author-info">
            <div class="author-info-left">
              <img :src="authorInfo.photo" alt="">
            </div>
            <div class="author-info-right">
              <div class="nickname" v-text="authorInfo.nickname"></div>
              <div class="passed">
                <span><i></i>认证用户</span>
                <span>英语外教</span>
              </div>
              <div class="line"></div>
              <div class="desc" v-text="authorInfo.tech_desc ? authorInfo.tech_desc : '暂无数据'"></div>
              <div class="bottom">
                <span>详情<i></i></span>
              </div>
            </div>
          </div>
        </div>
        <div class="course-list">
          <div class="title">课程列表</div>
          <div class="course-item" v-for="card in cards" :key="card.card_id">
            <img :src="card.cover_url" alt="">
            <div class="course-title" v-text="card.title"></div>
            <div class="course-desc" v-text="card.description"></div>
            <div class="course-bottom">
              <span v-text="toParseTime(card.sound_time)"></span>
              <span v-text="card.comment_count"></span>
              <span>{{card.create_time | formatDate}}</span>
            </div>
          </div>
        </div>
        <div class="comments">
          <div class="title">学生评论</div>
          <div class="comment-item" v-for="(item, index) in comments" :key="'comment' + index">
            <img :src="item.user.photo" alt="">
            <div class="nickname" v-text="item.user.nickname"></div>
            <div class="date">{{item.created_on | formatDate}}</div>
            <div class="comment" v-text="item.comment"></div>
          </div>
        </div>
      </div>
      <div class="radio-right">
        <div class="other-radio"><span></span>其他电台<span></span></div>
        <div class="other-radio-item" v-for="(radio, index) in otherRadios" :key="'other-radio' + index">
          <img :src="radio.cover" alt="">
          <div class="subscribe">
            <i></i>
            <span v-text="radio.buy_num"></span>
          </div>
          <div class="title" v-text="radio.module_name"></div>
          <div class="author" v-text="radio.author_info.nickname"></div>
          <div class="money" v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { formatDate } from '../../../../tool/date.js'

export default {
  data () {
    return {
      courseInfo: {},
      authorInfo: {},
      cards: [],
      comments: [],
      otherRadios: []
    }
  },
  filters: {
    formatDate (time) {
      let date = new Date(time * 1000)
      return formatDate(date, 'yyyy.MM.dd')
    }
  },
  mounted () {
    let code = this.$route.params.code
    this.postRadioDetail(code).then((res) => {
      console.log(res)
      this.courseInfo = res.result.course_info
      this.authorInfo = res.result.course_info.author_info
      this.cards = res.result.course_info.cards
      this.comments = res.result.course_info.comments
      this.otherRadios = res.result.realated_courses
    })
  },
  computed: {
    ...mapState({
      languagueHander: state => state.course.languagueHander
    })
  },
  methods: {
    ...mapActions({
      postRadioDetail: 'course/postRadioDetail'
    }),
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
    }
  }
}
</script>

<style scoped>
.radio-wrap {
  background: #ecf4f7;
  width: 100%;
  min-height: 1000px;
}

.radio-container {
  width: 1200px;
  margin: 20px auto 100px;
}

.radio-left {
  width: 880px;
  height: auto;
  display: inline-block;
}

.radio-left .course {
  width: 100%;
  height: 330px;
  background-color: #ffffff;
  border-radius: 3px;
  padding: 40px;
}

.radio-left .course img {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 3px;
  margin-right: 40px;
}

.radio-left .course .tags {
  position: absolute;
  margin-top: -40px;
  margin-left: 20px;
}

.radio-left .course .tags span {
  color: #ffffff;
  font-size: 12px;
  padding: 1px 5px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  margin-right: 10px;
}

.radio-left .course .course-right {
  display: inline-block;
  width: 504px;
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

.course-right .member .money {
  margin-top: 35px;
  font-size: 16px;
  color: #999999;
}

.member .money span {
  font-size: 40px;
  color: #FF8331;
  display: inline-block;
  margin-top: -6px;
  margin-right: 10px;
}

.member .money span:nth-child(2) {
  background-color: #9EDA62;
  width: 80px;
  height: 24px;
  border-radius: 12px;
  margin-left: 20px;
  color: #ffffff;
  font-size: 14px;
  text-align: center;
}

.course-right .bottom {
  margin-top: 30px;
}

.course-right .bottom span {
  color: #333333;
  font-size: 18px;
  line-height: 45px;
  cursor: pointer;
}

.course-right .bottom span i {
  width: 45px;
  height: 45px;
  background-image: url('../../../../../static/images/discovery/radio-play.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 12px;
}

.course-right .bottom .button-group {
  float: right;
  line-height: 45px;
  margin-left: 185px;
}
.course-right .bottom .button-group span {
  width: 81px;
  height: 30px;
  line-height: 30px;
  color: #2A9FE4;
  font-size: 15px;
  border: 1px solid #CDCDCD;
  border-radius: 5px;
  display: inline-block;
  text-align: center;
  margin-left: 10px;
  vertical-align: middle;
  cursor: pointer;
}

.radio-left .apply-vip {
  width: 880px;
  height: 60px;
  line-height: 60px;
  background-color: #2A9FE4;
  border-radius: 3px;
  margin-top: 20px;
  padding: 0 45px;
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
  width: 140px;
  height: 30px;
  color: #2A9FE4;
  font-size: 14px;
  background-color: #ffffff;
  border-radius: 18px;
  line-height: 30px;
  text-align: center;
  float: right;
  margin-top: 16px;
}

.radio-left .author-brief {
  width: 880px;
  height: 308px;
  background-color: #ffffff;
  border-radius: 3px;
  margin-top: 20px;
  padding: 0 35px;
}

.radio-left .author-brief .title {
  color: #444444;
  font-size: 24px;
  padding: 15px 0;
  border-bottom: 1px solid #EAEAEA;
}

.author-brief .author-info .author-info-left {
  display: inline-block;
  margin-right: 20px;
  height: 100%;
}
.author-brief .author-info .author-info-left img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  margin-top: 20px;
}

.author-brief .author-info .author-info-right {
  display: inline-block;
  width: 724px;
  height: 100%;
}

.author-info .author-info-right .nickname {
  margin-top: 30px;
  color: #333333;
  font-size: 20px;
}
.author-info .author-info-right .passed {
  margin-top: 10px;
  line-height: 15px;
}
.author-info .author-info-right .passed span:first-child {
  font-size: 14px;
  color: #ACACAC;
}

.author-info .author-info-right .passed span:first-child i{
  width: 13px;
  height: 13px;
  background-image: url('../../../../../static/images/discovery/radio-passed.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-right: 10px;
}

.author-info .author-info-right .passed span:last-child {
  width: 56px;
  height: 20px;
  border-radius: 10px;
  border: 0.5px solid #9EDA62;
  color: #9EDA62;
  font-size: 10px;
  padding: 1px 6px;
  margin-left: 25px;
}

.author-info .author-info-right .line {
  width: 100%;
  height: 1px;
  background-color: #EAEAEA;
  border-radius: 3px;
  margin-top: 20px;
}

.author-info .author-info-right .desc {
  color: #333333;
  font-size: 16px;
  height: 100px;
  padding: 15px 0;
}

.author-info .author-info-right .bottom span{
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

.radio-left .course-list {
  width: 880px;
  height: auto;
  background-color: #ffffff;
  margin-top: 25px;
  border-radius: 3px;
  padding: 15px 35px;
}

.radio-left .course-list .title {
  color: #444444;
  font-size: 24px;
  padding-bottom: 15px;
  border-bottom: 1px solid #EAEAEA;
}

.radio-left .course-list .course-item {
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
  color: #333333;
  font-size: 16px;
}

.radio-left .course-list .course-item .course-desc {
  color: #B8B8B8;
  font-size: 14px;
}

.radio-left .course-list .course-item .course-bottom {
  position: relative;
  margin-left: 100px;
  margin-top: 35px;
  font-size: 14px;
  color: #999999;
}

.radio-left .course-list .course-item .course-bottom span:first-child::before {
  content: '';
  width: 14px;
  height: 14px;
  line-height: 14px;
  background-image: url('../../../../../static/images/discovery/radio-clock.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 5px;
  margin-right: 5px;
}

.radio-left .course-list .course-item .course-bottom span:nth-child(2) {
  margin-left: 20px;
}

.radio-left .course-list .course-item .course-bottom span:nth-child(2)::before {
  content: '';
  width: 16px;
  height: 14px;
  line-height: 14px;
  background-image: url('../../../../../static/images/discovery/radio-message.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 5px;
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
  padding: 15px 35px;
}

.radio-left .comments .title {
  color: #444444;
  font-size: 24px;
  padding-bottom: 15px;
  border-bottom: 1px solid #EAEAEA;
}

.radio-left .comments .comment-item {
  height: 120px;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #EAEAEA;
}

.radio-left .comments .comment-item:last-child {
  border-bottom: 0;
}

.radio-left .comments .comment-item img {
  float: left;
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 20px;
}

.radio-left .comments .comment-item .nickname {
  color: #333333;
  font-size: 14px;
  font-weight: bold;
}

.radio-left .comments .comment-item .date {
  color: #d8d8d8;
  font-size: 14px;
}

.radio-left .comments .comment-item .comment {
  color: #333333;
  font-size: 14px;
  margin-left: 60px;
  margin-top: 10px;
}

.radio-right {
  width: 280px;
  height: auto;
  background-color: #ffffff;
  padding: 35px 20px;
  display: inline-block;
  margin-left: 20px;
  border-radius: 3px;
}

.radio-right .other-radio {
  color: #333333;
  font-size: 16px;
  line-height: 2px;
  text-align: center;
}

.radio-right .other-radio span {
  width: 24px;
  height: 2px;
  background-color: #F2F2F2;
  display: inline-block;
  margin: 0 10px;
}

.radio-right .other-radio-item {
  width: 100%;
  height: 241px;
  margin-top: 20px;
  border-bottom: 1px dotted #8E8E8E;
}

.radio-right .other-radio-item img {
  width: 100%;
  height: 128px;
  object-fit: cover;
  border-radius: 3px;
}

.other-radio-item .subscribe {
  position: relative;
  display: -webkit-box;
  margin-top: -25px;
}

.other-radio-item .subscribe i {
  display: inline-block;
  margin: 0 8px;
  width: 14px;
  height: 14px;
  background-image: url('../../../../../static/images/discovery/home-radio.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.other-radio-item .subscribe span {
  color: #ffffff;
  font-size: 12px;
  display: inline-block;
  margin-top: -5px;
  margin-left: -3px;
}

.other-radio-item .title {
  color: #444444;
  font-size: 16px;
  margin-top: 15px;
  height: 41px;
  line-height: 20px;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-left: 10px;
  margin-right: 10px;
}

.other-radio-item .author {
  color: #999999;
  font-size: 12px;
  display: inline-block;
  position: relative;
  margin-top: 10px;
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 10px;
}

.other-radio-item .money {
  color: #999999;
  font-size: 12px;
  float: right;
  /* display: inline-block; */
  position: relative;
  margin-top: 10px;
  margin-right: 10px;
}

</style>
