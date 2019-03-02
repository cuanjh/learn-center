<template>
  <div class="book-details">
    <div class="nav">
      <router-link :to="{path: '/app/index'}">我的学习账户
      </router-link>
      >
      <router-link :to="{path: '/app/book-case'}">添加课程
      </router-link>
      >
      <div class="nav-current">
        课程详情
      </div>
    </div>
    <div class="details-header">
      <div class="details-header-content">
        <div class="details-header-left">
          <div class="left-content">
            <div class="left-top">
              <div class="details-img">
                <img :src="(courseInfo.flag ? courseInfo.flag : '/static/images/bookCase/img_default_maige.png') | urlFix('imageView2/0/format/jpg')" alt="课程详情的图片">
              </div>
              <div class="details-case">
                <!-- <p>全球说</p> -->
                <p>
                  <!-- <span>麦格</span>
                  <span></span> -->
                  <span>{{ courseInfo.name }}课程</span>
                </p>
              </div>
            </div>
            <div class="left-bottom">
              <div class="left-bottom-content">
                <ul>
                  <li>
                    <div class="item">
                      <i class="language"></i>
                      <span>语言大使</span>
                      <span class="fl" v-text="(courseInfo.lang_ambassadors && courseInfo.lang_ambassadors.length > 0) ? courseInfo.lang_ambassadors.join('、') : '招募中'"></span>
                    </div>
                  </li>
                  <li>
                    <div class="item">
                      <i class="case"></i>
                      <span>课程</span>
                      <span class="fl">{{ courseInfo.lesson_num }}课时</span>
                    </div>
                  </li>
                  <li>
                    <div class="item">
                      <i class="homeWork"></i>
                      <span>作业</span>
                      <span class="fl">{{ courseInfo.homework_num}}份</span>
                    </div>
                  </li>
                  <li>
                    <div class="item">
                      <i class="price"></i>
                      <span>价格</span>
                      <span class="fl">{{ courseInfo.price }}金币/课</span>
                    </div>
                    <div class="buy-button" v-show="false">
                      <span>购买</span>
                    </div>
                    <a v-if="subscribeCourses.indexOf(courseCode) > -1 && courseInfo.has_course" @click="startLearn()" href="javascript:void(0)" class="button">
                      <span>开始学习</span>
                    </a>
                    <a v-else-if="subscribeCourses.indexOf(courseCode) === -1 && courseInfo.has_course" @click="subscribeCourse()" href="javascript:void(0)" class="button">
                      <span>订阅课程</span>
                    </a>
                    <a v-else href="javascript:void(0)" class="button locked">
                      <span>课程建设中</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="details-header-right">
          <div class="right-content">
            <div class="audio-play">
              <img src="https://mobile-static.talkmate.com/resource/2017-01-16/jiaoxuefa.png" alt>
              <p class="text" @click="playRadio()">
                <span>全球说母语教学法</span>
              </p>
            </div>
            <div class="add-btn">
              <div class="img-cont">
                <div class="img"></div>
                <span>扫一扫下载全球说App</span>
              </div>
            </div>
            <div class="flicking" v-show="false">
              <p><span>扫一扫下载全球说App</span></p>
              <div class="third-party">
                <div class="weixin">
                  <i></i>
                  <!-- <div class="weixin-img"></div> -->
                </div>
                <div class="weibo">
                  <i></i>
                  <!-- <div class="weibo-img"></div> -->
                </div>
                <div class="friend">
                  <i></i>
                  <!-- <div class="friend-img"></div> -->
                </div>
                <div class="qq">
                  <i></i>
                  <!-- <div class="qq-img"></div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="details-under">
      <div class="under-content">
        <!-- 切换tab -->
        <div class="tab-item">
          <div class="tab-box">
            <div class="item" @click="tabChange('info')" v-bind:class="{'active': 'info' == tabFlag}">
              <i class="info"></i>
              <span>信息</span>
            </div>
            <div class="item" @click="tabChange('resource')" v-bind:class="{'active': 'resource' == tabFlag}">
              <i class="resource"></i>
              <span>资源</span>
            </div>
            <div class="item" @click="tabChange('nation')" v-bind:class="{'active': 'nation' == tabFlag}">
              <i class="nation"></i>
              <span>国家</span>
            </div>
          </div>
        </div>
        <!-- 切换内容区 -->
        <div class="tab-content-box">
          <div class="tab-content">
            <!-- 信息 -->
            <div class="info-list" v-if="'info' == tabFlag">
              <book-case-info :langInfoObj="langInfoObj"></book-case-info>
              <div class="up-all">
                <span>已展示全部内容</span>
              </div>
            </div>
            <!-- 资源 -->
            <div class="resource-list" v-if="'resource' == tabFlag">
              <div v-if="resourceInfoRadios.length>0">
                <book-case-radios :resourceInfoRadios="resourceInfoRadios" v-if="resourceInfoRadios"></book-case-radios>
                <div class="up-all">
                  <span v-if="showMorePage == -1">已显示全部内容</span>
                  <span @click="loadMoreRadio()" v-else>全部展开<i></i></span>
                </div>
              </div>
              <div class="up-all" v-else>
                <p class="course-related">
                  <i></i>
                  <span >暂时没有课程相关资源</span>
                </p>
              </div>
            </div>
            <!-- 国家 -->
            <div class="nation-list" v-if="'nation' == tabFlag">
              <book-case-country :countryLists="countryLists" :courseCode="courseCode"></book-case-country>
              <div class="up-all" v-if="countryLists.length>0">
                <div class="up-all-content" v-if="allCountryLists.length>9">
                  <span @click="loadMoreNation()" v-text="showMoreCountry?'全部展开':'收起'"></span>
                  <i v-show="showMoreCountry"></i>
                  <i class="active" v-show="showMoreCountry === false"></i>
                </div>
                <div v-else>
                  <span>已经是全部内容了</span>
                </div>
              </div>
              <div class="up-all" v-else>
                <span >暂时没有课程相关国家</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 登录 -->
        <login-box v-show="goLogin"></login-box>
        <!-- vip提示 -->
        <vip-prompt></vip-prompt>
      </div>
    </div>
    <div class="video-box" v-show="showRadioPlay">
      <div class="video-dialog">
        <!-- txy.mp4 -->
        <video id="my-video" controls="controls">
          <source src="/i/movie.ogg" type="video/ogg" />
          <source src="//mobile-static.talkmate.com/resource/2017-04-05/jiaoxuefa-zh.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
    <!-- <voice-player/> -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus'
