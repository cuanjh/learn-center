<template>
  <div class="pk f-cb">
    <div class="single box" style="display:none">
      <div class="head">
        <div class="icons"></div>
        <p>{{$t("pkMenu.single")}}</p>
      </div>
      <div class="footer">
        <div class="btn" :class="{dis:disable}" @click="pkSingle">{{$t("pkMenu.start")}}</div>
      </div>
    </div>
    <div class="time">
      <div class="watch"></div>
      <div class="time-box"> 00:30 </div>
      <div class="footer">
        <div class="btn" :class="{dis:disable}" @click="pkSingle">{{$t("pkMenu.start")}}</div>
      </div>
    </div>
    <div class="couple box" style="display:none">
      <div class="head">
        <div class="icons"></div>
        <p>{{$t("pkMenu.couple")}}</p> <span v-if="cutdown">{{$t("pkMenu.wait")}}{{cut_num}}</span> </div>
      <div class="footer">
        <div class="btn" :class="{dis:disable}" @click="pkCouple">{{$t("pkMenu.start")}}</div>
      </div>
    </div>
</div>
</template>

<script>
// import _ from 'lodash'
import { onlyId } from '../../../plugins/onlyId'

export default {
  props: ['data', 'path'],
  data () {
    return {
      cut_num: 10, // 倒计时10秒
      cutdown: false, // 倒计时状态
      disable: false, // 按钮状态
      intervalID: 0 // 循环标示
    }
  },
  computed: {
    // slideId () {
    //   return _.values(Config.LANG)
    //     .concat(this.path)
    //     .join('-')
    // }
  },
  mounted () {
    // 每次进入判断是否拥有当前的唯一id
    if (!onlyId.get()) {
      onlyId.set()
    }
  },
  beforeDestroy () {
    this.$off('pk_player_enter')
  },
  created () {
    this.$on('break-rebot', () => {
      this.reset()
    })
  },
  methods: {
    pkCouple () {
      if (this.disable) {
        return
      }
      this.cutdown = true
      this.disable = true
      this.$emit('pk_ready', [this.slideId])
      this.$on('pk_player_enter', (data) => {
        pkEntry(true, data)
      })
      var getRobot = false
      this.intervalID = setInterval(() => {
        if (this.cut_num <= 3) {
          if (!getRobot) {
            // getRebotJSON.call(this)
          }
        }
        if (this.cut_num <= 0) {
          this.reset()
          return
        }
        this.cut_num--
      }, 1000)

      var pkEntry = (isPlayer, data) => {
        var cutNum = 3
        clearInterval(this.intervalID)

        cutNum = 3
        this.intervalID = setInterval(() => {
          // 倒计提示
          if (cutNum > 0) {
            // toaster.success(Config.pkMenu.match + ' ' + cut_num.toString())
          }
          if (cutNum <= 0) {
            clearInterval(this.intervalID)
            // toaster.clear()
            // 开始PK
            if (!isPlayer) {
              this.$dispatch('couple-pk', data.user_information)
              this.$emit('pk_robot_start', [data.progress])
            } else {
              this.$dispatch('couple-pk', data)
              this.reset()
            }
          }
          cutNum--
        }, 1000)
      }

      // function getRebotJSON() {
      //   getRobot = true;
      //   $event.trigger('pk_break');
      //   $.getJSON(
      //     Config.URL.pkRebot + '/battle/get_record?slide_id=' + this.slideId,
      //     function(data) {
      //       if (!data.progress) {
      //         console.log('没有相应录制文件', this.slideId);
      //         return;
      //       }
      //       pkEntry(false, data);
      //     }
      //   );
      // }
    },
    pkSingle () {
      if (this.disable) {
        return
      }
      // 点击开始日志提交，检测是否首次学习，默认为第一次
      var isFirst = 1
      this.$parent.$emit('pkStartLog', isFirst)

      this.$parent.$emit('single-pk')
    },
    reset () {
      clearInterval(this.intervalID)
      this.intervalID = 0
      this.cut_num = 10
      this.cutdown = false
      this.disable = false
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../../../../static/less/global_var.less');
.pk {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -382.5px;
  margin-top: -114px;
  text-align: center;
  color: #fff;
  width: 765px;
  z-index: 0;
  height: 228px;
  .box {
    border-radius: 3px;
    border-width: 1px solid #e9ecf6;
    background-color: #ffffff;
    width: 260px;
    height: 228px;
    float: left;
  }
  .head {
    background-color: #55a4fc;
    height: 140px;
    padding-top: 25px;
  }
  .icons {
    margin: 0 auto;
    margin-bottom: 20px;
  }
  p {
    font-size: 1.5em;
    letter-spacing: 0.1em;
    margin-bottom: 9px;
  }
  .time {
    //height: 170px;
    background-color: #fff;
    margin: 0px 290px;
    padding: 25px 0px;
    border-radius: 10px;
    .watch {
      background: url(../../../../static/images/learnSystem/pk/stopwatch.png);
      width: 87px;
      height: 99px;
      margin: 0 auto;
    }
  }
  .time-box {
    display: inline-block;
    padding: 5px 10px;
    background-color: @main-color;
    font-size: 1.6em;
    margin-top: 20px;
    letter-spacing: 1px;
    border-radius: 15px;
  }
  //.time {
  //    //padding: 30px 77px;
  //    //float: left;
  //    background-color: #fff;
  //    margin: 0px 290px;
  //    padding: 25px 0px;
  //    border-radius: 10px;
  //}
}

.single,
.single-pk {
  .icons {
    background: url(../../../../static/images/learnSystem/pk/pk-pencil.png) no-repeat;
    width: image-width;
    height: image-height;
  }
}

.couple,
.couple-pk {
  .icons {
    background: url(../../../../static/images/learnSystem/pk/pk-pencils.png) no-repeat;
    width: image-width;
    height: image-height;
  }
}

.single-pk,
.couple-pk {
  a {
    //        color: #5a6caf;
    color: #333;
  }
  .time {
    float: left;
    b {
      background: url(../../../../static/images/learnSystem/pk/time.png);
      width: image-width;
      height: image-height;
    }
  }
  .score {
    width: 150px;
    float: left;
    b {
      background: url(../../../../static/images/learnSystem/pk/target.png);
      width: image-width;
      height: image-height;
    }
  }
  .wrong {
    width: 150px;
    float: left;
    b {
      background: url(../../../../static/images/learnSystem/pk/wrong.png);
      width: image-width;
      height: image-height;
    }
  }
  b {
    display: inline-block;
    position: relative;
    margin-right: 10px;
    top: 2px;
  }
}

.single-pk,
.pk {
  .footer {
    padding-top: 15px;
    .btn {
      cursor: pointer;
      border-radius: 3px;
      background-color: #3be08d;
      display: inline-block;
      width: 123px;
      height: 35px;
      line-height: 35px;
      font-size: 1.3em;
      &:hover {
        background: linear-gradient(0deg, #46e892 0%, #38ce7f 100%);
      }
      &.dis {
        background: #b7bed4;
        cursor: default;
      }
    }
  }
}

.couple-pk {
  height: 345px;
  .per {
    line-height: 100px;
    position: relative;
    img {
      height: 50px;
      width: 50px;
      margin-top: 25px;
    }
  }
  .win {
    position: absolute;
    background: url(../../../../static/images/learnSystem/pk/award.png);
    width: image-width;
    height: image-height;
    top: 50px;
    left: 27px;
  }
  .score,
  .wrong {
    width: 70px !important;
  }
  .content {
    height: 202px;
  }
}
</style>
