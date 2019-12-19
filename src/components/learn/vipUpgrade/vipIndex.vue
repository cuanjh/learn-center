<template>
  <div class="vip-home">
    <div class="vip-header">
      <div class="header-img"></div>
      <div class="title">
        <p>成为 VIP 会员，加快学习速度</p>
        <p>借助 VIP 会员资格解锁完整的语言学习之旅</p>
      </div>
    </div>
    <div class="vip-container">
      <div class="vip-content">
        <!-- 介绍vip会员福利 -->
        <div class="introduce">
          <div class="introduce-content">
            <div class="introduce-title">
              <p>解锁以下所有功能以及更多其他实用功能</p>
              <p>获得各种专享功能的访问权限，从离线模式到由母语使用者提供反馈的对话功能。用不了多久您就能说出一口流利的外语！</p>
            </div>
            <!-- vip选项 -->
            <div class="vip-lists">
              <div class="vip-function">
                <ul>
                  <li>
                    <div class="one">比较免费选项和 VIP 选项</div>
                    <div class="two">免费</div>
                    <div class="three">VIP</div>
                  </li>
                  <li v-for="item in functionList" :key="item.id">
                    <div class="one">
                      <i :class="'icon' + item.id"></i>
                      <span>{{item.title}}</span>
                      <span class="des">{{item.des}}</span>
                    </div>
                    <div class="two"><i v-show="item.id == 1 || item.id == 5 || item.id == 7"></i></div>
                    <div class="three"><i></i></div>
                  </li>
                </ul>
              </div>
              <!-- 会员卡片 -->
              <div class="lists-content">
                <div class="project-header">
                  <div class="title">选择合适的计划来帮助您学习</div>
                </div>
                <!-- <div class="cards-list">
                  <ul>
                    <li v-for='(item, index) in productList' :key="index">
                      <div class="cards">
                        <p class="title" v-if="index == 0">月卡</p>
                        <p class="title" v-if="index == 1">季卡</p>
                        <p class="title" v-if="index == 2">半年卡</p>
                        <p class="title" v-if="index == 3">年卡</p>
                        <div class="price">
                          <span>¥</span>
                          <span>{{ item.total_money }}</span>
                          <span></span>
                        </div>
                        <div class="expect">
                          <span>{{ item.product }}个月有效期</span>
                        </div>
                        <div class="button">
                          <p @click="goBuy(item)">
                            <span>立即购买</span>
                            <i></i>
                          </p>
                        </div>
                        <span class="hint" v-show="recommand === index">76%的人会选</span>
                        <span class="green" v-show="value === index">最优惠</span>
                      </div>
                    </li>
                  </ul>
                </div> -->
                <div class="cards-list" v-if="vipDiscount.has_discount" :class="{'cross-list': vipDiscount.has_discount}">
                  <ul>
                    <li v-for='(item, index) in productListNew' :key="index">
                      <div class="cards">
                        <p class="title" v-if="index == 0">月卡</p>
                        <p class="title" v-if="index == 1">季卡</p>
                        <p class="title" v-if="index == 2">半年卡</p>
                        <p class="title" v-if="index == 3">年卡</p>
                        <div class="price">
                          <span>¥</span>
                          <span>{{ parseInt(item.discountInfo[0].total_money) }}</span>
                        </div>
                        <div class="cross-out">
                          <span>¥</span>
                          <span>{{ parseInt(item.total_money) }}</span>
                        </div>
                        <div class="expect">
                          <span>{{ item.product }}个月有效期</span>
                        </div>
                        <div class="button">
                          <p @click="goBuy(item.discountInfo[0])">
                            <span>立即购买</span>
                            <i></i>
                          </p>
                        </div>
                        <span class="hint">限时优惠</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="cards-list" v-else>
                  <ul>
                    <li v-for='(item, index) in productListNew' :key="index">
                      <div class="cards">
                        <p class="title" v-if="index == 0">月卡</p>
                        <p class="title" v-if="index == 1">季卡</p>
                        <p class="title" v-if="index == 2">半年卡</p>
                        <p class="title" v-if="index == 3">年卡</p>
                        <div class="price">
                          <span>¥</span>
                          <span>{{ parseInt(item.total_money) }}</span>
                          <span></span>
                        </div>
                        <div class="expect">
                          <span>{{ item.product }}个月有效期</span>
                        </div>
                        <div class="button">
                          <p @click="goBuy(item)">
                            <span>立即购买</span>
                            <i></i>
                          </p>
                        </div>
                        <span class="hint" v-show="recommand === index">76%的人会选</span>
                        <span class="green" v-show="value === index">最优惠</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 激活码激活会员 -->
        <div class="activation-code">
          <div class="title">通过激活码升级</div>
          <div class="code">
            <input id="input-1" type="text" @keyup="inputKeyup($event, codeNum1)" maxlength="4" v-model="codeNum1">
            <span class="code-line"></span>
            <input id="input-2" type="text" @keyup="inputKeyup($event, codeNum2)" maxlength="4" v-model="codeNum2">
            <span class="code-line"></span>
            <input id="input-3" type="text" @keyup="inputKeyup($event, codeNum3)" maxlength="4" v-model="codeNum3">
            <span class="code-line"></span>
            <input id="input-4" type="text" maxlength="4" v-model="codeNum4">
          </div>
          <p class="prompt">注：每个账号在1个自然年之内，只能累计使用3个激活码！</p>
          <button class="button" v-bind:disabled="!isDisabled" @click='showConfirm()'>立即激活</button>
        </div>
        <!-- 会员常见问题 -->
        <div class="project">
          <div class="project-content">
            <!-- 会员常见的问题 -->
            <div class="bottom-content">
              <div class="title">
                <i></i>
                <span>会员常见的问题</span>
              </div>
              <div class="course-list">
                <ul>
                  <li v-for="(card, index) in cardslist" :key="index">
                    <div class="referral" @click="unfoldAnswer(index)">
                      <p>
                        <span><i class="mark"></i>{{card.question}}</span>
                        <i class="icon" v-if="answerShow == index"></i>
                        <i v-else></i>
                      </p>
                    </div>
                    <div class="answer" v-show="answerShow == index">
                      <p>
                        <span>答：</span>
                        <span>{{card.answer}}</span>
                      </p>
                    </div>
                  </li>
                </ul>
                <div class="phone">
                  <div class="phone-num">
                    <i></i>
                    <span>400 068 8056</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 他们是这样说的 -->
            <div class="other-say">
              <div class="other-content">
                <div class="text">
                  <p>他们是这样说的</p>
                  <p>在过去的一段时间里我们陆续收到了很多国家的语言学习者发来的e-mail，留言和信件！</p>
                </div>
                <div class="other-lists">
                  <ul>
                    <li>
                      <div class="say-content">
                        <div class="people-img">
                          <img src="../../../../static/images/vipUpgrade/itme-one.png" alt="">
                        </div>
                        <div class="nickname">
                          <p>宫本はるか</p>
                          <p class="languages">
                            <span class="mother-course">英语<i></i></span>
                            <span class="learn-course">西班牙语<i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="say-desc">
                        <p>很好的一款学习工具，陆陆续续在三个月的时间里学习了西班牙语，会员的功能真的很强大！</p>
                      </div>
                    </li>
                    <li>
                      <div class="say-content">
                        <div class="people-img">
                          <img src="../../../../static/images/vipUpgrade/item-two.png" alt="">
                        </div>
                        <div class="nickname">
                          <p>CALGARY</p>
                          <p class="languages">
                            <span class="mother-course">英语<i></i></span>
                            <span class="learn-course">日语<i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="say-desc">
                        <p>很高兴能和日语课程的编辑者通话，也很感谢能收到talkmate的参观邀请，意外的收货真的很多，惊喜也很多！</p>
                      </div>
                    </li>
                    <li>
                      <div class="say-content">
                        <div class="people-img">
                          <img src="../../../../static/images/vipUpgrade/item-three.png" alt="">
                        </div>
                        <div class="nickname">
                          <p>皮特_Yang</p>
                          <p class="languages">
                            <span class="mother-course">英语<i></i></span>
                            <span class="learn-course">汉语<i></i></span>
                          </p>
                        </div>
                      </div>
                      <div class="say-desc">
                        <p>我选择了学习汉语，其实在这里也没那么难学，很多的助学功能都很强大！</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <bottom />
  </div>
