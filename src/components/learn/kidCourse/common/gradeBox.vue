<template>
  <transition name="fade">
    <div class="grade-modal-box" v-show="isShowGradeModal">
      <div class="grade-content">
        <div class="grade-modal">
          <div class="close-img" @click="closeModal()"></div>
          <!-- 70分以下的显示 -->
          <div class="no-good" v-if="!isVip || score < 70 || !score">
            <p class="title">
              <span>炫耀一下</span>
              <span>让小伙伴听听你的声音吧~</span>
            </p>
            <div class="center-box">
              <div class="center-nogood-img"></div>
              <div class="center-img"></div>
            </div>
          </div>
          <!-- 70分以上的显示 -->
          <div class="good" v-else>
            <p class="title">
              <span>棒棒哒!</span>
              <span>你超越了全国<em> {{beyondFriendResult + '%'}} </em>的小可爱</span>
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
      </div>
      <!--领取过月卡了-->
      <div class="prompt-box" v-show="promptBox">
        <div>
          <span class="content">你还没有录音哦，快去录音吧！</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import Bus from '../../../../bus'

export default {
  data () {
    return {
      isShowGradeModal: false,
      beyondFriendResult: '',
      promptBox: false,
      chapterList: [],
      score: ''
    }
  },
  created () {
    Bus.$on('busGradeBox', () => {
      this.getAvarageScore()
      this.beyondFriendResult = this.beyondFriend()
      this.isShowGradeModal = true
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo, // 用户信息
      xfISEScoreMatch: state => state.xfISEScoreMatch,
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
        this.promptBox = true
        setTimeout(() => {
          this.promptBox = false
        }, 3000)
        return false
      }
      this.$router.push({path: '/kid/kid-record-list', query: {code: this.chapterCode, type: this.curType}})
    },
    // 我的评分详情
    gradeDetails () {
      if (!this.isVip) {
        this.isShowGradeModal = false
        Bus.$emit('showNoVipModal')
        return false
      }
      if (this.isVip && !this.score) {
        this.promptBox = true
        setTimeout(() => {
          this.promptBox = false
        }, 3000)
        return false
      }
      this.isShowGradeModal = false
      Bus.$emit('showScoreDetail')
    },
    beyondFriend () {
      if (!this.score || this.score < 70) {
        return false
      }
      let d = new Date()
      let scoreIndex = (d.getMonth() + 1) % 3 - 1
      return this.xfISEScoreMatch[this.score][scoreIndex]
    },
    closeModal () {
      this.isShowGradeModal = false
    },
    getAvarageScore () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      if (xfISEResult.length === 0) {
        return
      }
      let sumScore = 0
      let count = 0
      xfISEResult.forEach(item => {
        if (item.form_code.indexOf(this.chapterCode + '-' + this.curType.charAt(0).toUpperCase() + this.curType.slice(1) + '-') > -1) {
          sumScore += item.score
          count++
        }
      })
      this.score = Math.round(sumScore * 1.0 / count)
      console.log(this.score)
    }
  }
}
</script>

<style lang="less" scoped>
.grade-modal-box {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index:99999999;
  overflow: hidden;
  .grade-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // max-width: 720px;
    // max-height: 470px;
    border-radius:16px;
    // background:linear-gradient(180deg,rgba(44,152,249,1) 0%,rgba(36,119,229,1) 100%);

    .grade-modal {
      width: 100%;
      height: 100%;
      border-radius:16px;
      background:linear-gradient(180deg,rgba(44,152,249,1) 0%,rgba(36,119,229,1) 100%);
      // animation: heartbeat 1s cubic-bezier(.68,.01,.05,1.4);
      animation:heartbeat .5s ease-in-out;
    }
    .close-img {
      position: absolute;
      top: -44px;
      right: 0px;
      width: 30px;
      height: 30px;
      background: url('../../../../../static/images/kid/icon-close.png') no-repeat center;
      background-size: cover;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
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
      width: 720px;
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
        background: url('../../../../../static/images/kid/pic-vip-grade.png') no-repeat center;
        background-size: cover;
        margin: 0 auto;
        margin-top: 46px;
        // animation: sport 1.5s ease-in forwards;
        animation:gradeAni .3s ease-in-out;
      }
      .center-img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 156px;
        height: 174px;
        background: url('../../../../../static/images/kid/pic-nogood.png') no-repeat center;
        background-size: cover;
      }
      .grade {
        position: absolute;
        top: 102px;
        right: 184px;
        font-size:38px;
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
      padding-bottom: 60px;
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
@keyframes heartbeat {
  0% {
    transform: scale(.9,.9);
    opacity:1;
  }
  35% {
    transform: scale(1.05,1.05);
    opacity:1;
  }
  98% {
    transform: scale(0.98,0.98);
    opacity:1;
  }
  100% {
    transform: scale(1,1);
    opacity:1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.prompt-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  div {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .content {
    font-size:16px;
    font-weight:400;
    color:rgba(255,255,255,1);
    background: rgba(0, 0, 0, 74);
    line-height:22px;
    padding: 10px 16px;
    border-radius: 4px;
  }
}

@keyframes gradeAni {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-height: 610px){
}
</style>
