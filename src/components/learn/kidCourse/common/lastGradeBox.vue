<template>
  <transition name="fade">
    <div class="grade-content">
      <!-- 70分以下的显示 -->
      <div class="no-good" v-if="isVip !== 1 || isGood < 70 || !isGood">
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
          <span>你超越了全国<em> {{beyondFriend}} </em>的小可爱</span>
        </p>
        <div class="center-box">
          <div class="center-good-img">
            <p class="grade">
              <span><em>{{isGood}}</em>分</span>
            </p>
          </div>
        </div>
      </div>
      <div class="btns">
        <p class="btn share" @click="shareMyRecord()"><span>分享我的专属绘本</span></p>
        <p class="btn grade-details" :class="{'no-vip': isVip !== 1}" @click="gradeDetails()" >
          <i class="icon-vip" v-if="isVip !== 1"></i>
          {{isVip !== 1 ? '会员评分详情' : '评分详情'}}
        </p>
      </div>
      <!--提示-->
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
      chapterList: [],
      AllScore: [],
      isGood: '',
      promptBox: false
    }
  },
  created () {
    Bus.$on('busLastGradeBox', data => {
      console.log(data)
      this.showLastGradeBox(data)
    })
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    }),
    // 是否vip
    isVip () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    },
    chapterCode () {
      let code = this.$route.query.code
      return code
    },
    curType () {
      let type = this.$route.query.type
      return type
    },
    beyondFriend () {
      if (this.isGood >= 98 && this.isGood <= 99) {
        return '95%'
      } else if (this.isGood >= 96 && this.isGood <= 97) {
        return '93%'
      } else if (this.isGood >= 94 && this.isGood <= 95) {
        return '91%'
      } else if (this.isGood >= 91 && this.isGood <= 93) {
        return '90%'
      } else if (this.isGood >= 89 && this.isGood <= 90) {
        return '85%'
      } else if (this.isGood >= 86 && this.isGood <= 88) {
        return '83%'
      } else if (this.isGood >= 84 && this.isGood <= 85) {
        return '80%'
      } else if (this.isGood >= 81 && this.isGood <= 83) {
        return '79%'
      } else if (this.isGood >= 79 && this.isGood <= 80) {
        return '77%'
      } else if (this.isGood >= 76 && this.isGood <= 78) {
        return '75%'
      } else if (this.isGood >= 73 && this.isGood <= 75) {
        return '72%'
      } else if (this.isGood >= 70 && this.isGood <= 72) {
        return '68%'
      }
    }
  },
  mounted () {
    console.log('localXfISEResult==>', this.localXfISEResult)
  },
  methods: {
    // 分享我的绘本
    shareMyRecord () {
      this.$router.push({path: '/app/kid-record-list', query: {code: this.chapterCode, type: this.curType}})
    },
    // 我的评分详情
    gradeDetails () {
      // let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      if (!this.isGood) {
        this.promptBox = true
        setTimeout(() => {
          this.promptBox = false
        }, 3000)
        return false
      }
      Bus.$emit('showScoreDetail', this.chapterList)
    },
    showLastGradeBox (chapterList) {
      console.log(chapterList)
      this.chapterList = chapterList
      let localXfResult = JSON.parse(localStorage.getItem('xfISEResult'))
      let totalScore = 0
      let data = []
      if (this.curType === 'draw') {
        Object.entries(localXfResult).forEach(item => {
          chapterList.forEach(li => {
            if (item[0].indexOf(li.code) > -1) {
              totalScore += parseFloat(item[1].total_score)
              data.push(item[1])
            }
          })
        })
      } else {
        Object.entries(localXfResult).forEach(item => {
          chapterList.forEach(li => {
            if (item[0] === li.code) {
              totalScore += parseFloat(item[1].total_score)
              data.push(item[1])
            }
          })
        })
      }
      this.isGood = Math.round(totalScore / data.length)
      console.log(this.isGood)
    }
  }
}
</script>

<style lang="less" scoped>
.grade-content {
  width: 669px;
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
      top: 102px;
      right: 158px;
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
</style>
