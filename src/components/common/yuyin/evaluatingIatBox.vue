<template>
<transition name="fade">
  <div class="evaluating-modal-box" v-show="isShowEvaluatingModal">
    <div class="evaluating-content">
      <div class="close-img" @click="closeModal()"></div>
      <div class="evaluating">
        <div class="user-avatar">
          <img :src="userInfo ? userInfo.photo : ''" alt="">
          <div class="right">
            <div class="right-left">
              <p class="nikename" v-text="userInfo ? userInfo.nickname : ''"></p>
            </div>
          </div>
        </div>
        <div class="content-box">
          <!-- 原句子 -->
          <iatresult-detail :iatResult="iatResult"/>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
import bus from '../../../bus'
import { mapState, mapActions } from 'vuex'
// import $ from 'jquery'
import IatresultDetail from './iatResultDetail'

export default {
  data () {
    return {
      isShowEvaluatingModal: false,
      iatResult: [],
      playAudio: new Audio(),
      coreWords: []
    }
  },
  components: {
    IatresultDetail
  },
  created () {
    bus.$on('showIatResultDetail', (score) => {
      this.iatResult = []
      this.isShowEvaluatingModal = true
      setTimeout(() => {
        this.iatResult = JSON.parse(localStorage.getItem('xfIATResult'))
      }, 10)
    })
  },
  mounted () {
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    }),
    chapterCode () {
      return this.$route.query.id
    }
  },
  methods: {
    ...mapActions([
      'getKidCourseContent'
    ]),
    continueStudy () {
      this.closeModal()
    },
    // 初始化swiper
    closeModal () {
      this.isShowEvaluatingModal = false
      bus.$emit('closeAudio')
      bus.$emit('courseSummaryShow')
    }
  }
}
</script>

<style lang="less" scoped>
.evaluating-modal-box {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  z-index:99999999;
  overflow: hidden;
  .evaluating-content {
    width: 669px;
    position: absolute;
    top: 52%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius:8px;
    background: #fff;
    .close-img {
      position: absolute;
      top: -44px;
      right: 0px;
      width: 30px;
      height: 30px;
      background: url('../../../../static/images/kid/icon-close.png') no-repeat center;
      background-size: cover;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
    .evaluating {
      padding-bottom: 20px;
    }
    .user-avatar {
      display: flex;
      width: 100%;
      padding: 20px 32px;
      background: #2CA0E5;
      border-radius: 8px 8px 0 0;
      img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 20px;
      }
      .right {
        display: flex;
        flex: 1;
        justify-content: space-between;
        align-items: center;
        .right-left {
          .nikename {
            font-size:20px;
            font-weight:500;
            color:rgba(255,255,255,1);
            line-height:42px;
          }
        }
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
