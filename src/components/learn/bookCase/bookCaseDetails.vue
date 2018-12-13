<template>
  <div class="book-details">
    <div class="nav">
      <router-link :to="{path: '/app/book-case'}">
        <span>我的学习账户</span>
      </router-link>
      >
      <router-link :to="{path: '/app/hot-courses'}">
        <span>添加课程</span>
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
                <img :src="(courseInfo.cover ? courseInfo.cover : '/static/images/bookCase/img_default_maige.png') | urlFix('imageView2/0/format/jpg')" alt="课程详情的图片">
              </div>
              <div class="details-case">
                <p>全球说</p>
                <p>
                  <span>麦格</span>
                  <span></span>
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
                    <div class="buy-button">
                      <span>购买</span>
                    </div>
                  </li>
                </ul>
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
            </div>
          </div>
        </div>
        <div class="details-header-right">
          <div class="right-content">
            <div class="audio-play">
              <img src="https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1" alt="audio的背景图片">
              <audio src=""></audio>
              <p class="text">
                <span>全球说母语教学法</span>
              </p>
            </div>
            <div class="add-btn">
              <a href="javascript(0)">
                <img src="../../../../static/images/course/learn-jiahao.png" alt="添加按钮">
              </a>
            </div>
            <div class="flicking">
              <p><span>扫一扫下载全球说App</span></p>
              <div class="third-party">
                <div class="weixin">
                  <i></i>
                  <div class="weixin-img"></div>
                </div>
                <div class="weibo">
                  <i></i>
                  <div class="weibo-img"></div>
                </div>
                <div class="friend">
                  <i></i>
                  <div class="friend-img"></div>
                </div>
                <div class="qq">
                  <i></i>
                  <div class="qq-img"></div>
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
            <div class="item" @click="tabChange('info')">
              <i class="info"></i>
              <span v-bind:class="{'active': 'info' == tabFlag}">信息</span>
            </div>
            <div class="item" @click="tabChange('resource')">
              <i class="resource"></i>
              <span v-bind:class="{'active': 'resource' == tabFlag}">资源</span>
            </div>
            <div class="item" @click="tabChange('nation')">
              <i class="nation"></i>
              <span v-bind:class="{'active': 'nation' == tabFlag}">国家</span>
            </div>
          </div>
        </div>
        <!-- 切换内容区 -->
        <div class="tab-content-box">
          <div class="tab-content">
            <div class="info-list" v-show="'info' == tabFlag">
              <ul class="book-info">
                <li v-for="(item, key, index) in langInfoObj" :key="index" v-if="item.info">
                  <p class="title">{{item.title}}</p>
                  <p v-if="key === 'LanguageResources'" class="desc"><a :href="item.info">{{item.info}}</a></p>
                  <p v-else class="desc">{{item.info}}</p>
                </li>
              </ul>
              <div class="up-all">
                <span @click="loadMore()">全部展开</span>
              </div>
            </div>
            <div class="resource-list" v-show="'resource' == tabFlag">
              <ul class="book-resource">
                <li v-for="(item, index) in resourceInfoRadios" :key="index">
                  <div class="book-img">
                    <img :src="item.cover" alt="资源图片">
                  </div>
                  <div class="book-title">
                    <p class="share-title">{{ item.title }}</p>
                    <p class="share">
                      <span>BY:</span>
                      <span>{{ item.author_name }}</span>
                      <i></i>
                      <span>128 W</span>
                    </p>
                  </div>
                  <div class="icon"></div>
                </li>
                <!-- <li v-if="resPage > 1" @click="loadMore()">
                  <p class="more">加载更多...</p>
                </li> -->
              </ul>
              <div class="up-all">
                <span @click="loadMore()">全部展开</span>
              </div>
            </div>
            <div class="nation-list" v-show="'nation' == tabFlag">
              <ul class="book-nation">
                <li v-for="(item, index) in countryInfo" :key="index"  @click="nationDetail(item.code, item.flag, item.name)">
                  <div class="nation-title">
                    <p>{{ item.name }}</p>
                  </div>
                  <div class="nation-img">
                    <img :src="item.flag" :onerror="defaultImg" alt="资源图片">
                  </div>
                  <div class="nation-languages">
                    <div class="languages">
                      <p>Principal Languages:</p>
                      <span></span>
                    </div>
                  </div>
                  <!-- <router-link :to="{ path: '/app/nation-details/' + item.code }" class="nation-icon"></router-link> -->
                  <!-- <a class="nation-icon" @click="nationDetail(item.code, item.flag, item.name)"></a> -->
                </li>
              </ul>
              <div class="up-all">
                <span @click="loadMore()">全部展开</span>
              </div>
            </div>
          </div>
          <!-- <div class="up-all">
            <span @click="loadMore()">全部展开</span>
          </div> -->
        </div>
        <!-- 登录 -->
        <div class="login-box">
          <div class="login-content">
            <div class="login-log">
              <i></i>
            </div>
            <div class="login-item">
              <div class="title">
                <span>学习就是最好的保护!</span>
              </div>
              <div class="login">
                <input type="text" placeholder="手机号码">
              </div>
              <div class="phone-code">
                <input type="text" placeholder="输入验证码">
                <div class="button">获取验证码</div>
              </div>
              <div class="learn">
                <span>立即学习</span>
              </div>
            </div>
          </div>
        </div>
        <!-- vip提示 -->
        <div class="vip-content">
          <div class="vip-img"></div>
          <div class="prompt">
            <span>现在成为会员，12月圣诞好礼，新用户8折！！！</span>
          </div>
          <div class="vip-btn">
            <span>立即成为会员</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Bus from '../../../bus'

