<template>
  <transition name="fade">
    <div class="common-modal-container" v-show="isShow">
      <div class="common-madal">
        <div class="close-img" @click="closeModal()"></div>
        <p :class="className"><i></i></p>
        <p class="description" v-html="description"></p>
        <a href="javacript:;" class="button" @click="commonHandler()" ><span v-text="btnDesc"></span></a>
        <a href="javacript:;" class="button" v-if="btnCancel" @click="commonCancel()" ><span>{{btnCancel}}</span></a>
      </div>
    </div>
  </transition>
</template>

<script>
import Bus from '../../bus'
export default {
  data () {
    return {
      isShow: false,
      className: '',
      description: '',
      btnCancel: '',
      btnDesc: '',
      isLink: false,
      hyperLink: '',
      emitMethod: ''
    }
  },
  created () {
    Bus.$on('showCommonModal', (data) => {
      console.log('全局弹框data', data)
      this.className = data.className
      this.description = data.description
      this.btnCancel = data.btnCancel
      this.btnDesc = data.btnDesc
      this.isLink = data.isLink
      this.emitMethod = data.emitMethod
      if (this.isLink) {
        this.hyperLink = data.hyperLink
      }
      this.isShow = true
    })
    Bus.$on('hideCommonModal', () => {
      this.isShow = false
    })
  },
  methods: {
    commonHandler () {
      if (this.hyperLink) {
        this.isShow = false
        // this.$router.push({path: this.hyperLink})
        let routeUrl = this.$router.resolve({
          path: this.hyperLink
        })
        window.open(routeUrl.href, '_blank')
        return false
      }
      if (this.emitMethod) {
        this.isShow = false
        Bus.$emit('settingUpdate', this.emitMethod)
      }
      this.isShow = false
    },
    commonCancel () {
      this.isShow = false
    },
    closeModal () {
      this.isShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.common-modal-container {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index:99999999;
  overflow: hidden;
  .close-img {
    position: absolute;
    top: -30px;
    right: -30px;
    width: 30px;
    height: 30px;
    background: url('../../../static/images/icon-close-img.png') no-repeat center;
    background-size: cover;
    &:hover {
      cursor: pointer;
      background: url('../../../static/images/icon-close-img-active.png') no-repeat center;
      background-size: cover;
    }
  }
  .common-madal {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 25px;
    margin-left: -190px;
    margin-top: -130px;
    width:380px;
    height:260px;
    background:#fff;
    box-shadow:0px 5px 12px 0px rgba(0,32,50,0.3);
    border-radius:5px;
    text-align: center;
  }
  .description {
    margin-top: 20px;
    text-align: center;
    font-size:18px;
    font-weight:bold;
    color:#0A2B40;
    line-height:25px;
    height: 50px;
  }
  .button {
    display: inline-block;
    margin-top: 32px;
    width:140px;
    height:36px;
    line-height: 36px;
    background:#0581D1;
    border-radius:18px;
    &:hover {
      background-color: #2A9FE4;
    }
    span {
      color: #fff;
      font-weight: 500;
      font-size: 15px;
    }
  }
}

.vipIcon {
  text-align: center;
  i {
    width: 78px;
    height: 73px;
    background-image: url('../../../static/images/common/icon-vip.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
  }
}

.warnIcon {
  text-align: center;
  i {
    width: 76px;
    height: 76px;
    background-image: url('../../../static/images/common/icon-warn.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
  }
}

.okIcon {
  text-align: center;
  i {
    display: inline-block;
    width: 92px;
    height: 60px;
    background-image: url('../../../static/images/common/icon-ok.svg');
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
