<template>
  <div class="vip-container" v-show="isShow">
    <section class='vip-update-success learn-begin-study-warn animated flipInX ' v-show='costAlert'>
      <!-- 提示花费金币弹出框 -->
      <div class='vip-update-success-logo learn-begin-study-warn-logo animated tada'></div>
      <p>{{ $t("courseList.pay.title") }} <span>150<em>{{ $t("courseList.pay.num") }}</em></span></p>
      <p>{{ $t("courseList.pay.balan") }} <span v-text="userCoins"></span></p>
      <p>
        <span class='learn-begin-study-warn-cancel' @click="btnCancel">{{ $t("button.cancel") }}</span>
        <span class='learn-begin-study-warn-confirm active' @click='buyChapter()'>{{ $t("button.confirm") }}</span>
      </p>
      <p class='vip-bottom' @click='gotoVip'>{{ $t("courseList.pay.openvip") }}</p>
    </section>
    <!-- 如果金币不足显示的提示信息 正常用户-->
    <section class='vip-update-success vip-update-confirm animated flipInX slow user-alert-two-btns goldShortage' v-show='goldShortage'>
      <div class='vip-update-success-logo animated tada'></div>
      <p>哦!你的金币余额不足啦 !</p>
      <p>获取此课程需要150金币</p>
      <p>金币余额: {{ userCoins }}</p>
      <p>
        <span class='learn-begin-study-warn-cancel' @click="close()">取消</span>
        <span class='learn-begin-study-warn-cancel' @click="gotoWallet">去充值</span>
      </p>
      <p class='vip-bottom' @click='gotoVip'>{{ $t("courseList.pay.openvip") }}</p>
      <em @click='close'></em>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import bus from '../../bus'