import $ from 'jquery'
import VipPrompt from '../../../components/common/vipPrompt.vue'
import LoginBox from '../../../components/common/loginBox.vue'
import BookCaseInfo from './bookCaseInfo.vue'
import BookCaseRadios from './bookCaseRadios.vue'
import BookCaseCountry from './bookCaseCountry.vue'
import Cookie from '../../../tool/cookie'
// import VoicePlayer from '../../common/voicePlayer.vue'

export default {
  data () {
    return {
      showRadioPlay: false,
      goLogin: true, // 登录的提示
      showMorePage: 0,
      showMoreCountry: true,
      tabFlag: 'info', // true 语言信息 false 资源 电台
      defaultImg: 'this.src="/static/images/bookCase/default_course.png"',
      // params: {}
      langInfoObj: { // 目前只显示这几项 info为空代表后端没有这个信息
        'AlternateNames': {
          title: '别称',
          info: ''
        },
        'ISO_639_3': {
          title: 'ISO 639-3',
          info: ''
        },
        'Population': {
          title: '使用人口',
          info: ''
        },
        'Location': {
          title: '使用地区',
          info: ''
        },
        'Dialects': {
          title: '方言',
          info: ''
        },
        'LanguageUse': {
          title: '使用范围',
          info: ''
        },
        'LanguageDevelopment': {
          title: '语言发展情况',
          info: ''
        },
        'LanguageResources': {
          title: 'OLAC资源',
          info: ''
        }
      },
      courseInfo: {}, // 语言的详情
      resourceInfoRadios: [], // 资源电台
      allCountryLists: [], // 接收后端的所有数据
      countryLists: [], // 页面刚加载的时候只显示9条数据
      pageindex: 1 // 当前页
    }
  },
  components: {
    VipPrompt,
    LoginBox,
    BookCaseInfo,
    BookCaseRadios,
    BookCaseCountry
    // VoicePlayer
  },
  created () {
  },
  mounted () {
    console.log('courseCode', this.courseCode)
    this.initDataDetails()
    let userId = Cookie.getCookie('user_id')
    console.log('userId', userId)
    if (!userId) {
      this.goLogin = true
    } else {
      this.goLogin = false
    }
    document.addEventListener('click', (e) => {
      if (e.target.className === 'video-box' && e.target.className !== 'video-dialog') {
        this.showRadioPlay = false
        $('#my-video')[0].pause()
      }
    })
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    }),
    courseCode () {
      return this.$route.params.courseCode
    },
    subscribeCourses () {
      let sc = this.subscribeCoursesStr
      if (!sc) {
        sc = localStorage.getItem('subscribeCoursesStr')
      }
      return sc
    }
  },
  methods: {
    ...mapActions({
      langInfoDetails: 'course/langInfoDetails', // 语言详情
      countryInfo: 'course/countryInfo', // 国家详情
      getShelfResList: 'course/getShelfResList',
      postPurchaseCourse: 'course/postPurchaseCourse',
      getLearnCourses: 'course/getLearnCourses',
      getEndangeredDetail: 'getEndangeredDetail'
    }),
    tabChange (tabFlag) {
      this.tabFlag = tabFlag
      if (this.resourceInfoRadios.length >= 10) {
        this.showMorePage = 0
      }
    },
    nationDetail (code, flag, name) {
      let OBJ = {
        'flag': flag,
        'name': name,
        'params': this.courseCode
      }
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('nationInfos', jsonStr)
      this.$router.push({ path: `/app/nation-details/${code}` })
    },
    // 点击展开电台的时候加载电台
    loadMoreRadio () {
      let _this = this
      _this.pageindex++
      _this.getShelfResList({ page: _this.pageindex }).then((res) => {
        console.log('resradio', res)
        _this.resourceInfoRadios = _this.resourceInfoRadios.concat(res.resourceInfo.radios)
        if (res.resourceInfo.page === -1) {
          _this.showMorePage = res.resourceInfo.page
        }
        // res.resourceInfo.radios.forEach((item) => {
        //   _this.resourceInfoRadios.push(item)
        // })
      })
    },
    // 点击展开，国家全部展开
    loadMoreNation () {
      if (this.showMoreCountry) {
        this.countryLists = this.allCountryLists
      } else {
        this.countryLists = this.allCountryLists.slice(0, 9)
      }
      this.showMoreCountry = !this.showMoreCountry
    },
    // 点开始学习
    startLearn () {
      let arr = this.courseCode.split('-')
      let courseCode = (arr.length > 1) ? this.courseCode : this.courseCode.toUpperCase() + '-Basic'
      Bus.$emit('changeCourseCode', courseCode)
      setTimeout(() => {
        this.$router.push({path: '/app/course-list'})
      }, 1000)
    },
    subscribeCourse () {
      let arr = this.courseCode.split('-')
      let courseCode = (arr.length > 1) ? this.courseCode : this.courseCode.toUpperCase() + '-Basic'
      this.postPurchaseCourse({ code: courseCode }).then((res) => {
        this.getLearnCourses()
      })
    },
    async initDataDetails () {
      let _this = this
      var params = {}
      let arr = _this.courseCode.split('-')
      console.log('arr', arr)
      if (arr.length > 1) {
        params = {
          course_code: _this.courseCode
        }
      } else {
        params = {
          lang_code: arr[0]
        }
      }
      await _this.langInfoDetails(params).then(res => {
        console.log('语言详情', res)
        for (var item in res.langInfo) {
          if (_this.langInfoObj[item]) {
            _this.langInfoObj[item]['info'] = res.langInfo[item]['info']
          }
        }
        _this.courseInfo = res.courseInfo
        _this.allCountryLists = res.countryInfo
        _this.countryLists = _this.allCountryLists.slice(0, 9)
        console.log('allCountryLists,countryLists', _this.allCountryLists, _this.countryLists)
        _this.resourceInfoRadios = res.resourceInfo.radios
        console.log('====>', res.resourceInfo.page)
        if (res.resourceInfo.page === -1) {
          _this.showMorePage = res.resourceInfo.page
        }
        console.log('====>', _this.showMorePage)
        _this.allCountryLists.forEach(item => {
          _this.countryInfo({code: item.code}).then(data => {
            item.countryLangueInfos = data.country_info.langsInfo
          })
        })
      })
    },
    // 播放视频
    playRadio () {
      $('#my-video')[0].play()
      this.showRadioPlay = true
    }
  }
}
</script>

