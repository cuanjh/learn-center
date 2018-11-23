<template>
  <div class="left-side">
    <div class="lang-overview">
      <dl>
        <dt><img :src="courseBaseInfo.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')"></dt>
        <dd>
          <p v-text='courseBaseInfo.name'></p>
          <p>{{$t('course.finished')}}&nbsp;<span v-text="finishedChapter + '/' + chapterNum"></span>&nbsp;{{$t('course.classHour')}}</p>
          <p class="vip" v-if="isVip === 1"><span><i></i>{{ vipEndDate }}到期</span><router-link tag="span" :to="{path: '/app/user/vip'}">会员续费</router-link></p>
          <p class="no-vip" v-else><span><i></i>你还不是会员</span><router-link tag="span" :to="{path: '/app/user/vip'}">成为会员</router-link></p>
        </dd>
      </dl>
      <!-- <div class="finished-course">
        <p>{{$t('course.finished')}}</p>
        <p><span v-text="finishedChapter + '/' + chapterNum"></span>{{$t('course.classHour')}}</p>
      </div> -->
      <ul>
        <li class="course-test-level" @click="jumpToPage('/app/grade-level-show')">
          <p></p>
          <p>测评定级</p>
        </li>
        <li class="course-learn-test" @click="jumpToPage('/learn/testing')">
          <p></p>
          <p>学习环境测试</p>
        </li>
        <li class="course-learn-guide" @click="jumpToPage('/learn/user-guide')">
          <p></p>
          <p>学习指南</p>
        </li>
      </ul>
    </div>

    <!-- <ul class="level-test-guide">
      <li class="learn-test-guide learn-level" @click="jumpToPage('/app/grade-level-show')">
        <i></i>
        <span>测评定级</span>
      </li>
      <li class="learn-test-guide learn-test" @click="jumpToPage('/learn/testing')">
        <i></i>
        <span>学习环境测试</span>
      </li>
      <li class="learn-test-guide learn-guide" @click="jumpToPage('/learn/user-guide')">
        <i></i>
        <span>学习指南</span>
      </li>
    </ul> -->
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  name: 'leftSide',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      courseBaseInfo: state => state.course.courseBaseInfo,
      chapterNum: state => state.course.chapterNum + '',
      finishedChapter: state => state.course.finishedChapter + '',
      curLevel: state => state.course.curLevel,
      userInfo: state => state.user.userInfo
    }),
    langDesc () {
      let des = '全球说 《' + this.courseBaseInfo.name + '》'
      return des
    },
    vipEndDate () {
      if (!this.userInfo.member_info) {
        return
      }
      let endTime = this.userInfo.member_info.end_time * 1000
      return moment(endTime).format('YYYY.MM.DD')
    },
    isVip () {
      if (!this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    }
  },
  methods: {
    switchCourse () {
      this.$router.push({ path: '/app/book-case' })
    },
    jumpToPage (path) {
      this.$router.push({ path: path })
    }
  }
}
</script>

