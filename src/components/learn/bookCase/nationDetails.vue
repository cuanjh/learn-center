<template>
  <div class="nation-details">
    <nav-comp />
    <!-- 内容区域 -->
    <div class="nation-details-content">
      <!-- 上面分享的部分 -->
      <div class="nation-header">
        <div class="nation-header-content">
          <div class="logo-img"></div>
          <div class="share-lists" v-show="false">
            <div class="share-item" @click="tabShare(0)">
              <i class="farim" :class="{'active': active == 0}"></i>
            </div>
            <div class="share-item" @click="tabShare(1)">
              <i class="weixin" :class="{'active': active == 1}"></i>
            </div>
            <div class="share-item" @click="tabShare(2)">
              <i class="other" :class="{'active': active == 2}"></i>
            </div>
            <div class="share-item" @click="tabShare(3)">
              <i class="weibo" :class="{'active': active == 3}"></i>
            </div>
            <div class="share-item" @click="tabShare(4)">
              <i class="friend" :class="{'active': active == 4}"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="shadow"></div>
      <!-- 下面的内容区域 -->
      <div class="nation-bottom-content">
        <div class="nation-in-content">
          <!-- 左边导航区域 -->
          <div class="nation-left-tab">
            <div class="left">
              <p v-bind:class="{'active': 'info' == tabFlag}" @click="tabChange('info')">
                <span>国家详情</span>
              </p>
              <p v-bind:class="{'active': 'language' == tabFlag}" @click="tabChange('language')">
                <span>拥有语言</span>
              </p>
              <p v-show="false" v-bind:class="{'active': 'news' == tabFlag}" @click="tabChange('news')">
                <span>全球头条</span>
              </p>
            </div>
          </div>
          <!-- 右边对应的内容区域 -->
          <div class="nation-right-content">
            <div class="nation-right">
              <!-- 前两个宽50% 后面的是100% -->
              <div class="right-header">
                <div class="right-img">
                  <img :src="naInfo.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="">
                </div>
                <div class="introduce">
                  <p>{{naInfo.name}}</p>
                  <p>{{naInfo.pName2}}</p>
                </div>
              </div>
              <div class="country-contents">
                <div class="country-out-info" v-show="'info' == tabFlag">
                  <div class="icon-list">
                    <p><i></i></p>
                    <p><i></i></p>
                  </div>
                  <ul class="country-info">
                    <li v-for="(item, index) in nationInfoObj" :key="index">
                      <p class="title">{{item.title}}</p>
                      <p class="desc">{{item.info}}</p>
                    </li>
                  </ul>
                </div>
                <div class="country-out-language" v-show="'language' == tabFlag">
                  <ul class="country-language">
                    <li class="country-img" v-for="item in countryLanguages" :key="item.lang_code">
                      <router-link :to="{path: '/app/book-details/' + item.courseCode}" class="have-img">
                        <div class="country-img">
                          <img :src="item.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="">
                        </div>
                        <div class="country-title">
                          <p>{{item.name}}</p>
                          <p>{{item.location}}</p>
                        </div>
                        <!-- <div class="country-icon"></div> -->
                      </router-link>
                    </li>
                  </ul>
                  <ul class="country-language">
                    <li class="country-no-img" v-for="item in countryLanguagesNo.slice(0, 10)" :key="item.lang_code">
                      <router-link :to="{path: '/app/book-details/' + item.lang_code}" class="no-img">
                        <div class="country-title">
                          <p>{{item.name}}</p>
                          <p>{{item.location}}</p>
                        </div>
                        <!-- <div class="country-icon"></div> -->
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- vip活动提示 -->
    <VipPrompt></VipPrompt>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import VipPrompt from '../../../components/common/vipPrompt'