<style lang="less" scoped>
.book-details {
  width: 960px;
  margin: 0px auto 144px;
  .nav {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
      color: #999999;
      &:hover{
        color: #2A9FE4;
      }
    }
    .nav-current {
      display: inline-block;
      color: #2A9FE4;
    }
  }
}
.details-header {
  width: 100%;
  border-radius: 3px;
  .details-header-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // 上部左边部分
    .details-header-left {
      width: 690px;
      border-radius: 5px;
      background: #ffffff;
      .left-content {
        height: 100%;
        padding: 36px 40px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .left-top {
          padding-bottom: 30px;
          position: relative;
          .details-img {
            width: 84px;
            height: 84px;
            box-shadow:0px 4px 10px 0px rgba(81,120,135,0.18);
            img {
              width: 100%;
              height: 100%;
              border-radius: 6px;
              object-fit: cover;
            }
          }
          .details-case {
            position: absolute;
            top: 23px;
            left: 104px;
            p:nth-child(1) {
              font-size:24px;
              font-family:PingFang-SC-Heavy;
              font-weight:800;
              color:rgba(51,51,51,1);
            }
            // p:nth-child(2) {
            //   font-size: 20px;
            //   font-weight: bold;
            // }
          }
        }
        .left-bottom {
          position: relative;
          .left-bottom-content {
            ul {
              li {
                // width: 380px;
                margin-top: 6px;
                // border-bottom: 1px solid #EBEBEB;
                .item {
                  width: 380px;
                  padding: 8px 50px;
                  background: #F6F8F9FF;
                  border-radius: 80px;
                  font-size:14px;
                  font-family:PingFang-SC-Regular;
                  font-weight:400;
                  color:rgba(51,51,51,1);
                  .fl {
                    float: right;
                    display: block;
                    // width: 110px;
                    font-family:PingFang-SC-Heavy;
                    font-weight:800;
                  }
                  i {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                    margin-top: 3px;
                  }
                  .language {
                    background: url('../../../../static/images/language.svg') no-repeat center;
                    background-size: cover;
                  }
                  .case {
                    background: url('../../../../static/images/case.svg') no-repeat center;
                    background-size: cover;
                  }
                  .homeWork {
                    background: url('../../../../static/images/homeWork.svg') no-repeat center;
                    background-size: cover;
                  }
                  .price {
                    background: url('../../../../static/images/price.svg') no-repeat center;
                    background-size: cover;
                  }
                }
                .buy-button {
                  cursor: pointer;
                  font-size: 14px;
                  color: #ffffff;
                  display: inline-block;
                  width: 80px;
                  text-align: center;
                  border-radius:18px;
                  border:1px solid rgba(42,159,228,1);
                  span {
                    font-size:12px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(42,159,228,1);
                  }
                }
              }
              // li:nth-child(1), li:nth-child(3) {
              //   background: #FAFAFAFF;
              // }
              li:last-child {
                display: flex;
                justify-content: space-between;
                .item {
                  .fl {
                    background: linear-gradient(to right, #FAD961FF, #F76B1CFF);
                    -webkit-background-clip: text;
                    color: transparent;
                  }
                }
              }
            }
          }
          .button {
            background: #2A9FE4FF;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            padding: 8px 42px;
            border-radius: 20px;
            box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .15);
          }
          .button:hover {
            background: rgba(11, 108, 224, .6)
          }
        }
      }
    }
    // 上部右边部分
    .details-header-right {
      width: 258px;
      border-radius: 5px;
      background: #ffffff;
      .right-content {
        width: 100%;
        height: 100%;
        padding: 20px;
        .audio-play {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: 10px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
            object-fit: cover;
          }
          .text {
            cursor: pointer;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .2);
            position: absolute;
            top: 0;
            text-align: center;
            line-height: 120px;
            font-size: 20px;
            color: #ffffff;
            border-radius: 3px;
          }
        }
        .add-btn {
          width: 100%;
          .img-cont {
            padding: 36px 0 0;
            text-align: center;
            .img {
              width: 120px;
              height: 120px;
              background: url('../../../../static/images/qrcode.png') no-repeat center;
              background-size: cover;
              margin: 0 auto;
              margin-bottom: 36px;
            }
            span {
              font-size: 12px;
              color: #7E929FFF;
              line-height: 12px;
            }
          }
        }
        // 第三方登录
        .flicking {
          padding-top: 10px;
          p {
            font-size:12px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(186,195,205,1);
            text-align: center;
          }
          .third-party {
            width: 100%;
            display: flex;
            justify-content: space-around;
            margin-top: 26px;
            i {
              cursor: pointer;
              display: inline-block;
              width: 30px;
              height: 30px;
            }
            .weixin {
              position: relative;
              i {
                background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                background-size: cover;
              }
              // &:hover .weixin-img {
              //   display: block;
              // }
              // .weixin-img {
              //   display: none;
              //   position: absolute;
              //   left: -31px;
              //   top: 36px;
              //   width: 100px;
              //   height: 100px;
              //   background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
              //   background-size: cover;
              // }
            }
            .weibo {
              position: relative;
              i {
                background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                background-size: cover;
              }
            }
            .friend {
              position: relative;
              i {
                background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                background-size: cover;
              }
            }
            .qq {
              position: relative;
              i {
                background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                background-size: cover;
              }
            }
          }
        }
      }
    }
  }
}
.details-under {
  margin-top: 20px;
  width: 100%;
  .under-content {
    width: 100%;
    .tab-item {
      width: 100%;
      padding: 23px 0 0;
      .tab-box {
        height: 100px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .item {
          background: #ffffff;
          cursor: pointer;
          width: 318px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          &.active {
            border-bottom: 6px solid #2A9FE4FF;
            span {
              color: #2A9FE4FF;
              margin-left: 7px;
            }
            .info {
              background: url('../../../../static/images/bookCase/messageactive.svg') no-repeat center;
              background-size: cover;
            }
            .resource {
              background: url('../../../../static/images/bookCase/resourceactive.svg') no-repeat center;
              background-size: cover;
            }
            .nation {
              background: url('../../../../static/images/bookCase/nationactive.svg') no-repeat center;
              background-size: cover;
            }
          }
          i {
            display: inline-block;
            width: 30px;
            height: 30px;
          }
          .info {
            background: url('../../../../static/images/bookCase/message.svg') no-repeat center;
            background-size: cover;
          }
          .resource {
            background: url('../../../../static/images/bookCase/resource.svg') no-repeat center;
            background-size: cover;
          }
          .nation {
            background: url('../../../../static/images/bookCase/nation.svg') no-repeat center;
            background-size: cover;
          }
          span {
            font-size:14px;
            font-family:PingFang-SC-Heavy;
            font-weight:800;
            margin-left: 7px;
            color:rgba(216,216,216,1);
          }
        }
      }
    }
    // 内容区
    .tab-content-box {
      width: 100%;
      background: #ffffff;
      margin-top: 4px;
      .tab-content {
        width: 100%;
        height: 100%;
        // padding: 50px 100px;
        border-radius: 3px;
        .up-all {
          cursor: pointer;
          width: 100%;
          background: rgba(221, 221, 221, .1);
          text-align: center;
          line-height: 42px;
          font-size:14px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(42,159,228,1);
          span {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          i {
            display: inline-block;
            width: 10px;
            height: 6px;
            background: url('../../../../static/images/upAll.svg') no-repeat center;
            background-size: cover;
            margin-left: 10px;
          }
          .active {
            display: inline-block;
            width: 10px;
            height: 6px;
            background: url('../../../../static/images/upAllActive.svg') no-repeat center;
            background-size: cover;
            margin-left: 10px;
          }
          .up-all-content {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .course-related {
            width: 100%;
            min-height: 445px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            i {
              display: inline-block;
              width: 145px;
              height: 82px;
              background-image: url('../../../../static/images/discovery/language-related.svg');
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
            }
            span {
              padding-top: 18px;
              font-size:16px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(200,212,219,1);
              line-height:22px;
            }
          }
        }
      }
    }
  }
}
.video-box {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  overflow: hidden;
  outline: 0;
  background: rgba(0, 0, 0, .5);
  .video-dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 710px;
    height: 400px;
    transform: translate(-50%, -50%);
    video {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
