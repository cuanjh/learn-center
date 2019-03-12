<template>
  <div class="students">
    <div class="student-content">
      <div class="title">同学都在听</div>
      <div class="listening-lists">
        <ul class="lists">
          <li class="lists-item" :id="item.code" v-for="(item, index) in studentsListening.slice(0, 4)" :key="index">
            <div class="nickname">
              <router-link :to="{path: '/app/discovery/radio-detail/' + item.code}">{{item.author.nickname}}</router-link>
              <p>订阅量 {{item.buy_num}}次</p>
            </div>
            <div class="gradient-layer-play" @click="loadRadioList($event, item)">
              <i class="play"></i>
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
  props: ['studentsListening'],
  data () {
    return {
    }
  },
  methods: {
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
    }
  }
}
</script>
<style lang="less" scoped>
.students {
  width: 100%;
  margin-top: 30px;
  .student-content {
    .title {
      font-size:16px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(126,146,159,1);
    }
    .listening-lists {
      width: 100%;
      .lists {
        width: 100%;
        .lists-item {
          margin-top: 10px;
          padding: 13px 20px;
          background:rgba(255,255,255,1);
          border-radius:8px;
          border:1px solid rgba(230,235,238,1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          .nickname {
            font-size:14px;
            font-family:PingFang-SC-Medium;
            font-weight:500;
            color:rgba(74,74,74,1);
            a {
              display: inline-block;
              width: 140px;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              &:hover {
                color: #2A9FE4;
              }
            }
            p {
              font-size:12px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(153,153,153,1);
            }
          }
          .gradient-layer-play {
              cursor: pointer;
              .play {
                width: 24px;
                height:24px;
                background-image: url('../../../../../static/images/hotnoplay.svg');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
              }
              .pause {
                width: 24px;
                height: 24px;
                background-image: url('../../../../../static/images/hotplay.svg');
                background-repeat: no-repeat;
                background-size: cover;
                display: inline-block;
              }
            }
        }
      }
    }
  }
}
</style>
