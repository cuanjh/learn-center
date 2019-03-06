<template>
  <div class="my-radio">
    <div class="title" v-show="false">
      电台课程
    </div>
    <div class="content">
      <div class="radio-player">
        <div class="title"><i></i>推荐电台</div>
        <div class="radio-control">
          <a class="lang-sel" @mouseleave="isShowPanel = false" v-if="userId && curCourseCode">
            <span @mouseenter="isShowPanel = true">{{ selStateText }} <i></i></span>
            <div class="lang-list" v-show="isShowPanel">
              <ul>
                <li @mouseenter="selState = {'lan_code':item.lan_code, 'text': item.text}" :class="{'active': selStateCode == item.lan_code }"
                  v-for="(item, index) in langsStateSel"
                  :key="item.lan_code + index"
                  @click="changeState(item)">{{item.text}}</li>
              </ul>
            </div>
          </a>
          <router-link target="_blank" :to="{path: '/app/discovery/radio-home'}" class="more">
            全部电台
            <i></i>
          </router-link>
        </div>
      </div>
      <div class="radio-list">
        <div class="radio-item" v-for="item in recommendRadios.slice(0, 6)" :key="item.code">
          <div class="play-radio">
            <img v-lazy="item.cover" :key="item.cover" alt="">
            <router-link tag="div" :to="{path: '/app/discovery/radio-detail/' + item.code}" class="mask"></router-link>
            <div class="gradient-layer-play" @click="loadRadioList($event, item)">
              <i class="play"></i>
            </div>
            <div class="subscribe">
              <i></i>
              <span v-text="item.buy_num"></span>
            </div>
          </div>
          <router-link :to="{path: '/app/discovery/radio-detail/' + item.code}" class="title" v-text="item.module_name"></router-link>
          <div class="author" v-text="item.author.nickname"></div>
          <div class="money" v-text="(item.money === 0) ? $t('free') : (item.money_type === 'CNY') ? '￥' +item.money : $t('coins') + ' ' + item.money"></div>
        </div>
      </div>
      <a class="change-batch" @click="changeBatch()">
        <i></i>
        换一批
      </a>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Bus from '../../../bus'
import { mapState, mapActions } from 'vuex'
import cookie from '../../../tool/cookie'

export default {
  data () {
    return {
      selState: {},
      radios: [],
      isShowPanel: false,
      userId: '',
      curCourseCode: ''
    }
  },
  created () {
    Bus.$on('loadRecommendRadio', (code) => {
      this.getLangsState()
      this.curCourseCode = code
    })
  },
  mounted () {
    this.userId = cookie.getCookie('user_id')
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      langsStateSel: state => state.langsStateSel,
      recommendRadios: state => state.recommendRadios,
      recommendRadioPage: state => state.recommendRadioPage
    }),
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
    },
    selStateCode () {
      if (Object.keys(this.selState).length > 0) {
        return this.selState['lan_code']
      } else {
        if (this.langsStateSel && this.langsStateSel.length > 0) {
          return this.langsStateSel[0]['lan_code']
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'getLangsState',
      'getRecommendRadios'
    ]),
    loadRadioList (e, radio) {
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
    radioMouseEnter (e) {
      $('.gradient-layer-play', $(e.target)).show()
    },
    radioMouseLeave (e) {
      if ($('.gradient-layer-play i', $(e.target)).hasClass('play')) {
        $('.gradient-layer-play', $(e.target)).hide()
      }
    },
    // 换一批
    changeBatch () {
      if (Object.keys(this.selState).length === 0) {
        this.selState = this.langsStateSel[0]
      }
      let lanCode = this.selState['lan_code']
      this.getRecommendRadios({'lan_code': lanCode, limit: 6, page: this.recommendRadioPage})
    },
    // 切换课程
    changeState (item) {
      this.selState = item
      let lanCode = this.selState['lan_code']
      this.getRecommendRadios({'lan_code': lanCode, limit: 6, page: 1})
    }
  }
}
</script>