<style scoped>
  .left-side{
    width: 24%;
    max-width: 270px;
    border-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(218,230,243,0.30);
    display: inline-block;
    margin-top: 8px;
    position: fixed;
  }

  .lang-overview{
  }

  .lang-overview dl{
    padding: 30px 0px 0 20px;
    height: 170px;
    background-image: url('../../../../static/images/learn/learn-lang-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .lang-overview dt {
    float: left;
    margin-right: 15px;
  }

  .lang-overview dt img {
    display: inline-block;
    width: 62px;
    height: 62px;
    border: #ffffff solid 2px;
    border-radius: 4px;
    box-shadow: #3179A3 0 2px 7px;
    object-fit: cover;
  }

  .lang-overview dd {
    height: 100px;
    position: relative;
  }

  .lang-overview dd p {
    font-size: 16px;
    font-weight: bold;
    padding-right: 20px;
  }

  .lang-overview dd p:nth-of-type(1) {
    font-size: 19px;
    line-height:26px;
    font-weight: 600px;
    color: #ffffff;
    /* word-break: break-all; */
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }

  .lang-overview dd p:nth-of-type(2) {
    height:20px;
    font-size:14px;
    font-weight:500;
    color:#ffffff;
    line-height:20px;
    display: inline-block;
    margin-top: 15px
  }

  .lang-overview dd p:nth-of-type(3) {
    width: 100%;
    display: inline-block;
    margin-top: 30px;
  }

  .lang-overview dd .vip span:first-child i {
    width: 17px;
    height: 16px;
    line-height: 22px;
    background-image: url('../../../../static/images/course/course-vip-small.svg');
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    margin-top: 1px;
    margin-right: 6px;
  }

  .lang-overview dd .vip span:first-child {
    height:18px;
    font-size:12px;
    font-weight:500;
    color:#ffffff;
    line-height:22px;
    float: left;
  }

  .lang-overview dd p:nth-of-type(3) span:last-child {
    width:66px;
    height:22px;
    border-radius:11px;
    border:1px solid #ffbe29;
    font-size:12px;
    font-weight:600;
    color:#ffbe29;
    padding: 2px 8px;
    line-height:17px;
    float: right;
    cursor: pointer;
  }

  .lang-overview dd .no-vip span:first-child i {
    width: 17px;
    height: 16px;
    line-height: 22px;
    background-image: url('../../../../static/images/course/course-unvip-small.svg');
    background-size: cover;
    background-repeat: no-repeat;
    display: inline-block;
    margin-top: 1px;
    margin-right: 6px;
  }

  .lang-overview dd .no-vip span:first-child {
    height:18px;
    font-size:12px;
    font-weight:500;
    color:#ffffff;
    line-height:22px;
    float: left;
  }

  .lang-overview ul {
    width: 100%;
    background: #ffffff;
    padding: 0 50px;
    border-radius: 0 0 4px 4px;
  }

  .lang-overview ul li {
    border-bottom: 1px solid #f5f5f5;
    padding: 28px 0;
    cursor: pointer;
  }

  .lang-overview ul li:last-child {
    border-bottom: 0;
  }

  .lang-overview ul li p {
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    color: #333333;
    font-weight: 400px;
  }

  .lang-overview .course-test-level p:first-child {
    width: 32px;
    height: 42px;
    background-image: url('../../../../static/images/course/course-test-level.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .lang-overview .course-learn-test p:first-child {
    width: 32px;
    height: 42px;
    background-image: url('../../../../static/images/course/course-learn-test.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .lang-overview .course-learn-guide p:first-child {
    width: 32px;
    height: 42px;
    background-image: url('../../../../static/images/course/course-learn-guide.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }

  .finished-course {
    background-color: #fff;
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #444444;
    border-bottom: 1px solid #f5f5f5;
    box-shadow: #DAE6F3 0 1px 2px;
    border-radius: 0 0 3px 3px;
  }

  .finished-course > p {
    display: inline-block;
  }

  .finished-course > p:nth-of-type(1){
    float: left;
  }

  .finished-course > p:nth-of-type(2){
    float: right;
  }

  .finished-course > p:nth-of-type(2) span {
    margin-right: 10px;
    color: #CBCBCB;
    font-size: 17px;
    vertical-align: bottom;
  }

  .level-test-guide{
    background:#fff;
    border-radius: 3px 3px 4px 4px;
    margin-top:12px;
    box-shadow: #DAE6F3 0 1px 2px;
  }

  .level-test-guide li:hover::before {
    content: '';
    width: 4px;
    height: 44px;
    background-color: #3c9bbe;
    position: absolute;
    top: 4px;
    left: -20px;
  }

  .learn-test-guide{
    height:50px;
    font-size:14px;
    line-height:50px;
    margin-right:20px;
    margin-left:20px;
    background-image: url(../../../../static/images/learn/learn-user-arrow.svg);
    background-position: center right;
    background-repeat: no-repeat;
    cursor: pointer;
    color: #4a4a4a;
    position: relative;
    border-bottom: 1px solid #f5f5f5;
    padding-left: 25px;
  }

  .learn-guide{
    border-bottom: 0px solid #f5f5f5;
  }
  .learn-test-guide i{
    position: absolute;
    top: 15px;
    left: 0px;
    width: 18px;
    height: 20px;
    background-position: center center;
    background-size: contain;
  }
  .learn-test i{
    background: url(../../../../static/images/learn/study-test.svg) no-repeat;
  }
  .learn-guide i{
    background: url(../../../../static/images/learn/study-guide.svg) no-repeat;
  }
  .learn-level i{
    background: url(../../../../static/images/learn/cpdj.svg) no-repeat;
  }
</style>