export default {
  data () {
    return {
      tabFlag: 'info', // true 语言信息 false 资源 电台
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
      courseInfo: {},
      countryInfo: {},
      resourceInfoRadios: [],
      resPage: 1,
      defaultImg: 'this.src="/static/images/bookCase/default_course.png"'
    }
  },
  created () {
    Bus.$on('initLangData', () => {
      this.initData()
    })
  },
  mounted () {
    console.log(this.$route)
    this.initData()
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
      langInfo: 'course/langInfo',
      getShelfResList: 'course/getShelfResList',
      postPurchaseCourse: 'course/postPurchaseCourse',
      getLearnCourses: 'course/getLearnCourses'
    }),
    tabChange (tabFlag) {
      this.tabFlag = tabFlag
    },
    nationDetail (code, flag, name) {
      let OBJ = {
        'flag': flag,
        'name': name
      }
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('nationInfos', jsonStr)
      this.$router.push({ path: `/app/nation-details/${code}` })
    },
    loadMore () {
      let _this = this
      _this.getShelfResList({ page: _this.resPage }).then((res) => {
        console.log('资源列表', res)
        res.resourceInfo.radios.forEach((item) => {
          _this.resourceInfoRadios.push(item)
        })
        _this.resPage = res.page
      })
    },
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
    async initData () {
      var params = {}
      let arr = this.courseCode.split('-')
      if (arr.length > 1) {
        params = {
          course_code: this.courseCode
        }
      } else {
        params = {
          lang_code: arr[0]
        }
      }
      this.langInfo(params).then(res => {
        console.log('课程详情', res)
        for (var item in res.langInfo) {
          if (this.langInfoObj[item]) {
            this.langInfoObj[item]['info'] = res.langInfo[item]['info']
          }
        }
        this.courseInfo = res.courseInfo
        console.log('courseInfo', this.courseInfo)
        this.countryInfo = res.countryInfo
        this.resourceInfoRadios = res.resourceInfo.radios
        this.resPage = res.resourceInfo.page
        console.log(res)
      })
    }
  }

}
</script>