<style lang="less" scoped>
  .my-radio {
    width: 1180px;
    margin: 30px auto 0;
    // padding-right: 20px;
    .title {
      font-size: 15px;
      font-weight: bold;
      color: #849ea5;
      line-height: 35px
    }
    .content {
      height: 340px;
      background-color: #fff;
      box-shadow:0px 3px 10px 0px rgba(5,43,52,0.03);
      padding-top: 28px;
      padding-left: 30px;
      border-radius:5px;
      .radio-player {
        .title {
          display: inline-block;
          font-size: 16px;
          font-weight: bold;
          color: #333333;
          height: 22px;
          line-height: 38px;
          i {
            width: 36px;
            height: 36px;
            display: inline-block;
            background-image: url('../../../../static/images/learnIndex/radio-icon.svg');
            background-repeat: no-repeat;
            background-size: cover;
            margin-right: 15px;
          }
        }
        .radio-control {
          float: right;
          line-height: 38px;
          .more {
            font-size: 14px;
            font-weight: 500;
            color: #3C5B6F;
            margin-right: 37px;
            cursor: pointer;
            &:hover {
              color: #2A9FE4;
              i {
                background-image: url('../../../../static/images/learnIndex/icon-more-hover.svg');
              }
            }
            i {
              width: 9px;
              height: 10px;
              display: inline-block;
              background-image: url('../../../../static/images/learnIndex/icon-more.svg');
              background-repeat: no-repeat;
              background-size: cover;
              margin-top: 14px;
            }
          }
        }
      }
      .lang-sel {
        position: relative;
        display: inline-block;
        margin-right: 30px;
        color: #3c5b6f;
        cursor: pointer;
        &:hover {
          color: #2A9FE4;
          i {
            background-image: url('../../../../static/images/learnIndex/icon-triangle-hover.svg');
          }
        }
        span{
          font-size: 14px;
          font-weight: 500;
          i {
            margin-top: 17px;
            width: 9px;
            height: 6px;
            display: inline-block;
            background-image: url('../../../../static/images/learnIndex/icon-triangle.svg');
            background-repeat: no-repeat;
            background-size: cover;
            cursor: pointer;
          }
        }
        .lang-list {
          position: absolute;
          width:126px;
          height:83px;
          background:rgba(255,255,255,1);
          box-shadow:0px 4px 9px 0px rgba(10,43,64,0.3);
          border-radius:3px;
          margin-left: -55px;
          z-index: 99;
          ul {
            padding-top: 9px;
            li {
              height: 32px;
              border-left: 3px solid #fff;
              font-size: 14px;
              font-weight: 500;
              line-height: 32px;
              color: #103044;
              text-align: center;
              cursor: pointer;
            }
            .active {
              border-left: 3px solid #2a9fe4;
              background-color: #EEF2F3;
            }
          }
        }
      }
      .radio-list {
        width: 100%;
        height: 205px;
        margin-top: 40px;
        padding-left: 15px;
        .radio-item {
          position: relative;
          display: inline-block;
          width: 160px;
          height: 89px;
          margin-right: 25px;
          background: #EEF2F3;
          border-radius: 3px;
          // &:hover {
          //   box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
          //   -webkit-transition: all .3s ease-in-out;
          //   -moz-transition: all .3s ease-in-out;
          //   -ms-transition: all .3s ease-in-out;
          //   -o-transition: all .3s ease-in-out;
          //   transition: all .3s ease-in-out;
          // }
          .play-radio {
            position: relative;
            display: block;
            width: 160px;
            height: 89px;
            .mask {
              cursor: pointer;
              width: 100%;
              height: 100%;
              position: absolute;
              bottom: 0;
              background: url('../../../../static/images/discovery/mask.svg') no-repeat center;
              background-size: cover;
              border-radius: 3px;
            }
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 3px;
            z-index: 1;
          }
          .gradient-layer-play {
            width: 24px;
            height: 24px;
            position: absolute;
            // background-image: url('../../../../static/images/discovery/radio-gradient-layer.png');
            // background-repeat: no-repeat;
            // background-size: cover;
            bottom: 5px;
            right: 8px;
            // z-index: 9;
            i {
              display: inline-block;
            }
            .play {
              width: 24px;
              height: 24px;
              background-image: url('../../../../static/images/radionoPlay.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              cursor: pointer;
            }
            .pause {
              width: 24px;
              height: 24px;
              background-image: url('../../../../static/images/radioPlay.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              cursor: pointer;
            }
          }
          .subscribe {
            height: 23px;
            position: absolute;
            display: -webkit-box;
            bottom: 0;
            display: flex;
            align-items: center;
            z-index: 9;
            i:first-child {
              display: inline-block;
              margin: 0 8px;
              width: 14px;
              height: 9px;
              background-image: url('../../../../static/images/discovery/home-radio.svg');
              background-repeat: no-repeat;
              background-size: cover;
            }
            span {
              color: #ffffff;
              font-size: 12px;
              display: inline-block;
            }
          }
          .title {
            display: block;
            margin: 10px 0 6px;
            color: #333333;
            font-weight: 500;
            margin-bottom: 6px;
            font-size: 14px;
            cursor: pointer;
            line-height:20px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            &:hover {
              color: #2A9FE4;
            }
          }
          .author {
            color: #B8B8B8;
            width: 100px;
            font-size: 12px;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height:17px;
          }
          .money {
            color: #B8B8B8;
            font-size: 12px;
            /* display: inline-block; */
            position: relative;
            line-height:17px;
          }
        }
      }
      .change-batch {
        font-size:14px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(126,146,159,1);
        line-height:20px;
        float: right;
        // margin-top: 31px;
        margin-right: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
          color: #2A9FE4;
          i {
            background-image: url('../../../../static/images/learnIndex/icon-change-hover.svg');
          }
        }
        i {
          width: 15px;
          height: 15px;
          display: inline-block;
          background-image: url('../../../../static/images/learnIndex/icon-change.svg');
          background-repeat: no-repeat;
          background-size: cover;
          margin-right: 10px;
        }
      }
    }
  }
</style>
