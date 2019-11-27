<template>
<transition name="fade">
  <div class="word-modal-box" v-show="showWordBox && isVip">
    <div class="word-box-content">
      <div class="close-img-box" @click="closeModal()"></div>
      <!-- <div v-if="!isVip">
        <noVip-guide-box />
      </div> -->
      <div class="words-content" >
        <word-item :newWords="newWords"/>
      </div>
    </div>
  </div>
  <!-- <noVip-guide-box v-else/> -->
</transition>
</template>

<script>
import WordItem from './wordItem.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      showWordBox: false,
      newWords: []
    }
  },
  components: {
    WordItem
  },
  mounted () {
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo, // 用户信息
      xfSyllPhone: state => state.xfSyllPhone, // 因素的对应表
      isVip: state => state.isVip
    })
  },
  methods: {
    showWordListBox (words) {
      this.newWords = words
      this.showWordBox = true
    },
    closeModal () {
      this.showWordBox = false
    }
  }
}
</script>

<style lang="less" scoped>
.word-modal-box {
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
  .words-content {
    width: 470px;
  }
  .word-box-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    border-radius:8px;
  }
  .close-img-box {
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
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