<style lang="less" scoped>
.book-details {
  width: 1200px;
  margin: 0px auto 144px;
  .nav {
    margin: 20px 0;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
      text-decoration:none;
      span {
        color: #999999;
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
  height: 350px;
  border-radius: 3px;
  .details-header-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    // 上部左边部分
    .details-header-left {
      width: 73%;
      height: 100%;
      background: #ffffff;
      .left-content {
        height: 100%;
        padding: 30px 20px 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .left-top {
          display: flex;
          position: relative;
          .details-img {
            width: 80px;
            height: 80px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 8px;
              object-fit: cover
            }
          }
          .details-case {
            position: absolute;
            bottom: 0;
            left: 92px;
            p:nth-child(1) {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 6px;
            }
            p:nth-child(2) {
              font-size: 20px;
              font-weight: bold;
            }
          }
        }
        .left-bottom {
          .left-bottom-content {
            ul {
              li {
                width: 70%;
                padding: 10px 0;
                border-bottom: 1px solid red;
                .item {
                  display: inline-block;
                  overflow: hidden;
                  width: 75%;
                  font-size: 20px;
                  .fl {
                    float: right;
                    display: block;
                    width: 110px;
                  }
                  i {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    margin-right: 10px;
                  }
                  .language {
                    background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
                    background-size: cover;
                  }
                  .case {
                    background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
                    background-size: cover;
                  }
                  .homeWork {
                    background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
                    background-size: cover;
                  }
                  .price {
                    background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
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
                  background: #2A9FE4;
                  border-radius: 20px;
                  margin-left: 30px;
                  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, .15);
                  &:hover {
                    background: rgba(11, 108, 224, .6)
                  }
                }
              }
            }
          }
          .button {
            width: 170px;
            height: 50px;
            background: #2A9FE4;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            line-height: 50px;
            position: absolute;
            right: 31%;
            top: 43%;
            border-radius: 30px;
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
      width: 25%;
      height: 100%;
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
            border-radius: 10px;
          }
          .text {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .2);
            position: absolute;
            top: 0;
            text-align: center;
            line-height: 120px;
            font-size: 20px;
            color: #ffffff;
          }
        }
        .add-btn {
          width: 80px;
          height: 80px;
          margin: 20px auto 0;
          a {
            display: inline-block;
            text-decoration: none;
            width: 100%;
            height: 100%;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        // 第三方登录
        .flicking {
          padding-top: 10px;
          p {
            font-size: 16px;
            color: #999999;
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
              &:hover .weixin-img {
                display: block;
              }
              .weixin-img {
                display: none;
                position: absolute;
                left: -31px;
                top: 36px;
                width: 100px;
                height: 100px;
                background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
                background-size: cover;
              }
            }
            .weibo {
              position: relative;
              i {
                background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                background-size: cover;
              }
              &:hover .weibo-img {
                display: block;
              }
              .weibo-img {
                display: none;
                position: absolute;
                left: -31px;
                top: 36px;
                width: 100px;
                height: 100px;
                background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
                background-size: cover;
              }
            }
            .friend {
              position: relative;
              i {
                background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                background-size: cover;
              }
              &:hover .friend-img {
                display: block;
              }
              .friend-img {
                display: none;
                position: absolute;
                left: -31px;
                top: 36px;
                width: 100px;
                height: 100px;
                background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
                background-size: cover;
              }
            }
            .qq {
              position: relative;
              i {
                background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
                background-size: cover;
              }
              &:hover .qq-img {
                display: block;
              }
              .qq-img {
                display: none;
                position: absolute;
                left: -31px;
                top: 36px;
                width: 100px;
                height: 100px;
                background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
                background-size: cover;
              }
            }
          }
        }
      }
    }
  }
}

