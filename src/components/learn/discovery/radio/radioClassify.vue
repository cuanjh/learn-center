<template>
  <div class="radio-classify">
    <div class="nav">
      <router-link :to="{path: '/app/user/course'}">
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
                <div class="switch-radio" v-if="'hostRadio' == navFlag">
                  <div class="host-content" v-if="hostRadioLists[0]">
                    <div class="radio-li" v-for="(radio, index) in hostRadioLists[0].radios" :key="index">
                      <div class="radio-li-left">
                        <div class="play-radio">
                          <img :src="radio.cover" alt="背景图片">
                          <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                            <i class="play"></i>
                          </div>
                        </div>
                        <div class="text-author">
                          <router-link tag="p" class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}">{{radio.title}}</router-link>
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
                      <span>共{{hostRadioLists[0].radios.length}}个电台节目</span>
                    </div>
                  </div>
                  <div class="up-all">
                    <span>全部展开</span>
                    <i ></i>
                  </div>
                </div>
                <div class="switch-radio" v-if="'learnRecom' == navFlag">
                  <div class="host-content">
                    <div class="radio-li">
                      <div class="radio-li-left">
                        <div class="play-radio">
                          <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5b74e4432152c797519a092a/5b74e4432152c797519a092a.jpg?hash=FlbsyYkEr9WFXYJD0n7SfjqP1nWI" alt="背景图片">
                          <div class="gradient-layer-play">
                            <i class="play"></i>
                          </div>
                        </div>
                        <div class="text-author">
                          <p class="title">日语官方课程高级C2讲解</p>
                          <p class="author-text">
                            <span>作者：叶圣陶</span>
                            <span><i></i>46435</span>
                            <span>免费</span>
                          </p>
                        </div>
                      </div>
                      <div class="more-icon">
                        <i></i>
                      </div>
                    </div>
                  </div>
                  <div class="up-all">
                    <span>全部展开</span>
                    <i ></i>
                  </div>
                </div>
                <div class="switch-radio" v-if="'latestRelease' == navFlag">
                  <div class="host-content" v-if="latestReleaseRadio[0]">
                    <div class="radio-li" v-for="(radio, index) in latestReleaseRadio[0].radios" :key="index">
                      <div class="radio-li-left">
                        <div class="play-radio">
                          <img :src="radio.cover" alt="背景图片">
                          <div class="gradient-layer-play"  @click="loadRadioList($event, radio)">
                            <i class="play"></i>
                          </div>
                        </div>
                        <div class="text-author">
                          <router-link tag="p" class="title" :to="{path: '/app/discovery/radio-detail/' + radio.code}">{{radio.title}}</router-link>
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
                      <span>共{{latestReleaseRadio[0].radios.length}}个电台节目</span>
                    </div>
                  </div>
                  <div class="up-all">
                    <span>全部展开</span>
                    <i ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <star-host-list></star-host-list>
          <introduce-app-box></introduce-app-box>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Bus from '../../../../bus'
import $ from 'jquery'
import StarHostList from '../../../common/starHostList.vue'
import IntroduceAppBox from '../../../common/introduceAppBox.vue'

export default {
  data () {
    return {
      navFlag: 'hostRadio',
      hostRadioLists: [], // 热播电台
      latestReleaseRadio: [] // 最新发布
    }
  },
  mounted () {
    console.log('paramsFlag', this.paramsFlag)
    this.navFlag = this.paramsFlag
    this.postDisvRadio().then((res) => {
      console.log('电台首页', res)
      this.hostRadioLists.push(res.data.menuRadios[0])
      this.latestReleaseRadio.push(res.data.menuRadios[1])
      console.log(this.latestReleaseRadio)
    })
  },
  components: {
    StarHostList,
    IntroduceAppBox
  },
  computed: {
    paramsFlag () {
      return this.$route.query.isActive
    }
  },
  methods: {
    ...mapActions({
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
    margin: 24px 0 12px 0;
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
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 40px;
                    .radio-li-left {
                      display: flex;
                      .play-radio {
                        position: relative;
                        display: block;
                        width: 152px;
                        height: 80px;
                        margin-right: 16px;
                        img {
                          width: 100%;
                          height: 100%;
                          border-radius: 4px;
                        }
                        .gradient-layer-play {
                          cursor: pointer;
                          width: 24px;
                          height: 24px;
                          position: absolute;
                          bottom: 10px;
                          right: 10px;
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
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        .title {
                          cursor: pointer;
                          font-size: 14px;
                          color: #333333FF;
                          font-weight: bold;
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
                            padding-left: 32px;
                            padding-right: 74px;
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
                  display: flex;
                  justify-content: center;
                  align-items: center;
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
        width: 300px;
        height: 440px;
      }
    }
  }
}
</style>
