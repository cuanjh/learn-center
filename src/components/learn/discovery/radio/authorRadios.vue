<template>
  <div>
    <div class="describe-content" v-if="radios.length > 0">
      <div class="describe-lists">
        <ul>
          <li v-for="(radio, index) in radios" :key="index+radio.code">
            <div class="item">
              <div class="item-img">
                <img v-lazy="radio.cover" :key="radio.cover" alt="电台的图片">
                <div class="gradient-layer-play" @click="loadRadioList($event, radio)">
                  <i class="play"></i>
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
    }
  },
  computed: {
  },
  methods: {
    // 取消
    goBack () {
      this.nolockTestCheckShow = false
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
            object-fit: cover;
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
}

</style>
