<template>
  <div class="course-container">
    <div class="left-side" @mouseleave="navCourse = false">
      <div class="lang-overview">
        <dl>
          <dt><img :src="flag | urlFix('imageView2/0/w/200/h/200/format/jpg')"></dt>
          <dd>
            <div class="triangle">
              <span v-text='name'></span>
              <p>
                <i :class="{active:navCourse}" @mouseenter="navCourse = true"></i>
                <learn-course-list class="mycourse-wrap" :subscribeLangCourses="subscribeLangCourses"  v-show="navCourse"></learn-course-list>
              </p>
            </div>
            <p class="course-old"></p>
            <p class="vip" v-if="isVip === 1"><span><i></i>{{ vipEndDate }}到期</span><router-link :to="{path: '/app/vip-home'}" target="_blank">会员续费</router-link></p>
            <p class="no-vip" v-else><span><i></i>你还不是会员</span><router-link :to="{path: '/app/vip-home'}" target="_blank">成为会员</router-link></p>
          </dd>
        </dl>
        <ul>
          <li class="course-learn-test" @click="jumpToPage('/learn/testing')">
            <p></p>
            <p>学习环境测试</p>
          </li>
        </ul>
      </div>
      <router-view></router-view>
    </div>
    <div class='learn-course-nav'>
      <ul>
        <li v-for='level in catalogs' :key="level.code" :style="{'width': levelWidth}">
          <p class='learn-course-nav-blue'
              v-bind:class="{'learn-course-nav-active': curLevelCode === level.code}"
              v-on:click='selLevel(level)'>{{ level.levelNameDes[lang] }}</p>
        </li>
      </ul>
    </div>
    <div class="course-content">
      <div class="course-list">
        <div class="course-item"
          v-for="(item, index) in curLevelChapters"
          :key="'item' + index"
          :id="item.code">
          <div class="current-learn-course-info" v-show="curCharpterCode !== item.code">
            <div class="current-learn-course-flag">
              <img :src="item.flag">
              <div class="fix-ie-bg"></div>
            </div>
            <div class="current-learn-course-word-info">
              <div class="current-learn-course-title">
                <span>课程</span>
                <span>{{ index + 1 }}</span>
              </div>
              <div class="current-learn-course-describe">{{ item['des']['zh-cn'] }}</div>
            </div>
          </div>
          <transition name="expand" mode="out-in">
            <div class="course-item-detail" v-show="curCharpterCode == item.code">
              <div class="course-brief">
                <img :src="item.image_bg2" alt="">
                <div class="course-brief-shade">
                  <div class="course-brief-title">
                    <span>课程</span>
                    <span>{{ index + 1 }}</span>
                  </div>
                  <div class="course-brief-describe">{{ item['des']['zh-cn'] }}</div>
                  <div class="course-brief-shrink">
                    <i class="shrink" @click="switchShow()"></i>
                  </div>
                </div>
              </div>
              <div class="tab-container">
                <div class="tab-nav">
                  <ul>
                    <li
                      v-for="(name, index) in tabNav"
                      :key="index" :class="index == active ? 'active' : ''"
                      @click="changeTab(index)">
                      <span>{{name}}</span>
                      <div class="line"></div>
                    </li>
                  </ul>
                </div>
                <div class="tab-content">
                  <div class="tab-content-kid" v-show="!active">
                    <ul>
                      <li>
                        <div class="icon">
                          <i></i>
                        </div>
                        <div class="title">
                          <span @click="goKidStage(item, 'read')">绘本阅读</span>
                        </div>
                      </li>
                      <li>
                        <div class="icon"><i></i></div>
                        <div class="title"><span @click="goKidStage(item, 'word')">核心单词</span></div>
                      </li>
                      <li>
                        <div class="icon"><i></i></div>
                        <div class="title"><span>儿歌</span></div>
                      </li>
                    </ul>
                  </div>
                  <div class="tab-content-pro" v-show="active">
                    <div class="course-core">
                      <div class="course-core-name">
                        <span>核心课程</span>
                      </div>
                      <div class="course-item-box" v-for="i in 5" :key="i">
                        <a href="javascript:void(0)" @click="startCore('A0' + i, '')" :to="{ name: 'stage', params: {id: 'A0' + i}}">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A0' + i"></canvas>
                              <div :class="'core' + i"></div>
                              <i class="icon-course-lock"></i>
                            </div>
                            <p class="course-item-title">核心{{i}}</p>
                            <p class="course-item-star">
                              <span class="course-yellow-star"><i v-for="index in 5" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - 5)" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress">
                              <span></span>
                            </p>
                            <div class="continue-learn-core">
                              <span>继续学习</span>
                            </div>
                          </div>
                        </a>
                        <div class="course-circle-box" v-if="i<5">
                          <div class="course-core-circle" v-for="index in 3" :key="index"></div>
                        </div>
                      </div>
                    </div>
                    <div class="course-review">
                      <div class="course-review-name">
                        <span>测试</span>
                      </div>
                      <div class="course-item-box">
                        <a href="javascript:void(0);" @click="startTest()">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A7'"></canvas>
                              <div class="review-test"></div>
                              <i class="icon-review-lock"></i>
                            </div>
                            <p class="course-item-title">测试</p>
                              <p class="course-item-star">
                              <span class="course-yellow-star"><i v-for="index in 5" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - 5)" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress">
                              <span></span>
                            </p>
                            <div class="continue-learn-test">
                              <span>继续学习</span>
                            </div>
                          </div>
                        </a>
                        <div class="course-circle-box">
                          <div class="course-review-circle" v-for="index in 3" :key="index"></div>
                        </div>
                      </div>
                      <div class="course-item-box" style="margin-left: -4px;">
                        <a href="javascript:void(0)" @click="startHomework()">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A8'"></canvas>
                              <div class="review-homework"></div>
                              <i class="icon-review-lock"></i>
                            </div>
                            <p class="course-item-title">作业</p>
                            <p class="course-item-star">
                              <span class="course-yellow-star"><i v-for="index in 4" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - 4)" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress">
                              <span></span>
                            </p>
                            <div class="continue-learn-test">
                              <span>继续学习</span>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div class="course-vip">
                      <div class="course-vip-name">
                        <p>强化</p>
                        <p>(会员专享)</p>
                      </div>
                      <div class="course-item-box" v-for="(vipitem, i) in vipItemList" :key="i">
                        <a href="javascript:void(0);" @click="jumpVipPage(coreData['isCoreCompleted'], 'A' + (i + 1))">
                          <div class="current-course-item">
                            <div class="course-item-icon">
                              <canvas width="300" height="300" :id="item.code + '-canvas-A' + (i + 1)"></canvas>
                              <div :class="'vip'+ (i + 1)"></div>
                              <i class="icon-vip-lock"></i>
                            </div>
                            <div class="continue-learn-vip">
                              <span>继续学习</span>
                            </div>
                            <p class="course-item-title">{{ $t("courseItem.vip."+vipitem) }}</p>
                            <p class="course-item-star" v-if="true">
                              <span class="course-yellow-star"><i v-for="index in 5" :key="index"></i></span>
                              <span class="course-yellow-star courseIsLock"><i v-for="index in (5 - 5)" :key="index"></i></span>
                            </p>
                            <p class="course-item-progress" v-else>
                              <span></span>
                            </p>
                          </div>
                        </a>
                        <div class="course-circle-box" v-if="i<(vipItemList.length-1)">
                          <div class="course-vip-circle" v-for="index in 3" :key="index"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import Bus from '../../../bus'
