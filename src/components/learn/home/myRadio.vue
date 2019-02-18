<template>
  <div class="my-radio">
    <div class="title" v-show="false">
      电台课程
    </div>
    <div class="content">
      <div class="radio-player">
        <div class="title"><i></i>推荐电台</div>
        <div class="radio-control">
          <div class="lang-sel">
            <span>{{ selStateText }} <i></i></span>
          </div>
          <router-link tag="span" :to="{path: '/app/discovery/radio-home'}" class="more">
            全部电台
            <i></i>
          </router-link>
        </div>
      </div>
      <div class="radio-list">
        <div class="radio-item" v-for="item in recommendRadios.slice(0, 6)" :key="item.code">
          <a @mouseenter="radioMouseEnter($event)" @mouseleave="radioMouseLeave($event)">
            <img v-lazy="item.cover" :key="item.cover" alt="">
            <div class="gradient-layer-play" @click="loadRadioList($event, item)" style="display: none">
              <i class="play"></i>
            </div>
            <div class="subscribe">
              <i></i>
              <span v-text="item.buy_num"></span>
            </div>
          </a>
          <router-link tag="div" :to="{path: '/app/discovery/radio-detail/' + item.code}" class="title" v-text="item.module_name"></router-link>
          <div class="author" v-text="item.author.nickname"></div>
          <div class="money" v-text="(item.money === 0) ? $t('free') : (item.money_type === 'CNY') ? '￥' +item.money : $t('coins') + ' ' + item.money"></div>
        </div>
      </div>
      <div class="change-batch" @click="changeBatch()">
        <i></i>
        换一批
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Bus from '../../../bus'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      selState: {},
      radios: []
    }
  },
  mounted () {
    this.getLangsState()
  },
  computed: {
    ...mapState({
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
    }
  },
  methods: {
    ...mapActions([
      'getLangsState',
      'getRecommendRadios'
    ]),
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
    radioMouseEnter (e) {
      $('.gradient-layer-play', $(e.target)).show()
    },
    radioMouseLeave (e) {
      if ($('.gradient-layer-play i', $(e.target)).hasClass('play')) {
        $('.gradient-layer-play', $(e.target)).hide()
      }
    },
    changeBatch () {
      if (Object.keys(this.selState).length === 0) {
        this.selState = this.langsStateSel[0]
      }
      let lanCode = this.selState['lan_code']
      this.getRecommendRadios({'lan_code': lanCode, limit: 6, page: this.recommendRadioPage})
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
              color: #0581D1;
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
              margin-top: 15px;
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
          color: #0581D1;
        }
        span{
          font-size: 14px;
          font-weight: 500;
          i {
            margin-top: 17px;
            width: 9px;
            height: 6px;
            display: inline-block;
            background-image: url('../../../../static/images/learnIndex/course-select-icon.svg');
            background-repeat: no-repeat;
            background-size: cover;
            cursor: pointer;
          }
        }
      }
      .radio-list {
        width: 100%;
        height: 205px;
        margin-top: 40px;
        padding-left: 15px;
        .radio-item {
          display: inline-block;
          width: 160px;
          height: 89px;
          margin-right: 25px;
          background: #EEF2F3;
          border-radius: 3px;
          &:hover {
            box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
            -webkit-transition: all .3s ease-in-out;
            -moz-transition: all .3s ease-in-out;
            -ms-transition: all .3s ease-in-out;
            -o-transition: all .3s ease-in-out;
            transition: all .3s ease-in-out;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 3px;
            z-index: 1;
          }
          .gradient-layer-play {
            width: 160px;
            height: 89px;
            position: absolute;
            background-image: url('../../../../static/images/discovery/radio-gradient-layer.png');
            background-repeat: no-repeat;
            background-size: cover;
            margin-top: -89px;
            text-align:  center;
            z-index: 2;
            .play {
              width: 36px;
              height: 36px;
              background-image: url('../../../../static/images/discovery/radio-list-play.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-top: 24px;
            }
            .pause {
              width: 36px;
              height: 36px;
              background-image: url('../../../../static/images/discovery/radio-list-pause.svg');
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
              margin-top: 24px;
            }
          }
          .subscribe {
            position: relative;
            display: -webkit-box;
            margin-top: -25px;
            z-index: 3;
            i {
              display: inline-block;
              margin: 0 8px;
              width: 14px;
              height: 14px;
              background-image: url('../../../../static/images/discovery/home-radio.png');
              background-repeat: no-repeat;
              background-size: cover;
            }
            span {
              color: #ffffff;
              font-size: 12px;
              display: inline-block;
              margin-top: -1px;
              margin-left: -3px;
            }
          }
          .title {
            margin: 10px 0 6px;
            color: #333333;
            font-weight: 500;
            height: 40px;
            font-size: 14px;
            cursor: pointer;
            line-height:20px;
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
        font-size: 14px;
        font-weight: 500;
        color: #999999;
        float: right;
        // margin-top: 31px;
        margin-right: 40px;
        cursor: pointer;
        &:hover {
          color: #0581D1;
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
          margin-right: 4px;
          margin-top: 3px;
        }
      }
    }
  }
</style>
