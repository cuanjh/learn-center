<template>
  <div class="radio-classify">
    <div class="nav">
      <router-link :to="{path: '/app/index'}">
        <span>我的学习账户</span>
      </router-link>
      >
      <router-link :to="{path: '/app/discovery/radio-home'}">
        <span>电台课程</span>
      </router-link>
      >
      <div class="nav-current">
        分类
      </div>
    </div>
    <div class="classify-container">
      <div class="radio-content">
        <div class="left">
          <!-- 上面的导航 -->
          <div class="classify-content">
            <div class="tab-list">
              <div class="tab-box">
                <div class="tab">
                  <span @click="tabChange('hostRadio')"
                        :class="{'active': 'hostRadio' == navFlag}">热播电台</span>
                </div>
                <div class="tab">
                  <span @click="tabChange('learnRecom')"
                        :class="{'active': 'learnRecom' == navFlag}">学习推荐</span>
                </div>
                <div class="tab">
                  <span @click="tabChange('latestRelease')"
                        :class="{'active': 'latestRelease' == navFlag}">最新发布</span>
                </div>
              </div>
            </div>
            <!-- 切换内容区域 -->
            <div class="classify-switch">
              <div class="switch-content">
                <!-- 热播电台 -->
                <div class="switch-radio" v-if="'hostRadio' == navFlag">
                  <div class="host-content" v-if="hostRadios">
                    <div class="radio-li" v-for="(radio, index) in hostRadios" :key="index">
                      <div class="radio-li-left">
                        <div class="play-radio">
                          <img :src="radio.cover" alt="背景图片">
                          <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                            <i class="play"></i>
                          </div>
                        </div>
                        <div class="text-author">
                          <router-link tag="p" class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}"><span>{{radio.title}}</span></router-link>
                          <p class="author-text">
                            <span>作者：{{radio.author_name}}</span>
                            <span><i></i>{{radio.buy_num}}</span>
                            <span v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' + radio.money : $t('coins') + ' ' + radio.money"></span>
                          </p>
                        </div>
                      </div>
                      <div class="more-icon" v-show="false">
                        <i></i>
                      </div>
                    </div>
                    <div class="radio-num">
                      <span>共{{hotCountNum}}个电台节目</span>
                    </div>
                  </div>
                  <div class="up-all">
                    <span v-if="showMoreHost === -1">已显示全部内容</span>
                    <span @click="changeHostRadio(hostRadioLists)" v-else>全部展开<i></i></span>
                  </div>
                </div>
                <!-- 推荐课程 -->
                <div class="switch-radio" v-if="'learnRecom' == navFlag">
                  <div class="host-content">
                    <div class="radio-li" v-for="(radio, index) in recommendRadios" :key="index">
                      <div class="radio-li-left">
                        <div class="play-radio">
                          <img v-lazy="radio.cover" :key="radio.cover" alt="背景图片">
                          <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                            <i class="play"></i>
                          </div>
                        </div>
                        <div class="text-author">
                          <!-- <p class="title">日语官方课程高级C2讲解</p> -->
                          <router-link tag="p" :to="{path: '/app/discovery/radio-detail/' + radio.code}" class="title"><span>{{radio.module_name}}</span></router-link>
                          <p class="author-text">
                            <span>作者：{{radio.author.nickname}}</span>
                            <span><i></i>{{radio.buy_num}}</span>
                            <!-- <span>免费</span> -->
                            <span v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></span>
                          </p>
                        </div>
                      </div>
                      <div class="more-icon" v-show="false">
                        <i></i>
                      </div>
                      <div class="radio-num">
                        <span>共{{recommendCountNum}}个电台节目</span>
                      </div>
                    </div>
                  </div>
                  <div class="up-all">
                    <span v-if="showMore === -1">已显示全部内容</span>
                    <span @click="changeBatch()" v-else>全部展开<i></i></span>
                  </div>
                </div>
                <!-- 最新发布 -->
                <div class="switch-radio" v-if="'latestRelease' == navFlag">
                  <div class="host-content" v-if="releaseRadio">
                    <div class="radio-li" v-for="(radio, index) in releaseRadio" :key="index">
                      <div class="radio-li-left">
                        <div class="play-radio">
                          <img :src="radio.cover" alt="背景图片">
                          <div class="gradient-layer-play"  @click="loadRadioList($event, radio)">
                            <i class="play"></i>
                          </div>
                        </div>
                        <div class="text-author">
                          <router-link tag="p" class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}"><span>{{radio.title}}</span></router-link>
                          <p class="author-text">
                            <span>作者：{{radio.author_name}}</span>
                            <span><i></i>{{radio.buy_num}}</span>
                            <span v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' + radio.money : $t('coins') + ' ' + radio.money"></span>
                          </p>
                        </div>
                      </div>
                      <div class="more-icon" v-show="false">
                        <i></i>
                      </div>
                    </div>
                    <div class="radio-num">
                      <span>共{{latestCountNum}}个电台节目</span>
                    </div>
                  </div>
                  <div class="up-all">
                    <span v-if="showMoreRelease === -1">已显示全部内容</span>
                    <span @click="changeReleaseRadio(latestReleaseRadio)" v-else>全部展开<i></i></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <star-host-list :teacherLists="teacherLists"></star-host-list>
          <introduce-app-box></introduce-app-box>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Bus from '../../../../bus'
