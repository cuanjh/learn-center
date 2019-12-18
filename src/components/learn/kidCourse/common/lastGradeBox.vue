<template>
  <transition name="fade">
    <div class="grade-content">
      <!-- 70分以下的显示 -->
      <div class="no-good" v-if="!isVip || score < 70 || !score">
        <p class="title">
          <span>炫耀一下</span>
          <span>让小伙伴听听你的声音吧~</span>
        </p>
        <div class="center-box">
          <div class="center-nogood-img"></div>
        </div>
      </div>
      <!-- 70分以上的显示 -->
      <div class="good" v-else>
        <p class="title">
          <span>棒棒哒!</span>
          <span>你超越了全国<em> {{beyondFriendResult}} </em>的小可爱</span>
        </p>
        <div class="center-box">
          <div class="center-good-img">
            <p class="grade">
              <span><em>{{score}}</em>分</span>
            </p>
          </div>
        </div>
      </div>
      <div class="btns">
        <p class="btn share" @click="shareMyRecord()"><span>分享我的专属绘本</span></p>
        <p class="btn grade-details" :class="{'no-vip': !isVip}" @click="gradeDetails()" >
          <i class="icon-vip" v-if="!isVip"></i>
          {{!isVip ? '会员评分详情' : '评分详情'}}
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
import Bus from '../../../../bus'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      chapterList: [],
      score: '',
      beyondFriendResult: ''
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      kidRecordList: state => state.kidRecordList,
      isVip: state => state.isVip
    }),
    chapterCode () {
      let code = this.$route.query.code
      return code
    },
    curType () {
      let type = this.$route.query.type
      return type
    }
  },
  mounted () {
    console.log('localXfISEResult==>', this.localXfISEResult)
  },
  methods: {
    // 分享我的绘本
    shareMyRecord () {
      if (this.kidRecordList.length === 0) {
        let msg = '你还没有录音哦，快去录音吧！'
        Bus.$emit('show-prompt', msg)
        return false
      }
      this.$router.push({path: '/kid/kid-record-list', query: {code: this.chapterCode, type: this.curType}})
    },
    // 我的评分详情
    gradeDetails () {
      if (!this.isVip) {
        Bus.$emit('showNoVipModal')
        return false
      }
      if (this.isVip && !this.score) {
        let msg = '你还没有录音哦，快去录音吧！'
        Bus.$emit('show-prompt', msg)
        return false
      }
      Bus.$emit('showScoreDetail')
    },
    setAvarageScore (score) {
      this.score = score
      this.beyondFriendResult = this.beyondFriend()
    },
    beyondFriend () {
      if (this.score >= 98 && this.score <= 99) {
        return '95%'
      } else if (this.score >= 96 && this.score <= 97) {
        return '93%'
      } else if (this.score >= 94 && this.score <= 95) {
        return '91%'
      } else if (this.score >= 91 && this.score <= 93) {
        return '90%'
      } else if (this.score >= 89 && this.score <= 90) {
        return '85%'
      } else if (this.score >= 86 && this.score <= 88) {
        return '83%'
      } else if (this.score >= 84 && this.score <= 85) {
        return '80%'
      } else if (this.score >= 81 && this.score <= 83) {
        return '79%'
      } else if (this.score >= 79 && this.score <= 80) {
        return '77%'
      } else if (this.score >= 76 && this.score <= 78) {
        return '75%'
      } else if (this.score >= 73 && this.score <= 75) {
        return '72%'
      } else if (this.score >= 70 && this.score <= 72) {
        return '68%'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.grade-content {
  width: 100%;
  height: 480px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius:16px;
  background:linear-gradient(180deg,rgba(44,152,249,1) 0%,rgba(36,119,229,1) 100%);
  .title {
    font-size:18px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:25px;
    text-align: center;
    padding-top: 54px;
    span:nth-child(1) {
      font-size:32px;
    }
    span:nth-child(2) {
      em {
        font-size: 26px;
        line-height: 20px;
      }
    }
  }
  .center-box {
    position: relative;
    width: 100%;
    height: 290px;
    padding: 0 110px;
    text-align: center;
    .center-good-img {
      position: relative;
      display: inline-block;
      width: 100%;
      height: 100%;
      background: url('../../../../../static/images/kid/pic-img-up.png') no-repeat center;
      background-size: cover;
      margin: 0 auto;
      // animation: sport 1.5s ease-in forwards;
    }
    .center-nogood-img {
      position: relative;
      display: inline-block;
      width: 333px;
      height: 213px;
      background: url('../../../../../static/images/kid/pic-novip-img.png') no-repeat center;
      background-size: cover;
      margin: 0 auto;
      margin-top: 46px;
      // animation: sport 1.5s ease-in forwards;
    }
    .grade {
      position: absolute;
      // top: 102px;
      // right: 158px;
      top: 50%;
      left: 50%;
      transform: translate(-36%, -50%);
      font-size:28px;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:70px;
      em {
        font-size: 50px;
        line-height: 60px;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    padding-top: 20px;
    .btn {
      width:200px;
      height:40px;
      background:#fff;
      border-radius:25px;
      font-size:16px;
      font-weight:600;
      color:rgba(38,127,234,1);
      line-height:40px;
      text-align: center;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
    .grade-details {
      background: #10D2A7;
      color: #fff;
      margin-left: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.no-vip {
        background: #FFB542;
      }
      .icon-vip {
        width: 22px;
        height: 18px;
        background: url('../../../../../static/images/kid/icon-vip.png') no-repeat center;
        background-size: cover;
        margin-right: 6px;
      }
    }
  }
}
@keyframes sport {
  from {
    transform: translateY(-100%);
    opacity: 1;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
