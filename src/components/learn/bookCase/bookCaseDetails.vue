<template>
  <div class="book-details">
    <nav-comp />
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
                    <a href="javascript:void(0)" @click="btnHandler()" :class="['button', {'locked': (btnState == '0')}]">
                      <span>{{btnDesc}}</span>
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
            <!-- 分享 -->
            <share-box :type="type"/>
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
              <book-case-country :countryLists="countryLists" :courseCode="courseCode" :countryLangs="countryLangs"></book-case-country>
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
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus'
import $ from 'jquery'
import VipPrompt from '../../../components/common/vipPrompt.vue'
import LoginBox from '../../../components/common/loginBox.vue'
import NavComp from '../../common/nav.vue'
import BookCaseInfo from './bookCaseInfo.vue'
import BookCaseRadios from './bookCaseRadios.vue'
import BookCaseCountry from './bookCaseCountry.vue'
import Cookie from '../../../tool/cookie'
import ShareBox from '../../common/shareBox'

export default {
  data () {
    return {
      btnDesc: '',
      btnState: '', // 0: 课程建设中 1: 订阅课程 2: 开始学习
      type: '3',
      userId: '',
      showRadioPlay: false,
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
      subscribeLangCourses: [], // 订阅的官方课程
      courseInfo: {}, // 语言的详情
      resourceInfoRadios: [], // 资源电台
      allCountryLists: [], // 接收后端的所有数据
      countryLists: [], // 页面刚加载的时候只显示9条数据
      countryLangs: [], // 国家所拥有的语言
      pageindex: 1 // 当前页
    }
  },
  components: {
    VipPrompt,
    LoginBox,
    BookCaseInfo,
    BookCaseRadios,
    BookCaseCountry,
    NavComp,
    ShareBox
  },
  created () {
  },
  mounted () {
    let navList = [
      {id: 1, path: '/app/index', text: '我的学习账户'},
      {id: 2, path: '/app/book-case', text: '添加课程'},
      {id: 3, path: '', text: '课程详情'}
    ]
    Bus.$emit('loadNavData', navList)
    this.userId = Cookie.getCookie('user_id')
    console.log('courseCode', this.courseCode)
    this.initDataDetails()
    document.addEventListener('click', (e) => {
      if (e.target.className === 'video-box' && e.target.className !== 'video-dialog') {
        this.showRadioPlay = false
        $('#my-video')[0].pause()
      }
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    courseCode () {
      return this.$route.params.courseCode
    }
  },
  methods: {
    ...mapActions({
      langInfoDetails: 'course/langInfoDetails', // 语言详情
      getShelfResList: 'course/getShelfResList',
      postPurchaseCourse: 'course/postPurchaseCourse',
      getMoreLearnCourses: 'getMoreLearnCourses',
      getEndangeredDetail: 'getEndangeredDetail',
      getCountryLanguages: 'getCountryLanguages'
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
    btnHandler () {
      if (this.btnState === '1') {
        this.subscribeCourse()
      } else if (this.btnState === '2') {
        this.startLearn()
      }
    },
    // 点开始学习
    startLearn () {
      let arr = this.courseCode.split('-')
      let courseCode = (arr.length > 1) ? this.courseCode : this.courseCode.toUpperCase()
      Bus.$emit('loadIndexCourse', courseCode)
      setTimeout(() => {
        this.$router.push({path: '/app/index'})
      }, 1000)
    },
    subscribeCourse () {
      if (!this.userId) {
        Bus.$emit('showGoLoginBox')
        return false
      }
      let isVip = this.userInfo.member_info.member_type
      if (parseInt(isVip) !== 1 && this.subscribeLangCourses.length >= 3) {
        let obj = {
          className: 'vipIcon',
          description: '升级会员免费订阅所有官方课程',
          btnDesc: '升级会员',
          isLink: true,
          hyperLink: '/app/user/vip'
        }
        Bus.$emit('showCommonModal', obj)
      } else {
        let arr = this.courseCode.split('-')
        let courseCode = (arr.length > 1) ? this.courseCode : this.courseCode.toUpperCase() + '-Basic'
        this.postPurchaseCourse({ code: courseCode }).then((res) => {
          this.refreshSubscribeCourses()
        })
      }
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
        console.log('========>', _this.langInfoObj)
        _this.courseInfo = res.courseInfo
        _this.allCountryLists = res.countryInfo
        _this.countryLists = _this.allCountryLists.slice(0, 9)

        Bus.$emit('shareCardContent', _this.courseInfo)
        console.log('allCountryLists,countryLists', _this.allCountryLists, _this.countryLists)
        _this.resourceInfoRadios = res.resourceInfo.radios
        console.log('====>', res.resourceInfo.page)
        if (res.resourceInfo.page === -1) {
          _this.showMorePage = res.resourceInfo.page
        }
        console.log('====>', _this.showMorePage)
        let arrCountryCode = []
        _this.allCountryLists.forEach(item => {
          arrCountryCode.push(item.code)
        })
        _this.getCountryLanguages({country_codes: arrCountryCode.join(',')}).then(res => {
          console.log(res)
          _this.countryLangs = res.data
        })
      })
      this.refreshSubscribeCourses()
    },
    // 播放视频
    playRadio () {
      $('#my-video')[0].play()
      this.showRadioPlay = true
    },
    refreshSubscribeCourses () {
      let _this = this
      _this.getMoreLearnCourses().then(res => {
        if (res.success) {
          let learnCourses = res.learn_courses
          learnCourses.forEach(item => {
            if (!parseInt(item.course_type)) {
              _this.subscribeLangCourses.push(item.code)
            }
          })
          if (_this.subscribeLangCourses.length > 0 && _this.subscribeLangCourses.join(',').indexOf(_this.courseCode) > -1 && _this.courseInfo.has_course) {
            _this.btnState = '2'
            _this.btnDesc = '开始学习'
          } else if ((_this.subscribeLangCourses.length > 0 && _this.subscribeLangCourses.join(',').indexOf(_this.courseCode) === -1 && _this.courseInfo.has_course) || (_this.courseCode.indexOf('-Basic') > -1)) {
            _this.btnState = '1'
            this.btnDesc = '订阅课程'
          } else {
            _this.btnState = '0'
            this.btnDesc = '课程建设中'
          }
          console.log(_this.btnState)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.book-details {
  width: 960px;
  margin: 0px auto 144px;
}
.details-header {
  width: 100%;
  margin-top: 8px;
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
                  line-height: 26px;
                  padding: 5px 50px;
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
            min-width: 140px;
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
          .locked {
            background-color: #90A2AE;
            box-shadow: 0 0 0 0;
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
            font-size: 16px;
            color: #ffffff;
            border-radius: 3px;
          }
        }
        .add-btn {
          width: 100%;
          .img-cont {
            padding: 24px 0 20px;
            text-align: center;
            .img {
              width: 67px;
              height: 66px;
              background: url('../../../../static/images/qrcode.png') no-repeat center;
              background-size: cover;
              margin: 0 auto;
              margin-bottom: 10px;
            }
            span {
              font-size: 12px;
              color: #7E929FFF;
              line-height: 12px;
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
        height: 80px;
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
          border-bottom: 6px solid #ffffff;
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
            color:#B9CDE2;
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