import $ from 'jquery'
import StarHostList from '../../../common/starHostList.vue'
import IntroduceAppBox from '../../../common/introduceAppBox.vue'

export default {
  data () {
    return {
      showMore: 0,
      showMoreHost: 0,
      showMoreRelease: 0,
      selState: {},
      navFlag: 'hostRadio',
      hostRadioLists: {}, // 热播电台
      hostRadios: [],
      hotCountNum: '',
      latestReleaseRadio: {}, // 最新发布
      releaseRadio: [],
      latestCountNum: '',
      teacherLists: [], // 主播推荐
      recommendRadios: [],
      recommendCountNum: '',
      page: 1
    }
  },
  mounted () {
    let _this = this
    console.log('课程', _this.langCode)
    _this.getLangsState()
    _this.navFlag = _this.paramsFlag ? _this.paramsFlag : 'hostRadio'
    _this.postDisvRadio().then((res) => {
      console.log('电台首页=====>', res)
      _this.hostRadioLists = res.data.menuRadios[0]
      _this.latestReleaseRadio = res.data.menuRadios[1]
      _this.teacherLists = res.data.authors
      _this.initHotRadio(this.hostRadioLists)
      _this.initReleaseRadio(this.latestReleaseRadio)
    })
    let params = {}
    if (!_this.userInfo) {
      params = {
        lan_code: '',
        limit: 10,
        page: _this.page
      }
    } else {
      params = {
        lan_code: _this.langCode.lan_code,
        limit: 10,
        page: _this.page
      }
    }
    _this.getRecommendRadiosIndex(params).then(res => {
      console.log('推荐电台数据', res)
      this.recommendRadios = res.data
      this.recommendCountNum = res.count
      this.showMore = res.page
    })
  },
  components: {
    StarHostList,
    IntroduceAppBox
  },
  computed: {
    ...mapState({
      langsStateSel: state => state.langsStateSel, // 优先课程
      userInfo: state => state.userInfo // 用户信息
      // recommendRadioPage: state => state.recommendRadioPage, // 页数
      // recommendRadios: state => state.recommendRadios // 推荐的电台
    }),
    paramsFlag () {
      return this.$route.params.isActive
    },
    langCode () {
      if (!Object.keys(this.langsStateSel).length) {
        return []
      }
      return this.langsStateSel[0]
    },
    selStateText () {
      if (Object.keys(this.selState).length > 0) {
        return this.selState['text']
      } else {
        if (this.langsStateSel && this.langsStateSel.length > 0) {
          return this.langsStateSel[0]['text']
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    ...mapActions({
      getLangsState: 'getLangsState',
      getRecommendRadiosIndex: 'getRecommendRadiosIndex', // 推荐的电台
      getRadioList: 'course/getRadioList', // 电台列表加载更多
      postDisvRadio: 'course/postDisvRadio' // 电台首页
    }),
    tabChange (tabFlag) {
      this.navFlag = tabFlag
    },
    // 点击播放电台
    loadRadioList (e, radio) {
      console.log('e', e)
      console.log('radio', radio)
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
    // 默认热播电台列表
    initHotRadio (radio) {
      let params = {
        menu_type: radio.menu_type,
        menu_id: radio.menu_id,
        page: this.page
      }
      this.getRadioList(params).then(res => {
        console.log('热播列表', res)
        this.hostRadios = res.data.radios
        this.hotCountNum = res.data.count
        this.showMoreHost = res.data.page
      })
    },
    // 加载更多热播电台
    changeHostRadio (radio) {
      if (this.showMoreHost === -1) {
        return false
      }
      this.page++
      let params = {
        menu_type: radio.menu_type,
        menu_id: radio.menu_id,
        page: this.page
      }
      console.log('点击加载更多params', params)
      this.getRadioList(params).then((res) => {
        console.log('点击加载更多热播电台', res)
        this.hostRadios = this.hostRadios.concat(res.data.radios)
        if (res.data.page === -1) {
          this.showMoreHost = res.data.page
          return false
        }
      })
    },
    // 加载更多推荐课程
    changeBatch () {
      if (this.showMore === -1) {
        return false
      }
      this.page++
      let params = {}
      if (!this.userInfo) {
        params = {
          lan_code: '',
          limit: 10,
          page: this.page
        }
      } else {
        params = {
          lan_code: this.langCode.lan_code,
          limit: 10,
          page: this.page
        }
      }
      this.getRecommendRadiosIndex(params).then(res => {
        console.log('推荐电台数据', res)
        this.recommendRadios = this.recommendRadios.concat(res.data)
        if (res.page === -1) {
          this.showMore = res.page
          return false
        }
      })
    },
    // 默认最新发布列表
    initReleaseRadio (radio) {
      let params = {
        menu_type: radio.menu_type,
        menu_id: radio.menu_id,
        page: this.page
      }
      this.getRadioList(params).then(res => {
        console.log('最新发布列表', res)
        this.releaseRadio = res.data.radios
        this.latestCountNum = res.data.count
        this.showMoreRelease = res.data.page
      })
    },
    // 加载更多最新课程
    changeReleaseRadio (radio) {
      if (this.showMoreRelease === -1) {
        return false
      }
      this.page++
      let params = {
        menu_type: radio.menu_type,
        menu_id: radio.menu_id,
        page: this.page
      }
      console.log('点击加载更多params', params)
      this.getRadioList(params).then((res) => {
        console.log('res======>', res)
        this.releaseRadio = this.releaseRadio.concat(res.data.radios)
        if (res.data.page === -1) {
          this.showMoreRelease = res.data.page
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.radio-classify {
  width: 1200px;
  margin: 0 auto;
  min-height: 1000px;
  .nav {
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    display: inline-block;
    font-size: 16px;
    a {
      span {
        color: #999999;
        &:hover{
          color: #2A9FE4;
        }
      }
    }
    .nav-current {
      display: inline-block;
      color: #2A9FE4;
    }
  }
  .classify-container {
    width: 100%;
    .radio-content {
      width: 100%;
      display: flex;
      .left {
        position: relative;
        width: 880px;
        background: #ffffff;
        margin-right: 20px;
        .classify-content {
          padding: 30px 42px;
          width: 100%;
          // 导航
          .tab-list {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 6px;
            border-bottom: 4px solid #EEF2F3FF;
            .tab-box {
              // position: absolute;
              // bottom: -4px;
              .tab {
                position: relative;
                display: inline-block;
                width: 80px;
                margin-right: 34px;
                span {
                  position: absolute;
                  font-size: 12px;
                  line-height: 20px;
                  font-weight: bold;
                  color: #0A2B40FF;
                  padding-bottom: 8px;
                  cursor: pointer;
                  &.active {
                    border-bottom: 4px solid #2A9FE4FF;
                    font-size: 20px;
                    color: #2A9FE4FF;
                  }
                }
              }
            }
          }
          // 切换区域
          .classify-switch {
            width: 100%;
            .switch-content {
              padding-top: 40px;
              .switch-radio {
                .host-content {
                  .radio-li {
                    padding: 20px 0;
                    border-bottom: 1px solid #EEF2F3FF;
                    .radio-li-left {
                      // display: inline-block;
                      display: flex;
                      align-items: center;
                      .play-radio {
                        display: inline-block;
                        position: relative;
                        display: block;
                        width: 152px;
                        height: 80px;
                        margin-right: 16px;
                        img {
                          width: 100%;
                          height: 100%;
                          border-radius: 4px;
                          object-fit: cover;
                        }
                        .gradient-layer-play {
                          cursor: pointer;
                          width: 24px;
                          height: 24px;
                          position: absolute;
                          bottom: 5px;
                          right: 5px;
                          text-align:  center;
                          z-index: 2;
                          .play {
                            width: 24px;
                            height:24px;
                            background-image: url('../../../../../static/images/radionoPlay.svg');
                            background-repeat: no-repeat;
                            background-size: cover;
                            display: inline-block;
                          }
                          .pause {
                            width: 24px;
                            height: 24px;
                            background-image: url('../../../../../static/images/radioPlay.svg');
                            background-repeat: no-repeat;
                            background-size: cover;
                            display: inline-block;
                          }
                        }
                      }
                      .text-author {
                        display: inline-block;
                        // display: flex;
                        // flex-direction: column;
                        // justify-content: space-around;
                        padding: 10px 0;
                        p {
                          display: block;
                        }
                        .title {
                          width: 160px;
                          cursor: pointer;
                          font-size: 14px;
                          color: #333333FF;
                          font-weight: bold;
                          padding-bottom: 26px;
                          overflow: hidden;
                          text-overflow:ellipsis;
                          white-space: nowrap;
                        }
                        .author-text {
                          font-size: 12px;
                          color: #B8B8B8FF;
                          span:nth-child(1) {
                            display:inline-block;
                            width: 132px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                          }
                          span:nth-child(2) {
                            display: inline-block;
                            padding-left: 10px;
                            min-width: 100px;
                            i {
                              display: inline-block;
                              width: 18px;
                              height: 12px;
                              background-image: url('../../../../../static/images/listening.png');
                              background-repeat: no-repeat;
                              background-size: cover;
                              margin: 6px 10px 0 0;
                            }
                          }
                        }
                      }
                    }
                    .more-icon {
                      i {
                        display: inline-block;
                        width: 16px;
                        height: 10px;
                        background-image: url('../../../../../static/images/radioPlay.svg');
                        background-repeat: no-repeat;
                        background-size: cover;
                        cursor: pointer;
                      }
                    }
                  }
                  .radio-li:first-child {
                    padding-top: 0px;
                  }
                  .radio-li:last-child {
                    border-bottom: none;
                  }
                }
                .radio-num {
                  position: absolute;
                  top: 30px;
                  right: 40px;
                  font-size: 14px;
                  color: #90A2AEFF;
                }
                .up-all {
                  position: absolute;
                  bottom: 0;
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
                    background: url('../../../../../static/images/upAll.svg') no-repeat center;
                    background-size: cover;
                    margin-left: 10px;
                  }
                  .active {
                    display: inline-block;
                    width: 10px;
                    height: 6px;
                    background: url('../../../../../static/images/upAllActive.svg') no-repeat center;
                    background-size: cover;
                    margin-left: 10px;
                  }
                }
              }
            }
          }
        }
      }
      .right {
        width: 280px;
        // height: 440px;
      }
    }
  }
}
</style>