input {
  display: block;
  width: 100%;
  height: 40px;
  font-size: 14px;
  color: #000;
  line-height: 20px;
  border: 1px solid #c9c1c1;
  border-radius: 20px;
  background-color: #fff;
  padding: 10px 24px;
}
input::-webkit-input-placeholder {
  font-size: 14px;
  color: #b8b8b8;
}
input::-moz-placeholder {
  font-size: 14px;
  color: #b8b8b8;
}
input:-moz-placeholder {
  font-size: 14px;
  color: #b8b8b8;
}
input:-ms-placeholder {
  font-size: 14px;
  color: #b8b8b8;
}
input[type="text"] {
  margin-bottom: 20px;
}
.details-under {
  margin-top: 20px;
  width: 100%;
  .under-content {
    width: 100%;
    .tab-item {
      width: 100%;
      background: #ffffff;
      padding: 20px 0;
      .tab-box {
        width: 400px;
        height: 100px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .item {
          cursor: pointer;
          width: 80px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          i {
            display: inline-block;
            width: 30px;
            height: 30px;
          }
          .info {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
          .resource {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
          .nation {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
          span {
            margin-top: 10px;
            font-size: 20px;
            color: #4c4747;
            &.active {
              color: #0581D1;
            }
          }
        }
      }
    }
    // 内容区
    .tab-content-box {
      width: 100%;
      background: #ffffff;
      margin-top: 10px;
      .tab-content {
        width: 100%;
        height: 100%;
        // padding: 50px 100px;
        border-radius: 3px;
      }
      // .up-all {
      //   cursor: pointer;
      //   width: 100%;
      //   background: khaki;
      //   text-align: center;
      //   line-height: 50px;
      //   font-size: 20px;
      //   color: #fff;
      // }
    }
    // 登录区域
    .login-box {
      margin-top: 10px;
      width: 100%;
      background: #fff;
      .login-content {
        width: 50%;
        margin: 0 auto;
        padding: 50px 0 80px 0;
        .login-log {
          width: 200px;
          height: 60px;
          margin: 0 auto;
          i {
            display: inline-block;
            width: 200px;
            height: 60px;
            background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
            background-size: cover;
          }
        }
        .login-item {
          width: 300px;
          margin: 20px auto 0;
          .title {
            font-size: 20px;
            color: #333333;
            text-align: center;
            margin-bottom: 20px;
          }
          .phone-code {
            display: flex;
            justify-content: space-between;
            input {
              width: 170px;
            }
            .button {
              height: 40px;
              border: 1px solid #2A9FE4;
              text-align: center;
              line-height: 40px;
              border-radius: 20px;
              padding: 0 16px;
            }
          }
          .learn {
            width: 160px;
            background: rgb(167, 59, 230);
            font-size: 20px;
            color: #fff;
            text-align: center;
            border-radius: 20px;
            line-height: 30px;
            margin: 10px auto 0;
          }
        }
      }
    }
    // vip
    .vip-content {
      margin-top: 10px;
      position: relative;
      display: flex;
      width: 100%;
      padding: 20px 50px;
      background: rgb(230, 223, 131);
      .vip-img {
        width: 46px;
        height: 46px;
        background: url('../../../../static/images/course/course-vip-big.svg') no-repeat center;
        background-size: cover;
      }
      .prompt {
        font-size: 20px;
        color: #fff;
        line-height: 46px;
        margin-left: 16px;
      }
      .vip-btn {
        background: #2A9FE4;
        font-size: 20px;
        color: #fff;
        line-height: 46px;
        border-radius: 40px;
        text-align: center;
        padding: 0 20px;
        position: absolute;
        right: 20px;
      }
    }
  }
}
.info-list .up-all {
  cursor: pointer;
  width: 100%;
  background: khaki;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  color: #fff;
}
.book-info {
  min-height: 630px;
  padding: 50px 100px;
}
.book-info .title {
  font-size: 16px;
  color: #333333;
  border-bottom: 1px solid #EBEBEB;
  font-weight: bold;
  padding-bottom: 12px;
}
.book-info .desc {
  width: 100%;
  font-size: 16px;
  color: #999999;
  margin-top: 12px;
}
.book-info .desc a {
  color: #0581D1;
}
.resource-list .up-all {
  cursor: pointer;
  width: 100%;
  background: khaki;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  color: #fff;
}
.book-resource {
  width: 100%;
  padding: 50px 100px;
}

.book-resource li {
  position: relative;
  width: 100%;
  padding: 25px 0;
  border-bottom: 1px solid #EBEBEB;
}
.book-resource li .book-img {
  display: inline-block;
  width: 100px;
  height: 50px;
}
.book-resource li .book-img img{
  width: 100px;
  height: 50px;
  border-radius: 2px;
  object-fit: cover;
}
.book-resource li .book-title {
  display: inline-block;
  font-size: 14px;
  padding-left: 15px;
}
.book-resource li .book-title .share-title {
  color: #444444;
  font-weight: bold;
}
.book-resource li .book-title .share {
  font-size: 18px;
  color: #999999;
}
.book-resource li .book-title .share span {
  color: #999999;
  margin-right: 10px;
}
.book-resource li .book-title .share span:nth-child(2) {
  display: inline-block;
  width: 100px;
  height: 24px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.book-resource li .book-title .share i {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
  background-size: cover;
}
.book-resource li .icon {
  position: absolute;
  margin-top: 16px;
  right: 0;
  display: inline-block;
  width: 10px;
  height: 18px;
  background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
  background-size: 10px 18px;
}

.book-resource li:last-child {
  border: 0;
}
.nation-list .up-all {
  cursor: pointer;
  width: 100%;
  background: khaki;
  text-align: center;
  line-height: 50px;
  font-size: 20px;
  color: #fff;
}
.book-nation {
  width: 100%;
  min-height: 630px;
  padding: 50px 100px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.book-nation li {
  width: 30%;
  padding: 25px 0;
  border-bottom: 1px solid #EBEBEB;
  cursor: pointer;
}
.book-nation li .nation-img {
  width: 100px;
  height: 50px;
}
.book-nation li .nation-img img{
  width: 100px;
  height: 50px;
  border-radius: 2px;
  box-shadow: 0px 4px 6px rgba(36, 87, 120, 0.21)
}
.book-nation li .nation-title {
  font-size: 24px;
  font-weight: bold;
  color: #444444;
  padding-left: 15px;
  line-height: 50px;
}
.book-nation li .nation-languages .languages {
  font-size: 18px;
  font-weight: bold;
}
// .book-nation li .nation-icon {
//   position: absolute;
//   margin-top: 16px;
//   right: 0;
//   display: inline-block;
//   width: 10px;
//   height: 18px;
//   background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
//   background-size: 10px 18px;
// }

.book-nation li:last-child {
  border: 0px;
}

.more {
  text-align: center;
  cursor: pointer;
}
</style>