import NavComp from '../../common/nav.vue'
import Bus from '../../../bus'
export default {
  data () {
    return {
      active: 0, // 分享图标显示
      tabFlag: 'info', // 左边导航
      nationInfoObj: { // 国家信息英文化
        'OfficialName': {
          title: '国家名称',
          info: ''
        },
        'Population': {
          title: '使用人口',
          info: ''
        },
        'PrincipalLanguages': {
          title: '主要语言',
          info: ''
        },
        'LiteracyRate': {
          title: '识字率',
          info: ''
        },
        'ImmigrantLanguages': {
          title: '移民语言',
          info: ''
        },
        'GeneralReferences': {
          title: '参考文献',
          info: ''
        },
        'DeafPopulation': {
          title: '听力丧失人口',
          info: ''
        },
        'LanguageCounts': {
          title: '语言数量',
          info: ''
        }
      },
      langInfos: [], // 国家的语言
      code: '',
      countryLanguages: [],
      countryLanguagesNo: []
    }
  },
  components: {
    VipPrompt,
    NavComp
  },
  mounted () {
    let navList = [
      {id: 1, path: '/app/index', text: '我的学习账户'},
      {id: 2, path: '/app/book-case', text: '添加课程'},
      {id: 3, path: '/app/book-details/' + this.naInfo.courseCode, text: '课程详情'},
      {id: 4, path: '', text: '国家介绍'}
    ]
    Bus.$emit('loadNavData', navList)
    console.log('==========>', this.naInfo)
    console.log('==========>', this.countryCode)
    this.initDataCountryInfo()
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    }),
    naInfo () {
      let nationInfos = JSON.parse(localStorage.getItem('nationInfos'))
      return nationInfos
    },
    countryCode () {
      return this.$route.params.countryCode
    }
  },
  methods: {
    ...mapActions({
      countryInfo: 'course/countryInfo'
    }),
    // 点击分享图片高亮
    tabShare (index) {
      this.active = index
    },
    // 左边导航切换
    tabChange (tabFlag) {
      this.tabFlag = tabFlag
    },
    async initDataCountryInfo () {
      let _this = this
      await _this.countryInfo({code: _this.countryCode}).then(res => {
        console.log('国家详情', res)
        for (var item in res.country_info.info) {
          if (_this.nationInfoObj[item]) {
            _this.nationInfoObj[item]['info'] = res.country_info.info[item]['info']
          }
        }
        _this.langInfos = res.country_info.langsInfo
        _this.langInfos.forEach(item => {
          if (item.flag === '') {
            _this.countryLanguagesNo.push(item)
          } else {
            _this.countryLanguages.push(item)
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
a {
  text-decoration:none;
}
.nation-details {
  width: 960px;
  margin: 0px auto 144px;
}
.nation-details-content {
  width: 100%;
  height: auto;
  margin-top: 8px;
  margin-bottom: 23px;
}
.nation-header {
  width: 100%;
  background:#2A9FE4FF;
  border-radius:5px 5px 0px 0px;
  .nation-header-content {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    .logo-img {
      width: 167px;
      height: 60px;
      background: #2A9FE4;
      padding: 11px 15px;background: url('../../../../static/images/wal.svg') no-repeat center;
      background-size: 100%;
    }
    .share-lists {
      width: 200px;
      background: rgb(240, 178, 235);
      display: flex;
      justify-content: space-between;
      align-items:center;
      .share-item {
        cursor: pointer;
        width: 30px;
        height: 30px;
        i {
          display: inline-block;
          width: 30px;
          height: 30px;
        }
        .farim {
          background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
          background-size: cover;
          &.active {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
        }
        .weixin {
          background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
          background-size: cover;
          &.active {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
        }
        .other {
          background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
          background-size: cover;
          &.active {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
        }
        .weibo {
          background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
          background-size: cover;
          &.active {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
        }
        .friend {
          background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
          background-size: cover;
          &.active {
            background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
            background-size: cover;
          }
        }
      }
    }
  }
}
.shadow {
  width: 100%;
  height: 11px;
  background:rgba(112,161,190,1);
  border-radius:5px 5px 0px 0px;
  opacity:0.3131;
  filter:blur(5px);
}
.nation-bottom-content {
  width: 100%;
  .nation-in-content {
    width: 100%;
    height: 100%;
    display: flex;
    background: #F9F9F9FF;
    // 左边导航
    .nation-left-tab {
      width: 230px;
      background-color: #fff;
      margin-right: 10px;
      border-radius: 0 0 0 5px;
      .left {
        padding-top: 30px;
        p {
          cursor: pointer;
          padding-bottom: 25px;
          font-size:16px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(153,153,153,1);
          span {
            padding-left: 25px;
            border-left: 4px solid #fff;
          }
          &.active {
            color:#0A2B40FF;
            font-weight:500;
            span {
              display: inline-block;
              border-left: 4px solid #2A9FE4FF;
              width: 100%;
            }
          }
        }
      }
    }
    // 右边内容区域
    .nation-right-content {
      width: 100%;
      height: auto;
      background:#fff;
      border-radius: 0 0 5px 0;
      .nation-right {
        width: 100%;
        padding: 31px 40px 60px;
        .right-header {
          width: 100%;
          padding-bottom: 20px;
          border-bottom: 1px solid #EAEAEAFF;
          display: flex;
          .right-img {
            width: 90px;
            height: 60px;
            img {
              width: 100%;
              height: 100%;
              // border-radius: 8px;
            }
          }
          .introduce {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 20px;
            p:nth-child(1) {
              font-size:16px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(0,42,91,1);
            }
            p:nth-child(2) {
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(51,51,51,1);
            }
          }
        }
        .country-contents {
          background-color: #fff;
          margin-top: 33px;
          .country-out-info {
            width: 100%;
            .icon-list {
              width: 100%;
              display: flex;
              justify-content: space-between;
              p:nth-child(1) {
                width: 50%;
                i {
                  display: inline-block;
                  width: 24px;
                  height: 36px;
                  background: url('../../../../static/images/bookCase/countryName.svg') no-repeat center;
                  background-size: cover;
                }
              }
              p:nth-child(2) {
                width: 50%;
                i {
                  display: inline-block;
                  width: 32px;
                  height: 36px;
                  background: url('../../../../static/images/bookCase/personName.svg') no-repeat center;
                  background-size: 100%;
                }
              }
            }
            .country-info {
              width: 100%;
              margin-top: 10px;
              li {
                display: inline-block;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-bottom: 30px;
                .title {
                  font-size:16px;
                  font-family:PingFangSC-Semibold;
                  font-weight:600;
                  color:rgba(0,42,91,1);
                }
                .desc {
                  width: 90%;
                  font-size:14px;
                  font-family:PingFang-SC-Regular;
                  font-weight:400;
                  color:rgba(153,153,153,1);
                }
              }
              li:nth-child(1) {
                display: inline-block;
                white-space:nowrap;
                width: 50%;
              }
              li:nth-child(2) {
                display: inline-block;
                width: 50%;
                margin-left: -4px;
                white-space:nowrap;
              }
            }
          }
          .country-out-language {
            .country-language {
              width: 100%;
              padding: 0px 16px 0px 0px;
              li {
                position: relative;
                width: 100%;
                padding: 20px 0;
                cursor: pointer;
                &:last-child {
                  border-bottom: 0px;
                }
                .have-img {
                  display: flex;
                }
                .country-img {
                  display: inline-block;
                  width: 50px;
                  height: 50px;
                  margin-right: 10px;
                  img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 8px;
                  }
                }
                .country-title {
                  display: inline-block;
                  font-size: 14px;
                  color: #444444;
                  line-height: 20px;
                  p:nth-child(1) {
                    font-size:16px;
                    font-family:PingFangSC-Semibold;
                    font-weight:600;
                    color:rgba(0,42,91,1);
                    margin-bottom: 9px;
                  }
                  p:nth-child(2) {
                    font-size:14px;
                    font-family:PingFangSC-Regular;
                    font-weight:400;
                    color:rgba(132,147,165,1);
                  }
                }
                .country-icon {
                  position: absolute;
                  top: 15px;
                  right: 0;
                  display: inline-block;
                  width: 10px;
                  height: 18px;
                  background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
                  background-size: 10px 18px;
                  cursor: pointer;
                }
              }
              li:first-child {
                padding-top: 0px;
              }
              li {
                &.country-no-img:first-child {
                  padding-top: 20px;
                }
              }
              li {
                &.country-img:last-child {
                  border-bottom:1px solid rgba(241,245,248,1);
                }
              }
              li:hover {
                .country-title {
                  p {
                    color: #2A9FE4FF;
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
</style>
