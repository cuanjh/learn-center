<template>
  <div id="setting-container" v-show="false">
    <div class="sound-setting">
      <div class="head"> {{$t('setting.speach')}} </div>
      <div class="body"> <b class="micorphone-icon"></b><span>{{$t('setting.micphone')}}</span>
        <div class="mui-switch mui-switch-animbg" type="checkbox" :class="{checked:checked}" @click="switchCheck('canRecord')"></div>
      </div>
      <div class="footer">
        <div class="btn continue" @click="close">{{$t('setting.close')}}</div>
      </div>
    </div>

    <div class="teacher-setting">
      <div class="head"> {{$t('setting.teacher')}} </div>
      <div class="body">
          <div class="setting-row">
            <b class="auto-jump-icon"></b><span>{{$t('setting.autoJump')}}</span>
            <div class="mui-switch mui-switch-animbg" type="checkbox" :class="{checked:autoJump}" @click="switchCheck('autoJump')"></div>
          </div>
          <div class="setting-row">
            <b class="micorphone-icon"></b><span>{{$t('setting.hiddenMicrophone')}}</span>
            <div class="mui-switch mui-switch-animbg" type="checkbox" :class="{checked:hiddenMicrophone}" @click="switchCheck('hiddenMicrophone')"></div>
          </div>
      </div>
      <div class="footer">
        <div class="btn continue" @click="close">{{$t('setting.close')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState, mapMutations } from 'vuex'
import dialog from '../../../plugins/dialog'
export default {
  data () {
    return {
      checked: this.canRecord,
      window: {},
      isTeacher: 0
    }
  },
  mounted () {
    console.log(this.userInfo)
    if (this.isTeacher) {
      this.updateAutoJump(!this.autoJump)
      this.updateHiddenMicrophone(!this.hiddenMicrophone)
    }
  },
  created () {
    this.$on('setting-show', () => {
      this.window = dialog({
        content: document.querySelector('.sound-setting')
      }).showModal()
    })

    this.$on('teacher-show', () => {
      this.window = dialog({
        content: document.querySelector('.teacher-setting')
      }).showModal()
    })
  },
  computed: {
    ...mapState({
      canRecord: state => state.learn.canRecord,
      autoJump: state => state.learn.autoJump,
      hiddenMicrophone: state => state.learn.hiddenMicrophone,
      tips: state => state.learn.tips
    })
  },
  methods: {
    ...mapMutations({
      updateAutoJump: 'learn/updateAutoJump',
      updateCanRecord: 'learn/updateCanRecord',
      updateHiddenMicrophone: 'learn/updateHiddenMicrophone'
    }),
    switchCheck (type) {
      switch (type) {
        case 'canRecord':
          this.checked = !this.checked
          this.updateCanRecord(this.checked)
          // toaster.success(
          //   this.canRecord
          //     ? this.tips.setting_micphoneOpen
          //     : this.tips.setting_micphoneClose
          // )
          break

        case 'autoJump':
          this.updateAutoJump(!this.autoJump)
          // toaster.success(
          //   this.autoJump
          //     ? this.tips.setting_autoJumpOpen
          //     : this.tips.setting_autoJumpClose
          // )
          break

        case 'hiddenMicrophone':
          this.updateHiddenMicrophone(!this.hiddenMicrophone)
          // toaster.success(
          //   this.hiddenMicrophone
          //     ? this.tips.setting_hiddenMicrophoneOpen
          //     : this.tips.setting_hiddenMicrophoneClose
          // )
          break

        default:
          console.log('unkonwn type' + type)
          break
      }
    },
    close () {
      this.window.remove()
      $('#setting-container').append($('.sound-setting'))
      $('#setting-container').append($('.teacher-setting'))
      this.$parent.$emit('component-resume')
    }
  }
}
</script>

<style lang="less" scoped>
  .sound-setting {
    text-align: center;
    width: 320px;
    background: #fff;
    height: 220px;
    border-radius: 4px;
    .head {
      font-size: 1.4em;
      height: 50px;
      line-height: 50px;
      background-color: #55a4fc;
      color: #fff;
      border-radius: 4px 4px 0 0;
    }
    .body {
      border-bottom: 1px solid #F0F0F0;
      font-size: 1.25em;
      color:  #5a6caf;
      padding: 45px 0;
      b{
        background: url(../../../../static/images/learnSystem/progress/mic.png) no-repeat;
        width: 12px;
        height: 18px;
        position: relative;
        display: inline-block;
        top: 3px;
        margin-right: 10px;
      }
    }
    .footer {
      .btn {
        border-radius: 3px;
        background-color: #55a4fc;
        width: 123px;
        height: 35px;
        margin: 0 auto;
        color: #fff;
        font-size: 1.1em;
        line-height: 35px;
        margin-top: 10px;
        cursor: pointer;
      }
    }
  }

  .teacher-setting {
    text-align: center;
    width: 320px;
    background: #fff;
    height: 245px;
    border-radius: 4px;
    .head {
      font-size: 1.4em;
      height: 50px;
      line-height: 50px;
      background-color: #55a4fc;
      color: #fff;
      border-radius: 4px 4px 0 0;
    }
    .body {
      border-bottom: 1px solid #F0F0F0;
      font-size: 1.25em;
      color:  #5a6caf;
      padding: 5px 0;
      //b {
      //    background: url(images/mic.png) no-repeat;
      //    width: image-width;
      //    height: image-height;
      //    position: relative;
      //    display: inline-block;
      //    //top: 3px;
      //    margin-right: 10px;
      //}
      .setting-row {
        margin:24px 0px 24px 90px;
        height: 30px;
        text-align: left;
        div {
          //width: 20%;
          float: left;
        }
        .micorphone-icon {
          background: url(../../../../static/images/learnSystem/progress/microphone.png) no-repeat;
          width: image-width;
          height: image-height;
          position: relative;
          display: inline-block;
          //top: 3px;
          margin-right: 10px;
        }
        .auto-jump-icon {
          background: url(../../../../static/images/learnSystem/progress/autojump.png) no-repeat;
          width: image-width;
          height: image-height;
          position: relative;
          display: inline-block;
          //top: 3px;
          margin-right: 10px;
        }
        b {
          margin-top: 5px;
          float: left;
        }
        span {
          margin-top: 3px;
          float: left;
          width: 95px;
          text-align: left;
        }
      }
    }
    .footer {
      .btn {
        border-radius: 3px;
        background-color: #55a4fc;
        width: 123px;
        height: 35px;
        margin: 0 auto;
        color: #fff;
        font-size: 1.1em;
        line-height: 35px;
        margin-top: 10px;
        cursor: pointer;
      }
    }
  }

  .mui-switch {
    top: 4px;
    width: 40px;
    height: 20px;
    position: relative;
    background-color: #e9ecf6;
    box-shadow: #e9ecf6 0 0 0 0 inset;
    border-radius: 20px;
    display: inline-block;
    appearance: none;
    cursor: pointer;
    outline: none;
  }

.mui-switch:before {
  content: '';
  width: 16px;
  height: 16px;
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.mui-switch.checked {
  border-color: #3be08d;
  box-shadow: #3be08d 0 0 0 16px inset;
  background-color: #3be08d;
}

.mui-switch.checked:before {
  left: 21px;
}

.mui-switch.mui-switch-animbg {
  transition: background-color ease 0.4s;
}

.mui-switch.mui-switch-animbg:before {
  transition: left 0.3s;
}

.mui-switch.mui-switch-animbg:checked {
  box-shadow: #dfdfdf 0 0 0 0 inset;
  background-color: #64bd63;
  transition: border-color 0.4s, background-color ease 0.4s;
}

.mui-switch.mui-switch-animbg:checked:before {
  transition: left 0.3s;
}
</style>
