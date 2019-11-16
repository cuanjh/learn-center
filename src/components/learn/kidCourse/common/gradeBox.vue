<template>
  <transition name="fade">
    <div class="grade-modal-box" v-show="isShowGradeModal">
      <div class="grade-content">
        <div class="close-img" @click="closeModal()"></div>
        <!-- 70分以上的显示 -->
        <div class="good" v-if="isGood">
          <p class="title">
            <span>棒棒哒!</span>
            <span>你超越了全国<em> 75% </em>的小可爱</span>
          </p>
          <div class="center-box">
            <div class="center-good-img">
              <p class="grade">
                <span><em>80</em>分</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 70分以下的显示 -->
        <div class="no-good" v-else>
          <p class="title">
            <span>炫耀一下</span>
            <span>让小伙伴听听你的声音吧~</span>
          </p>
          <div class="center-box">
            <div class="center-nogood-img"></div>
          </div>
        </div>
        <div class="btns">
          <p class="btn share" @click="shareMyRecord()"><span>分享我的专属绘本</span></p>
          <p class="btn grade-details" @click="gradeDetails()">评分详情</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Bus from '../../../../bus'

export default {
  data () {
    return {
      isShowGradeModal: false,
      isGood: true,
      gradeData: {}
    }
  },
  created () {
  },
  computed: {
    courseCode () {
      let code = this.$route.query.code
      let arr = code.split('-')
      return arr.slice(0, 2).join('-')
    }
  },
  mounted () {
    console.log(this.courseCode)
    let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
    this.gradeData = xfISEResult
    console.log('gradeData==>', this.gradeData)
  },
  methods: {
    closeModal () {
      this.isShowGradeModal = false
    },
    // 分享我的绘本
    shareMyRecord () {
      this.isShowGradeModal = false
      this.$parent.goKidRecordList()
    },
    // 我的评分详情
    gradeDetails () {
      this.isShowGradeModal = false
      Bus.$emit('showScoreDetail')
    },
    showGradeBox () {
      this.isShowGradeModal = true
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
    // max-width: 868px;
    // max-height: 560px;
    border-radius:16px;
    background:linear-gradient(180deg,rgba(44,152,249,1) 0%,rgba(36,119,229,1) 100%);
    .close-img {
      position: absolute;
      top: -30px;
      right: -30px;
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
        animation: sport 1.5s ease-in forwards;
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
        animation: sport 1.5s ease-in forwards;
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