import LearnCourseList from '../../common/learnCourseList.vue'

export default {
  name: 'leftSide',
  data () {
    return {
      trigangleShow: false,
      navCourse: false,
      flag: '',
      name: '',
      curLevelCode: '',
      curLevelChapters: [],
      curCharpterCode: '',
      catalogs: [],
      assetsServer: '',
      learnCourse: [],
      subscribeLangCourses: [],
      tabNav: ['学习', '拓展'],
      vipItemList: ['listen', 'oral', 'reading', 'writing', 'grammar', 'speaking'],
      active: 0
    }
  },
  components: {
    LearnCourseList
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    // 统计vip的时间
    vipEndDate () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return
      }
      let endTime = this.userInfo.member_info.end_time * 1000
      return moment(endTime).format('YYYY.MM.DD')
    },
    // 是否是vip
    isVip () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    },
    levelWidth () {
      let width = Math.floor(100 / parseInt(this.levelNum)) + '%'
      return width
    },
    lang () {
      return this.$i18n.locale
    }
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'getLearnInfoV5',
      'getKidCatalog',
      'getMoreLearnCourses',
      'getSubCourses' // 新的课程列表接口
    ]),
    ...mapMutations({
      updateCurCourseCode: 'course/updateCurCourseCode'
    }),
    async initData () {
      // 1. 当前学习的语言课程
      let res1 = await this.getUserInfo()
      console.log(res1)
      let curCourseCode = res1.info.current_course_code
      // 2.1 获取该课程的学习信息
      let res21 = await this.getLearnInfoV5({course_code: curCourseCode})
      console.log(res21)
      this.flag = res21.info.courseBaseInfo.flag
      this.name = res21.info.courseBaseInfo.name + ' KID'
      this.curCharpterCode = res21.info.learnConfig.current_chapter_code
      this.curLevelCode = this.curCharpterCode.split('-').slice(0, 3).join('-')

      // 2.2 获取kid目录结构
      let res22 = await this.getKidCatalog({course_code: curCourseCode})
      console.log(res22)
      this.assetsServer = res22.assets_server
      this.catalogs = res22.catalogInfo.catalogs
      let curLevel = this.catalogs.find(item => {
        return item.code === this.curLevelCode
      })
      this.curLevelChapters = curLevel.chapters
      console.log('curLevelChapters', this.curLevelChapters)
      // 3. 获取订阅课程
      let res3 = await this.getSubCourses()
      console.log('新的课程列表返回', res3)
      if (res3.success) {
        let learnCourses = res3.courses
        learnCourses.forEach(item => {
          if (item.course_type === 0 || item.course_type === 3) {
            this.subscribeLangCourses.push(item)
          }
        })
        this.subscribeLangCourses = this.subscribeLangCourses.reverse()
        console.log('订阅的官方课程', this.subscribeLangCourses)
      }
    },
    jumpToPage (path) {
      this.$router.push({ path: path })
    },
    // 点击订阅的课程跳转到点击的课程开始学习
    changeCourseCodes (courseCode) {
      localStorage.setItem('lastCourseCode', courseCode)
      this.updateCurCourseCode(courseCode)
      Bus.$emit('changeCourseCode', courseCode)
    },
    changeTab (index) {
      this.active = index
    },
    goKidStage (item, type) {
      let code = item.code
      this.$router.push({path: '/kid-stage', query: {code: code, type: type}})
    }
  }
}
</script>