export default {
  data () {
    return {
      isShow: false,
      costAlert: false,
      goldShortage: false,
      selectLevel: '',
      lanCode: '',
      chapterCode: ''
    }
  },
  created () {
    bus.$on('showBuyChapterPanel', (code) => {
      this.isShow = true
      console.log('-----+++++----购买chapter-----+++++++++')
      this.lanCode = code.split('-')[0]
      this.selectLevel = code.split('-')[2]
      this.chapterCode = code
      console.log(code)
      console.log(this.lanCode)
      console.log(this.selectLevel)
      if (this.userInfo.coins >= 150) {
        this.costAlert = true
      } else {
        this.goldShortage = true
      }
    })
  },
  watch: {
    buyHide () {
      if (this.buyHide) {
        this.costAlert = !this.buyHide
        this.isShow = this.costAlert
      } else {
        this.costAlert = this.buyHide
        this.isShow = this.costAlert
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      buyHide: state => state.course.buyHide
    }),
    userCoins () {
      if (!this.userInfo) {
        return 0
      } else {
        return this.userInfo.coins
      }
    }
  },
  methods: {
    ...mapMutations({
      updateUnlockCourseList: 'course/updateUnlockCourseList'
    }),
    ...mapActions({
      getBuyChapter: 'course/getBuyChapter',
      getUnlockChapter: 'course/getUnlockChapter',
      getUserInfo: 'getUserInfo'
    }),
    btnCancel () {
      this.costAlert = false
      this.isShow = false
    },
    // 购买 课程 接口实现
    async buyChapter () {
      var _this = this
      // 购买金币
      await _this.getBuyChapter({ chapter_code: _this.chapterCode })

      var arr = _this.chapterCode.split('-')

      let courseCode = arr[0] + '-' + arr[1]
      // 获取解锁课程
      await _this.getUnlockChapter(courseCode).then((res) => {
        _this.updateUnlockCourseList(res)
      })
      let isKid = localStorage.getItem('isKid')
      if (isKid === '1') {
        bus.$emit('changeKidProChapter')
      }
      // 更新用户金币信息
      await _this.getUserInfo()

      _this.costAlert = false
      _this.isShow = false
    },
    close () {
      this.isShow = false
      this.goldShortage = false
    },
    gotoWallet () {
      this.goldShortage = false
      this.isShow = false
      this.$router.push({ path: '/app/user/wallet' })
    },
    gotoVip () {
      this.goldShortage = false
      this.isShow = false
      // this.$router.push({path: '/app/vip-home'})
      let routeUrl = this.$router.resolve({
        path: '/app/vip-home'
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style scoped>
/*弹出层*/
.vip-container {
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
}
.vip-update-success{
  width: 424px;
  height: 284px;
  border-radius: 4px;
  background-color: #ffffff;
  position: fixed;
  z-index: 999;
  top:50%;
  left: 50%;
  margin-left: -212px;
  margin-top: -142px;
  text-align: center;
  box-shadow: 0 3px 5px 0 rgba(000, 000, 000, 0.3);
}
.vip-update-success-logo{
  width:110px;
  height: 110px;
  background-image: url(../../../static/images/learn/learn-vip-success.png);
  background-repeat: no-repeat;
  background-color: #fff;
  background-position: center center;
  border-radius: 50%;
  padding: 70px;
  position:absolute;
  top:-65px;
  left: 50%;
  margin-left: -75px;
}
.vip-update-success p{
  font-size: 16px;
  color: #4a4a4a;
}
.vip-update-success p:nth-of-type(1){
  padding-top: 74px;
}
.vip-update-success p:nth-of-type(2){
  padding-bottom: 40px;
}
.vip-update-success p:nth-of-type(3){
  padding-bottom: 20px;
}
.vip-update-success .vip-back-tolearn{
  width: 168px;
  height: 40px;
  border-radius: 100px;
  background-color: #fd8469;
  text-align: center;
  line-height: 40px;
  color:#fff;
  display:inline-block;
  cursor: pointer;
}
.vip-update-success .vip-back-tolearn:hover{
  background-color: #FA6F50;
}

.learn-begin-study-warn {
  width: 354px;
  height: 250px;
  box-shadow: 0 3px 5px 0 rgba(000, 000, 000, 0.3);
  margin-top: -125px;
  margin-left: -177px;
}

.learn-begin-study-warn-logo {
  background-image: url(../../../static/images/learn/learn-vip-warn.png);
  padding: 40px;
  margin-left: -56px;
  top: -50px;
  background-size: 86%;
}

.learn-begin-study-warn p:nth-of-type(1) {
  font-size: 16px;
  color: #4a4a4a;
  padding-top: 62px;
}

.learn-begin-study-warn p:nth-of-type(2) {
  color: #9b9b9b;
  padding-bottom: 43px;
  padding-top: 11px;
}

.learn-begin-study-warn p:nth-of-type(3) {
  height: 28px;
  width: 70%;
  margin: 0 auto;
}

.learn-begin-study-warn p:nth-of-type(3) span {
  width: 102px;
  height: 28px;
  border-radius: 100px;
  border: solid 1px #3c9bbe;
  line-height: 28px;
  font-size: 16px;
  font-weight: 300;
  color: #0e8abe;
  cursor: pointer;
}

.learn-begin-study-warn p:nth-of-type(3) span:hover {
  background-color: #3c9bbe;
  color: #fff;
}

.learn-begin-study-warn-cancel {
  float: left;
}

.learn-begin-study-warn-confirm {
  float: right;
}

.vip-bottom {
  width: 100%;
  height: 34px;
  border-radius: 0 0 4px 4px;
  background-color: #fd8469;
  line-height: 34px;
  color: #fde257;
  background-image: url(../../../static/images/learn/learn-huangguan-vip.png);
  background-repeat: no-repeat;
  background-position: 75px center;
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
  font-size: 14px;
  background-size: 6%;
  background-position: 75px 8px;
}

.vip-bottom:hover {
  background-color: #fa6f50;
}

.vip-update-confirm p:nth-of-type(4) {
  height: 28px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vip-update-confirm p:nth-of-type(4) span {
  width: 100px;
  height: 28px;
  border-radius: 100px;
  padding: 0 10px;
  border: solid 1px #3c9bbe;
  line-height: 28px;
  font-size: 16px;
  font-weight: 300;
  color: #0e8abe;
  cursor: pointer;
}
.vip-update-confirm p:nth-of-type(4) span:nth-child(1) {
  margin-right: 20px;
}

.vip-update-confirm p:nth-of-type(4) span:hover {
  background-color: #3c9bbe;
  color: #fff;
}
</style>
