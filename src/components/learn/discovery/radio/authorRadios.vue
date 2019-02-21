<template>
  <div>
    <div class="describe-content" v-if="radios.length > 0">
      <div class="describe-lists">
        <ul>
          <li v-for="(radio, index) in radios" :key="index">
            <div class="item">
              <!--  @mouseenter="radioMouseEnter($event, radio, index)" -->
              <div class="item-img">
                <img v-lazy="radio.cover" :key="radio.cover" alt="电台的图片">
                <!-- 可以播放 -->
                <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                  <i class="play"></i>
                </div>
                <!-- 不能播放 -->
                <div  class="gradient-layer-play-no"
                      v-if="radio.money !== 0 && parseInt(isVip) !== 1"
                      @click="loadNoRadioList($event, radio)">
                  <i class="play-no" v-if="index>number"></i>
                </div>
                <!-- 是会员需要购买 -->
                <div  class="buy-cny"
                      v-if="radio.money !== 0 && radio.money_type === 'CNY' && parseInt(isVip) === 1 && radio.free_for_member === false"
                      @click="loadNoRadioList($event, radio)" >
                  <i class="play-no" v-if="index>number"></i>
                </div>
              </div>
              <div class="right-describe">
                <router-link tag="p" class="name" :to="{path: '/app/discovery/radio-detail/' + radio.code}">
                  {{radio.title}}
                </router-link>
                <p class="num">
                  <span>
                    <i></i>
                    {{radio.buy_num}}次试听
                  </span>
                  <span v-text="(radio.money === 0) ? $t('free') : (radio.money_type === 'CNY') ? '￥' +radio.money : $t('coins') + ' ' + radio.money"></span>
                </p>
                <p class="author">
                  <span>作者：</span>
                  <span v-text="radio.author_name ? radio.author_name : '用户' + radio.talkmate_id"></span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 展开全部 -->
      <div class="up-all">
        <span @click="loadMoreRadio()" v-text="showMore?'全部展开':'已经没有更多内容了'"></span>
        <i v-show="showMore"></i>
      </div>
    </div>
    <div class="nolock-test-check" v-show="nolockTestCheckShow">
      <div class="animated flipInX" v-show="nolockTestCheckShow">
        <span v-html="tips"></span>
        <i></i>
        <p class="buttons">
          <span class="goBackCore" @click="goBack()">取消</span>
          <span class="goBackCore">购买</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from '../../../../bus'
import $ from 'jquery'

export default {
  props: ['radios', 'isVip'],
  data () {
    return {
      nolockTestCheckShow: false,
      showMore: true, // true是展开，false是收起
      page: 1,
      tips: '',
      number: 2
    }
  },
  computed: {
    isRadioPlay () {
      return 0
    }
  },
  methods: {
    // 取消
    goBack () {
      this.nolockTestCheckShow = false
    },
    // 点击加载更多
    loadMoreRadio () {
      console.log('....')
    },
    // 能播放的列表点击播放
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
    // 不能播放的列表点击提示购买课程
    loadNoRadioList (e, item) {
      this.tips = '收费课程需要购买才能听哦(升级为会员免费)'
      this.nolockTestCheckShow = true
    }
  }
}
</script>
<style lang="less" scoped>
// 电台
.describe-content {
  width: 100%;
  .describe-lists {
    width: 100%;
    ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      li {
        width: 50%;
        margin-bottom: 30px;
        .item {
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .item-img {
          position: relative;
          width: 170px;
          height: 90px;
          border-radius: 5px;
          margin-top: 5px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
          }
          .gradient-layer-play {
            cursor: pointer;
            display: inline-block;
            position: absolute;
            right: 6px;
            bottom: 6px;
            background: rgba(18, 18, 18, 0.415);
            border-radius: 50%;
            .play {
              width: 24px;
              height: 24px;
              background-image: url("../../../../../static/images/radionoPlay.svg");
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
            }
            .pause {
              width: 24px;
              height: 24px;
              background-image: url("../../../../../static/images/radioPlay.svg");
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
            }
          }
          .gradient-layer-play-no {
            width: 170px;
            height: 90px;
            position: absolute;
            top: 0;
            text-align: center;
            z-index: 2;
            .play-no {
              width: 100%;
              height: 100%;
              background-image: url("../../../../../static/images/learn/learn-course-little-bg.png");
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
            }
          }
          .buy-cny {
            width: 170px;
            height: 90px;
            position: absolute;
            top: 0;
            text-align: center;
            z-index: 2;
            .play-no {
              width: 100%;
              height: 100%;
              background-image: url("../../../../../static/images/learn/learn-course-little-bg.png");
              background-repeat: no-repeat;
              background-size: cover;
              display: inline-block;
            }
          }
        }
        .right-describe {
          padding: 10px 0 10px 10px;
          width: 280px;
          .name {
            cursor: pointer;
            width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
            line-height: 20px;
          }
          .num {
            display: flex;
            align-items: center;
            font-size: 12px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            // color:rgba(245,166,35,1);
            color: #999999ff;
            line-height: 18px;
            padding: 5px 0 25px;
            span:nth-child(1) {
              display: flex;
              align-items: center;
              margin-right: 20px;
              i {
                display: inline-block;
                width: 13px;
                height: 10px;
                background: url("../../../../../static/images/listening.png")
                  no-repeat center;
                background-size: cover;
                margin-right: 8px;
              }
            }
          }
          .author {
            font-size: 12px;
            font-family: PingFang-SC-Medium;
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
            line-height: 17px;
            span:nth-child(2) {
              display: inline-block;
              width: 160px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  // 点击加载更多
  .up-all {
    cursor: pointer;
    width: 100%;
    background: rgba(221, 221, 221, 0.1);
    text-align: center;
    line-height: 42px;
    font-size: 14px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(42, 159, 228, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      display: inline-block;
      width: 10px;
      height: 6px;
      background: url("../../../../../static/images/upAll.svg") no-repeat center;
      background-size: cover;
      margin-left: 10px;
    }
    .active {
      display: inline-block;
      width: 10px;
      height: 6px;
      background: url("../../../../../static/images/upAllActive.svg") no-repeat
        center;
      background-size: cover;
      margin-left: 10px;
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
    .animated {
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
      i{
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
      span {
        display: inline-block;
        width: 200px;
      }
      .goBackCore {
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
      .buttons {
        width: 300px;
        height: 40px;
        position: absolute;
        bottom: 30px;
        display: flex;
        justify-content: space-around;
      }
    }
  }
</style>
