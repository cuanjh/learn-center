<template>
  <div class="nation-details">
    <div class="nav">
      <router-link :to="{path: '/app/user/course'}">
        <span>我的学习账户</span>
      </router-link>
      >
      <router-link :to="{path: '/app/book-case'}">
        <span>添加语言</span>
      </router-link>
      >
      <router-link :to="{path: '/app/book-details/' + naInfo.params}">
        <span>语言详情</span>
      </router-link>
      >
      <div class="nav-current">
        国家介绍
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="nation-details-content">
      <!-- 上面分享的部分 -->
      <div class="nation-header">
        <div class="nation-header-content">
          <div class="logo-img">
            <i></i>
          </div>
          <div class="share-lists">
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
      <!-- 下面的内容区域 -->
      <div class="nation-bottom-content">
        <div class="nation-in-content">
          <!-- 左边导航区域 -->
          <div class="nation-left-tab">
            <div class="left">
              <a v-bind:class="{'active': 'info' == tabFlag}" @click="tabChange('info')">
                <span>/</span>
                <span>国家 信息</span>
              </a>
              <a v-bind:class="{'active': 'language' == tabFlag}" @click="tabChange('language')">
                <span>/</span>
                <span>国家 语言</span>
              </a>
              <a v-bind:class="{'active': 'news' == tabFlag}" @click="tabChange('news')">
                <span>/</span>
                <span>国家 新闻</span>
              </a>
            </div>
          </div>
          <!-- 右边对应的内容区域 -->
          <div class="nation-right-content">
            <div class="nation-right">
              <!-- 前两个宽50% 后面的是100% -->
              <div class="right-header">
                <div class="right-img">
                  <img :src="naInfo.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="国家图片">
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
                      <p class="desc">{{item.info?item.info : naInfo.name}}</p>
                    </li>
                  </ul>
                </div>
                <div class="country-out-language" v-show="'language' == tabFlag">
                  <ul class="country-language">
                    <li v-for="item in langInfos.slice(0, 16)" :key="item.lang_code">
                      <div v-if="item.flag">
                        <div class="country-img">
                          <img :src="item.flag | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="语言图片">
                        </div>
                        <div class="country-title">
                          <p>{{item.name}}</p>
                        </div>
                        <!-- <div class="country-icon"></div> -->
                      </div>
                      <div v-if="item.flag === ''">
                        <div class="country-title">
                          <p>{{item.name}}</p>
                          <p>{{item.location}}</p>
                        </div>
                      </div>
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
      cd: ''
    }
  },
  components: {
    VipPrompt
  },
  computed: {
    ...mapState({
      subscribeCoursesStr: state => state.course.subscribeCoursesStr
    }),
    naInfo () {
      let nationInfos = JSON.parse(localStorage.getItem('nationInfos'))
      return nationInfos
    }
  },
  mounted () {
    console.log('==========>', this.naInfo)
    console.log('==========>', this.$route.params.countryCode)
    let _this = this
    // _this.cd = _this.naInfo.params ? _this.naInfo.params : _this.naInfoHot.langCode
    _this.code = this.$route.params.countryCode
    _this.countryInfo({code: _this.code}).then(res => {
      console.log('国家详情', res)
      for (var item in res.country_info.info) {
        if (_this.nationInfoObj[item]) {
          _this.nationInfoObj[item]['info'] = res.country_info.info[item]['info']
        }
      }
      _this.langInfos = res.country_info.langsInfo
      console.log('langInfos', this.langInfos)
    })
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
    }
  }
}
</script>
<style lang="less" scoped>
a {
  text-decoration:none;
}
.nation-details {
  width: 1200px;
  margin: 0px auto 144px;
  background: pink;
  .nav {
    margin: 20px 0;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
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
.nation-details-content {
  width: 100%;
  height: auto;
}
.nation-header {
  width: 100%;
  background: rgb(143, 187, 126);
  .nation-header-content {
    width: 100%;
    height: 100%;
    padding: 40px 30px 16px;
    display: flex;
    justify-content: space-between;
    .logo-img {
      width: 120px;
      height: 80px;
      background: #2A9FE4;
      i {
        display: inline-block;
        width: 120px;
        height: 80px;
        background: url('../../../../static/images/bookCase/dog.png') no-repeat center;
        background-size: cover;
      }
    }
    .share-lists {
      width: 200px;
      background: rgb(240, 178, 235);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
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
.nation-bottom-content {
  width: 100%;
  background: rgb(239, 198, 240);
  .nation-in-content {
    width: 100%;
    height: 100%;
    display: flex;
    // 左边导航
    .nation-left-tab {
      height: 100%;
      background: rgb(226, 195, 156);
      .left {
        background: rgb(177, 203, 218);
        padding: 50px 20px 0 80px;
        a {
          display: block;
          font-size: 20px;
          color: #333333;
          width: 116px;
          height: 40px;
          line-height: 40px;
          span:nth-child(1) {
            margin-right: 10px;
          }
          &.active {
            border-bottom: 1px solid #2A9FE4;
            color: #2A9FE4;
          }
        }
      }
    }
    // 右边内容区域
    .nation-right-content {
      width: 100%;
      height: auto;
      background: rgb(193, 164, 204);
      .nation-right {
        width: 100%;
        padding: 50px;
        .right-header {
          width: 100%;
          padding-bottom: 20px;
          border-bottom: 1px solid #918c8c;
          display: flex;
          .right-img {
            width: 120px;
            height: 60px;
            border-radius: 8px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 8px;
            }
          }
          .introduce {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: 20px;
            p:nth-child(1) {
              font-size: 30px;
              font-weight: bold;
              color: #333333;
            }
            p {
              font-size: 20px;
              font-weight: bold;
              color: #999999;
            }
          }
        }
        .country-contents {
          background-color: #fff;
          margin-top: 50px;
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
                  width: 80px;
                  height: 40px;
                  background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
                  background-size: cover;
                  border-radius: 8px;
                }
              }
              p:nth-child(2) {
                width: 50%;
                i {
                  display: inline-block;
                  width: 80px;
                  height: 40px;
                  background: url('https://course-assets1.talkmate.com/course/icons/CHI-3x.webp?imageView2/2/w/120/h/120/format/jpg/q/100!/interlace/1') no-repeat center;
                  background-size: cover;
                  border-radius: 8px;
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
                  font-size: 16px;
                  color: #333333;
                  border-bottom: 1px solid #EAEAEA;
                  padding-bottom: 10px;
                  margin-bottom: 10px;
                  font-weight: bold;
                }
                .desc {
                  width: 90%;
                  font-size: 16px;
                  color: #999999;
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
                border-bottom: 1px solid #EBEBEB;
                margin-bottom: 20px;
                cursor: pointer;
                &:last-child {
                  border-bottom: 0px;
                }
                .country-img {
                  display: inline-block;
                  width: 50px;
                  height: 50px;
                  border-radius: 4px;
                  margin-right: 10px;
                  img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    border-radius: 4px;
                  }
                }
                .country-title {
                  display: inline-block;
                  font-size: 14px;
                  color: #444444;
                  padding-bottom: 15px;
                  line-height: 20px;
                  p:nth-child(1) {
                    font-size: 20px;
                    color: #333333;
                    font-weight: bold;
                    margin-bottom: 10px;
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
            }
          }
        }
      }
    }
  }
}
</style>