</template>
<script>
// import Vue from 'vue'
import $ from 'jquery'
import { mapState, mapActions, mapMutations } from 'vuex'
import Bus from '../../../bus.js'
import LogCollect from '../../../tool/logCollect'
import Bottom from '../../common/bottom.vue'
// import I18nLocales from '../../../vueI18/locale'

export default {
  data () {
    return {
      functionList: [
        {id: 1, title: '作业批改优先推送给母语使用者'},
        {id: 2, title: '测试、听力、口语、阅读、写作、语法、听说专享提升'},
        {id: 3, title: '课程中心会员专区'},
        {id: 4, title: '支持移动端离线下载'},
        {id: 5, title: '语音评分'},
        {id: 6, title: '课程创建DIY模板', des: '（即将推出）'},
        {id: 7, title: '官方课程证书', des: '（即将推出）'},
        {id: 8, title: '语伴聊天窗口64种语言及时翻译', des: '（即将推出）'}
      ],
      // items: I18nLocales[Vue.config.lang].vip.left.tips,
      answerShow: -1,
      cardslist: [
        {
          question: 'VIP会员能否免费学习所学语种相关的电台课程？',
          answer: '全球说有很多丰富有趣的音频电台课程，用户成为VIP会员后，除去少部分主播老师的课程设计为付费外，其他均为免费！'
        },
        {
          question: 'VIP会员能否支持学币、优惠券优惠购买？',
          answer: 'VIP会员本身提供购课折扣让利、免费课、免费阅读等丰富特权，因此在VIP会员不支持学币、优惠券等优惠抵扣。'
        },
        {
          question: 'VIP会员能否叠加优惠券、学币、邀请码使用呢？',
          answer: '你的很多语伴同样也抱有和你一样的问题！ 如果你已经是全球说的VIP会员，在学习的过程中获得了优惠券，将在你下次同等级续费中产生优惠，或者在当前等级进行会员升级的操作中产生优惠！'
        },
        {
          question: '成为VIP会员后能否退订或者转让给其他朋友呢？',
          answer: '成为VIP后所产生的所有优惠和费用均不支持退订和转让，全球说提供免费的体验课程和电台课程，你可以选择试学一部分课程再另行考虑成为VIP，会员权限将为你提供更多更实用的学习提升方法和学习趣味！'
        }
      ],
      recommand: 2,
      value: 3,
      codeNum1: '',
      codeNum2: '',
      codeNum3: '',
      codeNum4: ''
    }
  },
  components: {
    Bottom
  },
  created () {
    Bus.$on('settingUpdate', (type) => {
      this.confirmCard(type)
    })
  },
  mounted () {
    this.getMemberProductsList()
    console.log('会员列表卡片充值', this.productList)
    this.getMemberCardPrdv1()
    console.log(this.userInfo)
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      productList: state => state.user.productList,
      vipDiscount: state => state.user.vipDiscount,
      productListNew: state => state.user.productListNew
    }),
    isActivation () {
      let codes = this.codeNum1 + '-' + this.codeNum2 + '-' + this.codeNum3 + '-' + this.codeNum4
      return codes
    },
    isDisabled () {
      let codeNum = this.codeNum1 !== '' && this.codeNum2 !== '' && this.codeNum3 !== '' && this.codeNum4 !== ''
      return codeNum
    },
    ui () {
      let ui = this.userInfo
      if (Object.keys(ui).length === 0) {
        ui = JSON.parse(sessionStorage.getItem('userInfo'))
      }
      return ui
    }
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
      getMemberCard: 'user/getMemberCard', // 激活码激活接口
      getMemberProductsList: 'user/getMemberProductsList',
      getMemberCardPrdv1: 'user/getMemberCardPrdv1',
      getUserInfo: 'getUserInfo'
    }),
    // 提示用户的信息不完整
    alertMessage (msg) {
      let obj = {
        className: 'warnIcon',
        description: `${msg}`,
        btnDesc: '确定',
        isLink: false
      }
      Bus.$emit('showCommonModal', obj)
    },
    // 提示激活
    alertConfirm (confirm) {
      let obj = {
        className: 'warnIcon',
        buttonClass: 'buttonClass',
        description: `你确定要激活吗？`,
        btnCancel: '取消',
        btnDesc: '确定',
        isLink: false,
        emitMethod: confirm
      }
      Bus.$emit('showCommonModal', obj)
    },
    goBuy (item) {
      console.log(this.userInfo)
      if (!this.userInfo.phonenumber || !this.userInfo.email) {
        let obj = {
          className: 'warnIcon',
          description: '请先绑定后充值！',
          btnDesc: '确定',
          isLink: false
        }
        Bus.$emit('showCommonModal', obj)
        return false
      }
      let OBJ = item
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('userBuy', jsonStr)
      this.$router.push({
        path: '/app/vip-user-buy'
      })
    },
    // 激活码激活
    showConfirm () {
      console.log('确定激活码？', this.isActivation, this.userInfo)
      if (!this.userInfo.phonenumber || !this.userInfo.email) {
        let obj = {
          className: 'warnIcon',
          description: '请先绑定后充值！',
          btnDesc: '确定',
          isLink: false
        }
        Bus.$emit('showCommonModal', obj)
        return false
      }
      var _memberType = this.ui.member_info.member_type
      // this.$refs.alert.$emit('UserVipCode', this.activateNum)
      let activeCode = this.isActivation.toUpperCase()
      this.getMemberCard(activeCode).then((res) => {
        console.log('激活码返回', res)
        if (res.success) {
          // this.alertConfirm(res.member_info.money)
          let obj = {
            className: 'okIcon',
            description: '激活码激活成功',
            btnDesc: '确定',
            isLink: false
          }

          Bus.$emit('showCommonModal', obj)
          this.confirmCard(res.member_info.money)
          this.getUserInfo()
        } else {
          this.alertMessage(res.errorMsg)
          this.codeNum = ''
          LogCollect.payMemberCard(_memberType, this.codeNum, 0, 0)
        }
      })
      // if (!this.codeNum) {
      //   return
      // }
      // this.alertMessage('你确定使用激活码激活会员？')
      // this.$refs.alert.$emit('ifConfirmShow', true)
    },
    confirmCard (money) {
      var _memberType = this.ui.member_info.member_type
      LogCollect.payMemberCard(
        _memberType,
        this.codeNum,
        1,
        money
      )
    },
    //  展开常见问题
    unfoldAnswer (num) {
      if (this.answerShow !== -1 && this.answerShow === num) {
        this.answerShow = -1
        return
      }
      // if (this.answerShow !== '') {
      //   this.answerShow = ''
      //   return
      // }
      console.log('====>', this.answerShow)
      console.log('====>', num)
      this.answerShow = num
    },
    inputKeyup (event, num) {
      if (num.length === 4) {
        let id = event.target.id
        let idNum = parseInt(id.split('-')[1])
        if (idNum !== 4) {
          let nextId = 'input-' + (idNum + 1)
          setTimeout(() => {
            $('#' + nextId).focus()
          }, 100)
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.vip-home {
  width: 100%;
  .vip-header {
    position: relative;
    .header-img {
      width: 100%;
      height: 360px;
      background: url('../../../../static/images/vipUpgrade/vip-banner.jpg') no-repeat center;
      background-size: cover;
    }
    .title {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-bottom: 10px;
      p:nth-child(1) {
        font-size:44px;
        font-weight:800;
        color:rgba(255,255,255,1);
        line-height:62px;
        padding-bottom: 10px;
      }
      p:nth-child(2) {
        font-size:21px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,255,255,1);
        line-height:29px;
        text-align: center;

      }
    }
  }
  // 内容区
  .vip-container {
    width: 100%;
    .vip-content {
      width: 100%;
      // 介绍会员福利
      .introduce {
        width: 100%;
        height: 1100px;
        background: #ffffff;
        // padding: 73px 120px 0;
        .introduce-content {
          width: 960px;
          margin: 0 auto;
          padding: 66px 0px 0;
        }
        .introduce-title {
          width: 100%;
          p:nth-child(1) {
            font-size:24px;
            font-weight:bold;
            color:#333333;
            margin-bottom: 8px;
          }
          p:nth-child(2) {
            font-size:14px;
            font-weight:500;
            color:#333333;
          }
        }
        .vip-lists {
          .vip-function {
            width: 960px;
            margin-top: 20px;
            box-shadow:0px 6px 16px 0px rgba(0,51,86,0.12);
            ul {
              width: 100%;
              height: 100%;
              padding-bottom: 27px;
              li {
                padding-left: 60px;
                display: flex;
                align-items: center;
                margin-bottom: 7px;
                i {
                  display: inline-block;
                  width: 42px;
                  height: 42px;
                  background-repeat: no-repeat;
                  background-size: cover;
                  background-position: center;
                }
                span {
                  font-size:14px;
                  font-weight:500;
                  color:rgba(51,51,51,1);
                  line-height:42px;
                  padding-left: 16px;
                }
                .des {
                  color: #90A2AE;
                  padding-left: 0;
                }
                .one {
                  width: 652px;
                  font-size:14px;
                  font-weight:600;
                  color:rgba(51,51,51,1);
                  .icon1 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-map.svg');
                  }
                  .icon2 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-time.svg');
                  }
                  .icon3 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-voice.svg');
                  }
                  .icon4 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-yun.svg');
                  }
                  .icon5 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-erji.svg');
                  }
                  .icon6 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-bulb.svg');
                  }
                  .icon7 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-book.svg');
                  }
                  .icon8 {
                    background-image: url('../../../../static/images/vipUpgrade/icon-vip.svg');
                  }
                }
                .two {
                  width: 28px;
                  font-size:14px;
                  font-weight:600;
                  color:rgba(51,51,51,1);
                  line-height:20px;
                  margin-right: 69px;
                  text-align: center;
                  i {
                    width: 20px;
                    height: 20px;
                   background-image: url('../../../../static/images/vipUpgrade/icon-blue.svg');
                  }
                }
                .three {
                  font-size:14px;
                  font-weight:600;
                  color:rgba(51,51,51,1);
                  line-height:20px;
                  i {
                    width: 20px;
                    height: 20px;
                    background-image: url('../../../../static/images/vipUpgrade/icon-green.svg');
                  }
                }
              }
              li:first-child {
                padding-top: 30px;
                padding-bottom: 16px;
                margin-bottom: 33px;
                border-bottom: 3px solid #F5F9FB;
              }
            }
          }
        }
      }
      // 激活码激活会员
      .activation-code {
        width: 960px;
        margin-top: 121px;
        padding: 220px 0 0px;
        text-align: center;
        margin: 0 auto;
        .title {
          font-size:24px;
          font-weight:bold;
          color:rgba(51,51,51,1);
        }
        .code {
          margin: 32px auto 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          input {
            width:100px;
            height:42px;
            background:rgba(255,255,255,1);
            border-radius:10px;
            border:2px solid rgba(200,212,219,1);
            text-align: center;
          }
          input:focus {
            border-color: #2A9FE4FF;
          }
          .code-line {
            display: inline-block;
            width:6px;
            height:1px;
            background:rgba(200,212,219,1);
            margin: 0 6px;
          }
        }
        .prompt {
          font-size:12px;
          font-weight:400;
          color:rgba(126,146,159,1);
          line-height:17px;
          padding-bottom: 50px;
        }
        .button {
          // cursor: pointer;
          width:240px;
          height:41px;
          background:rgba(145,210,73,1);
          border-radius:21px;
          font-size:15px;
          font-weight:bold;
          color:rgba(255,255,255,1);
          line-height:41px;
        }
        .button:disabled {
          cursor: not-allowed;
          background:rgba(200,212,219,1);
        }
      }
      // 卡片
      .project {
        width: 100%;
        background: #ffffff;
        .project-content {
          padding: 0 120px;
          position: relative;
          width: 100%;
          .bottom-content {
            width: 960px;
            margin: 0 auto;
            margin-top: 112px;
            .title {
              padding-top: 80px;
              i {
                display: inline-block;
                width: 30px;
                height: 30px;
                background: url('../../../../static/images/vipUpgrade/xin.svg') no-repeat center;
                background-size: cover;
                margin-right: 12px;
              }
              span {
                font-size:28px;
                font-weight:bold;
                color:rgba(51,51,51,1);
                line-height: 30px;
              }
            }
            .course-list {
              width: 100%;
              background:rgba(255,255,255,1);
              border-radius:8px;
              box-shadow:0px 9px 22px 0px rgba(8,60,88,0.2);
              border-radius:8px;
              border:4px solid rgba(238,243,246,1);
              margin-top: 15px;
              ul {
                padding: 47px 60px;
                li {
                  padding: 14px 0;
                  border-bottom: 1px solid #DEE6EBFF;
                  .referral {
                    width: 100%;
                    p {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      font-size:14px;
                      font-weight:500;
                      color:rgba(51,51,51,1);
                      span {
                        display: flex;
                        align-items: center;
                        width: 95%;
                        .mark {
                          display: inline-block;
                          width: 20px;
                          height: 18px;
                          background:url('../../../../static/images/vipUpgrade/problem.svg') no-repeat center;
                          background-size: cover;
                          margin-right: 14px;
                        }
                      }
                      i {
                        display: inline-block;
                        width: 7px;
                        height: 12px;
                        background: url('../../../../static/images/vipUpgrade/right-icon.svg') no-repeat center;
                        background-size: cover;
                      }
                      .icon {
                        display: inline-block;
                        width: 12px;
                        height: 7px;
                        background: url('../../../../static/images/vipUpgrade/down-icon.svg') no-repeat center;
                        background-size: cover;
                      }
                    }
                  }
                  .referral:hover {
                    cursor: pointer;
                  }
                  .answer {
                    width: 748px;
                    padding-top: 6px;
                    transition: all 3s ease;
                    p {
                      display: flex;
                    }
                    span:nth-child(1) {
                      display: inline-block;
                      font-size:14px;
                      font-weight:600;
                      color:rgba(51,51,51,1);
                      line-height:20px;
                    }
                    span:nth-child(2) {
                      display: inline-block;
                      font-size:14px;
                      font-weight:400;
                      color:rgba(153,153,153,1);
                      line-height:20px;
                      margin-left: 6px;
                    }
                  }
                }
              }
              .phone {
                width: 100%;
                padding-bottom: 24px;
                .phone-num {
                  width: 100%;
                  text-align: center;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  i {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    background: url('../../../../static/images/vipUpgrade/iphone.svg') no-repeat center;
                    background-size:cover;
                    margin-right: 10px;
                  }
                  span {
                    font-size:16px;
                    font-weight:bold;
                    color:rgba(51,51,51,1);
                    line-height: 60px;
                  }
                }
              }
            }
          }
          .other-say {
            padding: 92px 0 122px 0;
            width: 960px;
            margin: 0 auto;
            .other-content {
              width: 100%;
              .text {
                p:nth-child(1) {
                  font-size:24px;
                  font-weight:500;
                  color:rgba(16,48,68,1);
                }
                p:nth-child(2) {
                  font-size:18px;
                  font-weight:400;
                  color:rgba(60,91,111,1);
                }
              }
              .other-lists {
                width: 100%;
                margin-top: 44px;
                ul {
                  display: flex;
                  justify-content: space-between;
                  li {
                    display: inline-block;
                    width: 260px;
                    margin-right: 60px;
                    .say-content {
                      display: flex;
                      align-items: center;
                    }
                    .people-img {
                      position: relative;
                      width: 75px;
                      height: 75px;
                      margin-right: 15px;
                      img {
                        width: 100%;
                        height: 100%;
                      }
                      // .country {
                      //   position: absolute;
                      //   right: 0;
                      //   bottom: 0;
                      //   width: 14px;
                      //   height: 14px;
                      //   border-radius: 50%;
                      //   img {
                      //     width: 100%;
                      //     height: 100%;
                      //   }
                      // }
                    }
                    .nickname {
                      p:nth-child(1) {
                        font-size:17px;
                        font-weight:bold;
                        color:rgba(51,51,51,1);
                      }
                      .languages {
                        font-size:13px;
                        font-weight:500;
                        color:rgba(184,184,184,1);
                        display: flex;
                        padding-top: 6px;
                        span {
                          display: flex;
                          align-items: center;
                          i {
                            display: inline-block;
                            background-repeat: no-repeat;
                            background-size: cover;
                            background-position: center;
                          }
                        }
                        .mother-course {
                          i {
                            width: 7px;
                            height: 8px;
                            background: url('../../../../static/images/vipUpgrade/learn-right.svg') no-repeat center;
                            background-size: cover;
                            margin: 0 6px;
                          }
                        }
                        .learn-course {
                          i {
                            width: 18px;
                            height: 12px;
                            background: url('../../../../static/images/vipUpgrade/learn-green.svg') no-repeat center;
                            background-size: cover;
                            margin-left: 4px;
                          }
                        }
                      }
                    }
                    .say-desc {
                      padding-top: 12px;
                      font-size:14px;
                      font-weight:400;
                      color:rgba(10,43,64,1);
                      line-height:20px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.project-header {
  padding: 74px 0 190px;
  text-align: center;
  .title {
    font-size:24px;
    font-weight:bold;
    color:rgba(51,51,51,1);
  }
}
.cards-list {
  width: 960px;
  margin: 0 auto;
  margin-top: -140px;
  ul {
    width: 100%;
    display: flex;
    justify-content: space-between;
    li {
      overflow: hidden;
      position: relative;
      width: 224px;
      background:rgba(255,255,255,1);
      box-shadow:0px 15px 18px 0px rgba(0,41,69,0.2);
      border-radius:5px;
      border:6px solid rgba(230,235,238,1);
      transition: transform .3s;
      -webkit-transition: transform .3s;
      &:hover {
        transform: translateY(-6px)
      }
      .cards {
        padding: 52px 30px 33px;
        .title {
          text-align: center;
        }
        .price {
          padding-top: 41px;
          position: relative;
          text-align: center;
          span:nth-child(1) {
            font-size:26px;
            font-weight:500;
            color:rgba(144,162,174,1);
          }
          span:nth-child(2) {
            font-size:70px;
            font-family:DINCondensed-Bold;
            font-weight:bold;
            color:rgba(0,42,91,1);
          }
          span:nth-child(3) {
            position: absolute;
            bottom: 25px;
            font-size:16px;
            font-weight:bold;
            color:rgba(144,162,174,1);
            text-align: bottom;
          }
        }
        .cross-out {
          position: relative;
          text-align: center;
          text-decoration:line-through;
          display: flex;
          justify-content: center;
          span:nth-child(1) {
            font-size:26px;
            font-weight:500;
            color:rgba(0,42,91,1);
          }
          span:nth-child(2) {
            font-size:26px;
            font-weight:500;
            color:rgba(0,42,91,1);
          }
        }
        .expect {
          width: 100%;
          text-align: center;
          padding: 45px 0 80px;
          span {
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(0,42,91,1);
          }
        }
        .button {
          cursor: pointer;
          width:160px;
          height:36px;
          background:rgba(42,159,228,1);
          border-radius:20px;
          margin: 0 auto;
          text-align: center;
          line-height: 36px;
          p {
            display: inline-block;
            span {
              font-size:14px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(255,255,255,1);
              margin-right: 10px;
            }
            i {
              display: none;
              width: 20px;
              height: 20px;
              background: url('../../../../static/images/authLogin/going.svg') no-repeat center;
              background-size: cover;
              float: right;
              margin-top: 8px;
            }
          }
          &:hover p i {
            display: block;
            transition: padding-right 218ms ease;
          }
        }
        .hint {
          display: inline-block;
          width: 150px;
          height: 86px;
          color: #fff;
          line-height: 144px;
          text-align: left;
          background-color: #FFBE29;
          font-weight: 500;
          position: absolute;
          top: -23px;
          right: -74px;
          font-size: 12px;
          transform: rotate(45deg);
          padding: 0 24px;
        }
        .green {
          display: inline-block;
          width: 150px;
          height: 86px;
          color: #fff;
          line-height: 144px;
          text-align: center;
          background-color: #91D249FF;
          position: absolute;
          top: -32px;
          right: -66px;
          font-size: 12px;
          transform: rotate(45deg);
          padding: 0 24px;
        }
      }
    }
    li:nth-child(3) {
      border:6px solid #FFBE29;
    }
    li:nth-child(4) {
      border:6px solid #91D249FF;
    }
  }
}
.cards-list.cross-list {
  ul {
    li {
      border:2px solid #FFBE29;
      .cards {
        .expect {
          width: 100%;
          text-align: center;
          padding: 26px 0 60px;
        }
      }
      .hint {
        top: -22px;
        right: -82px;
        font-size: 12px;
        padding: 0 29px;
        background-color: rgb(252, 65, 18);
      }
    }
  }
}
</style>
