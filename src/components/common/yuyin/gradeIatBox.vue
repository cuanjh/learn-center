<template>
 <transition name="fade">
  <div class="grade-ita-box" v-show="showGradeIATModal">
    <div class="ita-content">
      <div class="close-img" @click="closeModal()"></div>
      <div class="ita-btns">
        <p class="btn grade-details" :class="{'no-vip': !isVip}" @click="gradeIATDetails()" >
          <i class="icon-vip" v-if="!isVip"></i>
          {{!isVip ? '会员评分详情' : '评分详情'}}
        </p>
      </div>
    </div>
    <audio id="IATcomplete-success" src="../../../../../static/sounds/complete.mp3"></audio>
  </div>
 </transition>
</template>

<script>
import bus from '../../../bus'
import { mapState } from 'vuex'
import $ from 'jquery'

export default {
  data () {
    return {
      showGradeIATModal: false
    }
  },
  created () {
    bus.$on('busGradeIATModal', () => {
      this.showGradeIATModal = true
      setTimeout(() => {
        $('#IATcomplete-success')[0].play()
      }, 300)
    })
  },
  computed: {
    ...mapState({
      isVip: state => state.isVip
    })
  },
  methods: {
    closeModal () {
      $('#IATcomplete-success')[0].pause()
      $('#IATcomplete-success')[0].currentTime = 0
      this.showGradeIATModal = false
    },
    gradeIATDetails () {
      this.closeModal()
      bus.$emit('showIATScoreDetail')
    }
  }
}
</script>

<style lang="less" scoped>
.grade-ita-box {
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
  .ita-content {
    position: absolute;
    width: 720px;
    height: 400px;
    background: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius:16px;
  }
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
  .ita-btns {
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
        background: url('../../../../static/images/kid/icon-vip.png') no-repeat center;
        background-size: cover;
        margin-right: 6px;
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