<style lang="less" scoped>
.course-container {
  width: 980px;
  margin: 20px auto;
  padding-bottom: 40px;
}

.mycourse-wrap {
  top: 35px !important;
  left: -129px !important;
}

.left-side{
  width: 230px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(218,230,243,0.30);
  display: inline-block;
  margin-top: 8px;
  position: fixed;
  z-index: 9;
  .lang-overview dl{
    border-radius: 4px;
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
  }
  .lang-overview dd .triangle {
    width: 130px;
    display: inline-block;
  }
  .lang-overview dd .triangle span {
    display: inline-block;
    max-width: 90px;
    font-size: 19px;
    line-height:26px;
    font-weight: bold;
    color: #ffffff;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lang-overview dd .triangle p {
    position: relative;
    display: inline-block;
  }
  .lang-overview dd .triangle p img {
    position: absolute;
    top: 22px;
    left: 3px;
    width: 22px;
    height: 14px;
  }
  .fade-enter-active {
    transition: opacity .5s;
  }
  .fade-leave-active {
    transition: opacity .1s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .lang-overview dd .triangle p i {
    cursor: pointer;
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url('../../../../static/images/course/qh-default.svg') no-repeat center;
    block-size: cover;
    margin-top: 5px;
  }
  .lang-overview dd .triangle p i.active {
    display: inline-block;
    width: 17px;
    height: 17px;
    background: url('../../../../static/images/course/qh-click.svg') no-repeat center;
    block-size: cover;
    margin-top: 5px;
  }

  .lang-overview dd .course-old {
    height:20px;
    font-size:14px;
    font-weight:500;
    color:#ffffff;
    line-height:20px;
    display: inline-block;
    position: absolute;
    bottom: 38px;
    left: 77px;
  }
  .lang-overview dd .vip {
    position: absolute;
    bottom: -10px;
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
    margin-right: 16px;
  }

  .lang-overview dd .vip a {
    /* width:66px; */
    border-radius:20px;
    border:1px solid #ffbe29;
    font-size:12px;
    font-weight:600;
    color:#ffbe29;
    padding: 2px 8px;
    cursor: pointer;
  }
  .lang-overview dd .no-vip {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: -10px;
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
    /* height:18px; */
    font-size:12px;
    font-weight:500;
    color:#ffffff;
    line-height:22px;
    margin-right: 16px;
  }
  .lang-overview dd .no-vip a {
    /* width:66px; */
    border-radius:20px;
    border:1px solid #ffbe29;
    font-size:12px;
    font-weight:600;
    color:#ffbe29;
    padding: 2px 8px;
    cursor: pointer;
  }
  .lang-overview ul {
    width: 100%;
    background: #ffffff;
    padding: 0 15px;
    border-radius: 0 0 4px 4px;
    position: absolute;
  }

  .lang-overview ul li {
    border-bottom: 1px solid #f5f5f5;
    color: #333333;
    padding: 10px 0;
    cursor: pointer;
    margin: 20px 0;
    /* background-color: #90A2AE; */
  }

  .lang-overview ul li:hover {
    background-color: #F6F8F9;
    color: #2A9FE4;
  }

  .lang-overview ul li:last-child {
    border-bottom: 0;
  }

  .lang-overview ul li p {
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
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

  .learn-test i{
    background: url(../../../../static/images/learn/study-test.svg) no-repeat;
  }
}

.learn-course-nav {
  text-align: center;
  width: 800px;
  height: 60px;
  background-color: #f6f8f9;
  margin-top: -21px;
  margin-left: 245px;
  position: fixed;
  z-index: 9;
  ul {
    list-style: none;
    padding: 0px 0px !important;
    height: 60px;
    display: flex;
  }
  ul > li {
    float: left;
  }
  ul > li > p {
    display: inline-block;
    text-align: center;
    height: 60px;
    line-height: 75px;
    font-family: ".AppleSystemUIFont";
    font-size: 14px;
    font-weight:500;
    font-style: normal;
    font-stretch: normal;
    color: #555555;
    width: 70px;
    cursor: pointer;
  }
  ul > li > span {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    font-size: 80%;
    color: #dcdbdb;
  }
    .learn-course-nav-active {
    color: rgb(42,159,228) !important;
    border-bottom: 2px solid rgba(42,159,228,1);
  }

  .learn-course-nav-detail {
    color: rgb(42,159,228) !important;
  }
  .learn-course-nav-blue:hover {
    color: rgb(42,159,228) !important;
  }

  @media screen and (max-width: 1024px) {
    .learn-course-nav {
      width: 750px;
      margin-left: 242px;
    }
  }
}

.course-content {
  display: inline-block;
  margin-left: 248px;
  vertical-align: top;
}

.course-list {
  position: relative;
  width: 732px;
  margin-top: 50px;
  .course-item {
    background-color:#fff;
    margin-top: 14px;
    padding: 14px 14px 0 14px;
    border-radius: 5px;
    overflow: hidden;
  }
  .current-learn-course-info{
    margin-bottom: 14px;
    cursor: pointer;
    overflow:hidden;
  }
  .current-learn-course-flag{
    float:left;
    width:168px;
    height:80px;
    border-radius: 3px;
    overflow:hidden;
    position:relative;
    background-color: #F5F7F8;
  }
  .current-learn-course-flag img{
    height: 100%;
    width: 100%;
    line-height: auto;
    object-fit: cover;
  }
  .fix-ie-bg{
    width: 100%;
    height: 100%;
    background-color: #000;
    background-image: url('../../../../static/images/learn/learn-course-little-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
    opacity: 0.3;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .current-learn-course-word-info{
    float:left;
    margin-left:28px;
  }
  .current-learn-course-title{
    font-size: 16px;
    color: #404040;
    font-weight: 600;
    line-height: 24px;
  }
  .current-learn-course-describe{
    font-size:14px;
    color:#616161;
    line-height: 22px;
  }
  .course-item-detail {
  }
  .course-brief{
    position: relative;
    border-radius: 5px;
    height: 258px;
  }
  .course-brief img{
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
  .course-brief-shade{
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,0.40);
    border-radius: 5px;
    z-index: 2;
  }
  .course-brief-title{
    position: relative;
    font-size: 30px;
    color: #ffffff;
    line-height: 48px;
    font-weight: 500;
    padding-top: 54px;
    padding-left: 36px;
  }
  .course-brief-describe{
    position: relative;
    font-size: 18px;
    color: #ffffff;
    line-height: 24px;
    font-weight: 500;
    margin: 2px 0 0 36px;
  }
  .course-brief-shrink {
    position: absolute;
    margin-top: 30px;
    right: 12px;
    bottom: 12px;
  }

  .course-brief-shrink .shrink {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('../../../../static/images/course/course-shrink.svg');
    background-repeat: no-repeat;
    object-fit: cover;
    cursor: pointer;
  }

  .tab-container {
    padding: 50px 0;
  }

  .tab-nav {
    border-bottom: 1px solid rgba(233,234,235,.5);
    ul {
      padding: 0 100px;
      display: flex;
      flex-direction: row;
      li {
        width: 50%;
        text-align: center;
        position: relative;
        font-size: 16px;
        font-weight: 500;
        color: #9B9B9B;
        padding: 5px 0;
        cursor: pointer;
      }
      .active {
        color: #4A90E2;
        .line {
          position: absolute;
          width: 190px;
          height: 2px;
          background: #2A9FE4;
          border-radius: 1px;
          margin-left: 31px;
          margin-top: 5px;
        }
      }
    }
  }
  .tab-content {
    overflow: hidden;
    position: relative;
  }
  .tab-content-kid {
    ul {
      margin-top: 40px;
      padding-left: 18px;
    }
    ul li{
      display: flex;
      flex-direction: row;
      padding: 6px 0;
    }
    ul li .icon {
      margin-right: 14px;
    }
    ul li .icon i {
      display: inline-block;
      width: 64px;
      height: 64px;
      background-repeat: no-repeat;
      background-size: cover;
    }

    ul li:nth-child(1) .icon i{
      background-image: url('../../../../static/images/kid/icon-pic-book.png');
    }

    ul li:nth-child(2) .icon i{
      background-image: url('../../../../static/images/kid/icon-core-word.png');
    }

    ul li:nth-child(3) .icon i{
      background-image: url('../../../../static/images/kid/icon-child-music.png');
    }

    ul li .title {
      width: 100%;
      border-bottom: 1px solid rgba(230,235,238,.5);;
    }

    ul li .title span {
      display: inline-block;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      line-height: 18px;
      margin-top: 23px;
      cursor: pointer;
    }
  }

  .tab-content-pro {
    padding-top: 30px;
    .course-core{
      width: 100%;
      border-bottom: 1px solid rgba(233,234,235,0.50);
      padding: 15px 0 15px;
    }

    .course-core-name{
      font-size: 15px;
      font-weight: bold;
      color:#2a9fe4;
      display: inline-block;
      position: relative;
      margin-left: 6px;
      margin-top: 15px;
      margin-right: 19px;
      vertical-align: top;
    }

    .course-circle-box{
      display: none;
      position: relative;
      margin-top: 4px;
    }

    .course-core-circle {
      display: inline-block;
      margin: 54px 1px;
      border-radius: 50%;
    }

    .course-core-circle:after {
      content: '';
      margin: 3px;
      display: table;
      width: 4px;
      height: 4px;
      background: #0581d1;
      border-radius: 50%;
    }

    .course-core-circle-locked:after {
      background: #C7EAFF;
    }

    .course-item-box{
      display: inline-block;
      margin-right: 30px;
      width: 70px;
      height: 111px;
      text-align: center;
    }

    .current-course-item {
      position: relative;
      display: inline-block;
      text-align: center;
    }

    .course-item-star{
      display: inline-flex;
    }
    .course-item-star span{
      display: inline-block;
    }

    .course-item-progress {
      display: none;
      height: 18px;
      width: 75px;
      font-size: 12px;
      color: #4A4A4A;
      margin-bottom: 7px;
    }

    .course-item-icon{
      width: 56px;
      height: 56px;
      margin: 0 auto;
      /* position: absolute; */
    }
    .course-item-icon div{
      cursor: pointer;
      width: 56px;
      height: 56px;
      position: relative;
      border-radius: 50%;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .course-item-icon img[src=""]{
      opacity: 0;
    }

    .course-item-icon .core1{
      background-image: url('../../../../static/images/course/course-core1.svg');
    }

    .course-item-icon .core2{
      background-image: url('../../../../static/images/course/course-core2.svg');
    }

    .course-item-icon .core3{
      background-image: url('../../../../static/images/course/course-core3.svg');
    }

    .course-item-icon .core4{
      background-image: url('../../../../static/images/course/course-core4.svg');
    }

    .course-item-icon .core5{
      background-image: url('../../../../static/images/course/course-core5.svg');
    }

    .course-item-icon .review-test {
      background-image: url('../../../../static/images/course/course-review-test.svg')
    }

    .course-item-icon .review-homework {
      background-image: url('../../../../static/images/course/course-review-homework.svg')
    }

    .course-item-icon .vip1 {
      background-image: url('../../../../static/images/course/course-vip-listen.svg')
    }
    .course-item-icon .vip2 {
      background-image: url('../../../../static/images/course/course-vip-oral.svg')
    }
    .course-item-icon .vip3 {
      background-image: url('../../../../static/images/course/course-vip-reading.svg')
    }
    .course-item-icon .vip4 {
      background-image: url('../../../../static/images/course/course-vip-writing.svg')
    }
    .course-item-icon .vip5 {
      background-image: url('../../../../static/images/course/course-vip-grammar.svg')
    }
    .course-item-icon .vip6 {
      background-image: url('../../../../static/images/course/course-vip-speaking.svg')
    }

    .course-item-icon .core-canvas {
      width: 64px;
      height: 64px;
      position: absolute;
      z-index: -1;
    }

    .icon-course-lock {
      background-image: url('../../../../static/images/course/icon-course-lock.svg');
      background-repeat: no-repeat;
      background-size: cover;
      height: 25px;
      width: 25px;
      display: inline-block;
      margin-top: -21px;
      margin-left: 39px;
      position: relative;
    }

    .icon-review-lock {
      background-image: url('../../../../static/images/course/icon-review-lock.svg');
      background-repeat: no-repeat;
      background-size: cover;
      height: 25px;
      width: 25px;
      display: inline-block;
      margin-top: -21px;
      margin-left: 39px;
      position: relative;
    }

    .icon-vip-lock {
      background-image: url('../../../../static/images/course/icon-vip-lock.svg');
      background-repeat: no-repeat;
      background-size: cover;
      height: 25px;
      width: 25px;
      display: inline-block;
      margin-top: -21px;
      margin-left: 39px;
      position: relative;
    }
    .course-item-title{
      line-height: 30px;
      font-size: 14px;
      color: #444444;
      font-weight: bold;
    }

    .course-item-title-locked {
      color: #d8d8d8;
    }

    .course-yellow-star i{
      float:left;
      width:10px;
      height:10px;
      margin:0 2px;
      background:url(../../../../static/images/course/course-yellow-star.png) no-repeat;
      background-size:100% 100%;
    }

    .course-review{
      width: 100%;
      border-bottom: 1px solid rgba(233,234,235,0.50);
      padding: 15px 0 15px;
    }

    .course-review-name{
      width: 72px;
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      color: #7FB926;
      display: inline-block;
      position: relative;
      margin-right: 13px;
      margin-top: 15px;
      vertical-align: top;
    }

    .course-review-circle {
      display: inline-block;
      position: relative;
      margin: 54px 1px;
      border-radius: 50%;
    }

    .course-review-circle:after {
      content: '';
      margin: 3px;
      display: table;
      width: 4px;
      height: 4px;
      background: #7FB926;
      border-radius: 50%;
    }

    .course-review-circle-locked:after {
      background: #DCF0BC;
    }

    .course-vip{
      width: 100%;
      padding: 15px 0 15px;
    }

    .course-vip-name{
      font-size: 16px;
      font-weight: bold;
      color:#F5A623;
      text-align: center;
      display: inline-block;
      vertical-align: top;
      height: 80px;
      line-height: 20px;
      margin: 10px 12px 0 0;
    }

    .course-vip-name p{
      font-weight: bold;
    }

    .course-vip-circle {
      display: inline-block;
      margin: 54px 1px;
      border-radius: 50%;
    }

    .course-vip-circle:after {
      content: '';
      margin: 3px;
      display: table;
      width: 4px;
      height: 4px;
      background: #F5A623;
      border-radius: 50%;
    }

    .course-vip-circle-locked:after {
      background: #FFEDCD;
    }

    .nolock-test-check{
      position:fixed;
      width:100%;
      height:100%;
      top:0px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .4);
      z-index:99999999;
      overflow: hidden;
    }

    .nolock-test-check p{
      width:354px;
      height:250px;
      padding:80px 30px 0px;
      text-align:center;
      font-size:14px;
      color:#4a4a4a;
      word-wrap:break-word;
      word-break:normal;
      background-color:#fff;
      border-radius:4px;
      position:absolute;
      top:0px;
      left:0px;
      right:0px;
      bottom:0px;
      margin:auto;
    }

    .nolock-test-check p i{
      position:absolute;
      width:110px;
      height:110px;
      padding:26px;
      border-radius:55px;
      top:0px;
      left:50%;
      margin-left:-55px;
      margin-top:-55px;
      background:url(../../../../static/images/learn/learn-vip-warn.png) #fff center center no-repeat;
      background-size:86%;
    }

    .goBackCore {
      position: absolute;
      left: 50%;
      margin-left: -84px;
      bottom: 30px;
      width: 168px;
      height: 40px;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      border-radius: 20px;
      line-height: 40px;
      text-align: center;
      background-color: #2A9FE4;
    }

    canvas {
      width: 84px;
      height: 84px;
      position: absolute;
      display: block;
      margin-left: -11px;
      margin-top: -16px;
      z-index: 1;
    }

    .continue-learn-vip {
      display: none;
      width: 84px;
      height: 34px;
      background-image: url('../../../../static/images/course/continue-learn-vip.png');
      background-repeat: no-repeat;
      background-size: cover;
      position:absolute;
      left: 52px;
      top: 13px;
    }

    .continue-learn-vip span{
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }

    .continue-learn-test {
      display: none;
      width: 84px;
      height: 34px;
      background-image: url('../../../../static/images/course/continue-learn-test.png');
      background-repeat: no-repeat;
      background-size: cover;
      position:absolute;
      left: 52px;
      top: 13px;
    }

    .continue-learn-test span{
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }

    .continue-learn-core {
      display: none;
      width: 84px;
      height: 34px;
      background-image: url('../../../../static/images/course/continue-learn-core.png');
      background-repeat: no-repeat;
      background-size: cover;
      position:absolute;
      left: 52px;
      top: 13px;
    }

    .continue-learn-core span{
      color: #fff;
      font-size: 12px;
      font-weight: bold;
    }
  }
}

.expand-enter-active {
  animation: myfirst .3s;
}
.expand-leave-active {
  animation: myfirst .1s reverse;
}

@keyframes myfirst
{
  from {
    height: 0px;
  }
  to {
    height: 720px;
  }
}
</style>
