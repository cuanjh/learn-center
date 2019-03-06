<template>
  <div class="author">
    <div class="author-content">
      <div class="autor-header">
        <div class="author-top">
          <div class="background"></div>
          <div class="detail">
            <div class="left">
              <ul>
                <li>
                  <span>全球说ID</span>
                  <span>{{authorInfo.talkmate_id}}</span>
                </li>
                <li class="line"></li>
                <li>
                  <span>精通语言</span>
                  <span>{{language}}</span>
                </li>
                <li class="line"></li>
                <li>
                  <span>金币数量</span>
                  <span>{{authorInfo.coins}}</span>
                </li>
              </ul>
            </div>
            <div class="right">
              <ul>
                <li>
                  <span>Ta的关注</span>
                  <span>{{authorInfo.follow_num}}</span>
                </li>
                <li class="line"></li>
                <li>
                  <span>Ta的粉丝</span>
                  <span>{{authorInfo.be_followed_num}}</span>
                </li>
                <li class="line"></li>
                <li>
                  <span>国家/地区</span>
                  <span>{{authorInfo.country_name}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="author-bottom">
          <div class="user-photo">
            <img v-lazy="authorInfo.photo" alt="头像">
          </div>
          <div class="author-user">
            <div class="sex">
              <p>{{authorInfo.nickname}}</p>
              <div class="cont">
                <p class="bg">
                  <i class="gender" v-if="authorInfo.gender === 'female'"></i>
                  <i class="man" v-else></i>
                </p>
                <span class="age">{{authorInfo.age}}</span>
                <span class="course">精通:{{language}}</span>
              </div>
            </div>
            <div class="pay" @click="relation()">
              <p>
                <!-- <span v-text="text"></span> -->
                <span v-if="authorInfo.has_followed === false">关注</span>
                <span v-else>取消关注</span>
              </p>
              <!-- <p><span>私信</span></p> -->
            </div>
          </div>
          <div class="tab-item">
            <span v-bind:class="{'active': 'radio' == tabFlag}" @click="tabChange('radio')">Ta的电台</span>
            <span v-bind:class="{'active': 'dynamic' == tabFlag}" @click="tabChange('dynamic')">动态</span>
          </div>
        </div>
      </div>
      <!-- 下面的电台列表 动态列表-->
      <div class="autor-radio">
        <div class="autor-content">
          <!-- 电台 -->
          <div class="radio-list" v-show="'radio' == tabFlag">
            <div v-if="radios.length>0" class="out-list">
              <div class="radio-item" v-for="(item, index) in radios" :key="index">
                <div class="item">
                  <a @mouseenter="radioMouseEnter($event, item, index)" @mouseleave="radioMouseLeave($event, item, index)">
                    <img v-lazy="item.cover" :key="item.cover" alt="背景图片">
                    <!-- 判断不免费并且不是会员的时候 -->
                    <div  class="gradient-layer-play-no"
                          v-if="item.money !== 0 && parseInt(isVip) !== 1"
                          @click="loadNoRadioList($event, item)">
                      <i class="play-no" v-if="index>number"></i>
                    </div>
                    <div  class="buy-cny"
                          v-if="item.money !== 0 && item.money_type === 'CNY' && parseInt(isVip) === 1 && item.free_for_member === false"
                          @click="loadNoRadioList($event, item)">
                      <i class="play-no" v-if="index>number"></i>
                    </div>
                    <!-- <div class="gradient-layer-play-no" style="display: none">
                      <i class="play-no"></i>
                    </div> -->
                    <div  class="gradient-layer-play"
                          style="display: none"
                          @click="loadRadioList($event, item)">
                      <i class="play"></i>
                    </div>
                    <div class="subscribe">
                      <i></i>
                      <span >{{item.buy_num}}</span>
                    </div>
                  </a>
                  <router-link tag="div" :to="{path: '/app/discovery/radio-detail/' + item.code}" class="title" v-text="item.title"></router-link>
                  <div class="author" v-text="item.author_name ? item.author_name : '用户' + item.talkmate_id"></div>
                  <div class="money" v-text="(item.money === 0) ? $t('free') : (item.money_type === 'CNY') ? '￥' +item.money : $t('coins') + ' ' + item.money"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 动态 -->
          <div class="dynamic-list" v-show="'dynamic' == tabFlag">
            <div v-if="feedInfos.length>0">
              <div class="dynamic-item" v-for="(feedInfo, index) in feedInfos" :key="index">
                <authorItem :feedInfo="feedInfo" v-if="feedInfo.rewardLists"/>
              </div>
            </div>
            <div v-else>
              <div class="no-dynamic">
                <div class="no-img"></div>
                <div class="text">Ta学习太忙了，稍后会来分享动态~~~</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nolock-test-check" v-show="nolockTestCheckShow">
      <div class="animated flipInX" v-show="nolockTestCheckShow">
        <span v-html="tips"></span>
        <i></i>
        <p class="buttons">
          <span class="goBackCore" @click="goBack">取消</span>
          <!-- <span class="goBackCore">购买</span> -->
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import authorItem from './authorItem'
import Bus from '../../../../bus'
import $ from 'jquery'

export default {
  data () {
    return {
      nolockTestCheckShow: false,
      flag: true,
      type: 0, // 正常 1回复
      tabFlag: 'radio', // true Ta的电台 false 动态
      authorInfo: {}, // 作者信息
      language: '', // 精通语言
      userId: '',
      radios: [], // 电台列表
      page: 1,
      tips: '',
      number: 2
      // isVip: Cookie.getCookie('isVip')
    }
  },
  components: {authorItem},
  computed: {
    ...mapState({
      feedInfos: state => state.course.feedInfos, // 动态列表
      userInfo: state => state.userInfo // 用户信息
    }),
    isVip () {
      if (!this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    }
  },
  mounted () {
    console.log('isVip', this.isVip)
    console.log('111', this.isVip)
    let _this = this
    _this.userId = _this.$route.params.userId
    console.log('userId', _this.userId)
    // 作者信息
    _this.getAuthorDetail({ partner_user_id: _this.userId }).then(data => {
      console.log('作者信息', data)
      _this.authorInfo = data.detail
      _this.language = data.detail.language_skill.length > 0 ? data.detail.language_skill.join(',') : '暂无'
      console.log('authorInfo', _this.authorInfo)
      console.log('language', _this.language)
    })
    // 电台列表
    _this.getRadioAuthorList({ partner_user_id: _this.userId, page: _this.page }).then((data) => {
      console.log('电台列表', data)
      if (data.data.radios) {
        _this.radios = data.data.radios
      }
    })
    // 动态列表
    _this.getRadioAuthorDynamic({ partner_user_id: _this.userId, page: _this.page, has_homework: 'Y' })
  },
  methods: {
    ...mapActions({
      getAuthorDetail: 'course/getAuthorDetail', // 作者的详情
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel', // 取消关注
      getRadioAuthorList: 'course/getRadioAuthorList', // 作者电台列表
      getRadioAuthorDynamic: 'course/getRadioAuthorDynamic' // 作者的动态
    }),
    // 关注
    relation () {
      let _this = this
      let followId = _this.authorInfo.user_id
      if (_this.authorInfo.has_followed === true) { // 关注了
        console.log('关注了')
        _this.remRadioRelationCancel({following_id: followId}).then((data) => {
          console.log('取消关注', data)
          if (data.success === true) {
            // _this.text = '关注'
            _this.authorInfo.has_followed = false
          }
        })
      } else if (_this.authorInfo.has_followed === false) { // 没关注
        console.log('没关注')
        _this.getRadioRelationFollow({following_id: followId}).then((data) => {
          console.log('关注', data)
          if (data.success === true) {
            // _this.text = '取消关注'
            _this.authorInfo.has_followed = true
          }
        })
      }
    },
    // 电台和动态的bunner切换
    tabChange (tabFlag) {
      this.tabFlag = tabFlag
    },
    // 能播放的列表点击播放
    loadRadioList (e, item) {
      if (this.isPlay && item.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
        $(e.target).addClass('play')
        Bus.$emit('radioPause')
      } else {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target).removeClass('play')
        $(e.target).addClass('pause')
        $('.gradient-layer-play').not($(e.target).parent()).hide()
        if (item.code !== this.lastCode) {
          Bus.$emit('getRadioCardList', item)
          this.lastCode = item.code
        } else {
          Bus.$emit('radioPlay')
        }
      }
      this.isPlay = !this.isPlay
    },
    // 不能播放的列表点击提示购买课程
    loadNoRadioList (e, item) {
      this.tips = '收费课程需要购买才能听哦(升级为会员免费)'
      this.nolockTestCheckShow = true
    },
    goBack () {
      this.nolockTestCheckShow = false
    },
    radioMouseEnter (e, item, index) {
      // 课程不免费
      if (item.money !== 0) {
        // 是否会员
        if (parseInt(this.isVip) === 1) {
          if (item.money_type === 'CNY') {
            if (item.free_for_member === false) {
              // 会员不免费
              if (index <= this.number) {
                $('.gradient-layer-play', $(e.target)).show()
              }
              $('.buy-cny', $(e.target)).show()
            } else {
              $('.gradient-layer-play', $(e.target)).show()
            }
          } else {
            $('.gradient-layer-play', $(e.target)).show()
          }
        } else {
          // 不是会员
          if (index > this.number) {
            $('.gradient-layer-play-no', $(e.target)).show()
          } else {
            $('.gradient-layer-play', $(e.target)).show()
          }
        }
      } else {
        $('.gradient-layer-play', $(e.target)).show()
      }
    },
    radioMouseLeave (e) {
      if ($('.gradient-layer-play i', $(e.target)).hasClass('play')) {
        $('.gradient-layer-play', $(e.target)).hide()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.author {
  width: 100%;
  .author-content {
    width: 100%;
    .autor-header {
      width: 100%;
      .author-top {
        position: relative;
        width: 100%;
        height: 344px;
        .background {
          height: 344px;
          background: url("../../../../../static/images/headline/background.png")
            no-repeat center;
          background-size: cover;
        }
        .detail {
          position: absolute;
          bottom: 25px;
          left: 50%;
          margin-left: -590px;
          width: 1180px;
          display: flex;
          justify-content: space-between;
          .left,
          .right {
            width: 480px;
          }
          ul {
            display: flex;
            justify-content: space-around;
            li {
              display: inline-block;
              span {
                display: block;
              }
              span:nth-child(1) {
                text-align: center;
                font-size: 14px;
                color: #b5b5b5;
                margin-bottom: 16px;
              }
              span:nth-child(2) {
                font-size: 24px;
                color: #ffffff;
                text-align: center;
              }
            }
            .line {
              background: #b1b1b1;
              width: 2px;
              height: 30px;
              margin-top: 15px;
            }
          }
        }
      }
      .author-bottom {
        position: relative;
        width: 100%;
        height: 285px;
        background: #ffffff;
        .user-photo {
          position: absolute;
          top: -60px;
          left: 50%;
          margin-left: -64px;
          width: 128px;
          height: 128px;
          background: #ffffff;
          border-radius: 50%;
          text-align: center;
          vertical-align: middle;
          img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            vertical-align: middle;
            margin-top: 4px;
          }
        }
        .author-user {
          display: inline-block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .sex {
            font-size: 0;
            margin-bottom: 22px;
            p {
              font-size: 24px;
              color: #444444;
              margin: 13px 0 5px 0;
              text-align: center;
            }
            span {
              font-size: 12px;
              color: #afafaf;
              line-height: 51px;
            }
            .cont {
              text-align: center;
              .bg {
                display: inline-block;
                width: 16px;
                height: 26px;
                .gender {
                  display: inline-block;
                  width: 16px;
                  height: 26px;
                  background: url("../../../../../static/images/headline/gendermalse.png") no-repeat center;
                  background-size: 100%;
                }
                .man {
                  display: inline-block;
                  width: 16px;
                  height: 26px;
                  background: url("../../../../../static/images/headline/man.png") no-repeat center;
                  background-size: 100%;
                }
              }
              .age {
                padding: 0 10px;
                border-right: 1px solid #d8d8d8;
              }
              .course {
                padding-left: 10px;
              }
            }
          }
          .pay {
            cursor: pointer;
            width: 120px;
            height: 36px;
            background: #2a9fe4;
            font-size: 14px;
            color: #ffffff;
            text-align: center;
            line-height: 36px;
            border-radius: 30px;
            margin: 0 auto;
          }
        }
        .tab-item {
          width: 240px;
          height: 40px;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -120px;
          display: flex;
          justify-content: space-around;
        }
        .tab-item span {
          font-size: 16px;
          color: #333333;
          cursor: pointer;
          padding: 0px 0px 12px;
        }
        .tab-item .active {
          color: #0581d1;
          border-bottom: 4px solid #0581d1;
          /* transition: all .5s linear; */
        }
      }
    }
  }
}
// 弹框提示
.nolock-test-check{
  position:fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 61, 90, .9);
  z-index:99999999;
  overflow: hidden;
}

.nolock-test-check .animated {
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

.nolock-test-check .animated i{
  position:absolute;
  width:110px;
  height:110px;
  padding:26px;
  border-radius:55px;
  top:0px;
  left:50%;
  margin-left:-55px;
  margin-top:-55px;
  background:url('../../../../../static/images/learn/learn-vip-warn.png') #fff center center no-repeat;
  background-size:86%;
}
.nolock-test-check .animated span {
  display: inline-block;
  width: 200px;
}
.nolock-test-check .animated .goBackCore {
  width: 100px;
  height: 40px;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  background-color: #fd8469;
}
.nolock-test-check .animated .buttons {
  width: 300px;
  height: 40px;
  position: absolute;
  bottom: 30px;
  display: flex;
  justify-content: space-around;
}
// 电台动态
.autor-radio {
  width: 100%;
  margin-bottom: 20px;
  .autor-content {
    width: 1180px;
    margin: 0 auto;
    min-height: 800px;
    // 电台
    .radio-list {
      // display: flex;
      // flex-wrap: wrap;
      .out-list {
        display: flex;
        flex-wrap: wrap;
      }
      .radio-item {
        margin-top: 20px;
        width: 220px;
        height: 223px;
        background-color: #ffffff;
        margin-right: 16px;
        .item {
          width: 220px;
          height: 223px;
          background-color: #ffffff;
          margin-right: 16px;
          a {
            display: inline-block;
            width: 100%;
            height: 120px;
            img {
              width: 100%;
              height: 120px;
              object-fit: cover;
              border-radius: 4px;
            }
            .gradient-layer-play {
              width: 220px;
              height: 120px;
              position: absolute;
              background-image: url('../../../../../static/images/discovery/radio-gradient-layer.png');
              background-repeat: no-repeat;
              background-size: cover;
              margin-top: -120px;
              text-align:  center;
              z-index: 2;
              .play {
                width: 52px;
                height: 52px;
                background-image: url('../../../../../static/images/discovery/radio-list-play.svg');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
                margin-top: 30px;
              }
              .pause {
                width: 52px;
                height: 52px;
                background-image: url('../../../../../static/images/discovery/radio-list-pause.svg');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
                margin-top: 30px;
              }
            }
            .gradient-layer-play-no {
              width: 220px;
              height: 120px;
              position: absolute;
              margin-top: -120px;
              text-align:  center;
              z-index: 2;
              .play-no {
                width: 100%;
                height: 100%;
                background-image: url('../../../../../static/images/learn/learn-course-little-bg.png');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
              }
            }
            .buy-cny {
              width: 220px;
              height: 120px;
              position: absolute;
              margin-top: -120px;
              text-align:  center;
              z-index: 2;
              .play-no {
                width: 100%;
                height: 100%;
                background-image: url('../../../../../static/images/learn/learn-course-little-bg.png');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
              }
            }
            .subscribe {
              position: relative;
              display: -webkit-box;
              margin-top: -25px;
              i {
                display: inline-block;
                margin: 0 8px;
                width: 14px;
                height: 14px;
                background-image: url('../../../../../static/images/discovery/home-radio.png');
                background-repeat: no-repeat;
                background-size: cover;
              }
              span {
                color: #ffffff;
                font-size: 12px;
                display: inline-block;
                margin-top: -5px;
                margin-left: -3px;
              }
            }
          }
          .item-disabled {
            cursor: not-allowed;
          }
          .title {
            cursor: pointer;
            color: #444444;
            font-size: 14px;
            margin-top: 15px;
            height: 41px;
            line-height: 20px;
            word-break: break-all;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            padding: 0 10px;
            font-weight: bold;
          }
          .author {
            color: #B8B8B8;
            font-size: 12px;
            display: inline-block;
            position: relative;
            margin-top: 10px;
            width: 110px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding-left: 10px;
          }
          .money {
            color: #B8B8B8;
            font-size: 12px;
            float: right;
            /* display: inline-block; */
            position: relative;
            margin-top: 10px;
            padding-right: 10px;
          }
        }
        /* a {
          display: inline-block;
          width: 100%;
          height: 120px;
          img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 4px;
          }
          .gradient-layer-play {
            width: 220px;
            height: 120px;
            position: absolute;
            background-image: url('../../../../../static/images/discovery/radio-gradient-layer.png');
            background-repeat: no-repeat;
            background-size: cover;
            margin-top: -120px;
            text-align:  center;
            z-index: 2;
            .play {
              width: 52px;
              height: 52px;
              background-image: url('../../../../../static/images/discovery/radio-list-play.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-top: 30px;
            }
            .pause {
              width: 52px;
              height: 52px;
              background-image: url('../../../../../static/images/discovery/radio-list-pause.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-top: 30px;
            }
          }
          .subscribe {
            position: relative;
            display: -webkit-box;
            margin-top: -25px;
            i {
              display: inline-block;
              margin: 0 8px;
              width: 14px;
              height: 14px;
              background-image: url('../../../../../static/images/discovery/home-radio.png');
              background-repeat: no-repeat;
              background-size: cover;
            }
            span {
              color: #ffffff;
              font-size: 12px;
              display: inline-block;
              margin-top: -5px;
              margin-left: -3px;
            }
          }
        }
        .title {
          color: #444444;
          font-size: 14px;
          margin-top: 15px;
          height: 41px;
          line-height: 20px;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          padding: 0 10px;
          font-weight: bold;
        }
        .author {
          color: #B8B8B8;
          font-size: 12px;
          display: inline-block;
          position: relative;
          margin-top: 10px;
          width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-left: 10px;
        }
        .money {
          color: #B8B8B8;
          font-size: 12px;
          float: right;
          //display: inline-block;
          position: relative;
          margin-top: 10px;
          padding-right: 10px;
        } */
      }
      .noradio-img {
        width: 300px;
        height: 300px;
        background: url('../../../../../static/images/headline/noradio.jpg') no-repeat center;
        background-size: cover;
        margin: 50px auto 0;
      }
      .text {
        font-size: 26px;
        color: #B8B8B8;
        text-align: center;
        margin-top: 50px;
      }
    }
    // 动态
    .dynamic-list {
      width: 900px;
      margin: 0 auto;
      .dynamic-item {
        width: 100%;
        padding: 29px;
        margin-top: 20px;
        background: #ffffff;
      }
      .no-dynamic {
        width: 100%;
        min-height: 600px;
        margin-top: 20px;
        padding: 29px;
        background: #ffffff;
        .no-img {
          width: 300px;
          height: 300px;
          background: url('../../../../../static/images/headline/nodynamic.jpg') no-repeat center;
          background-size: cover;
          margin: 50px auto 0;
        }
        .text {
          font-size: 26px;
          color: #B8B8B8;
          text-align: center;
          margin-top: 50px;
        }
      }
    }
  }
}

</style>
