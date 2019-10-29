<template>
  <div class='user-wrap'>
    <div class="user-container row">
      <div class='user-left-bar'>
        <div class='user-left-userDetail'>
          <ol>
            <li id="crop-avatar">
              <img :src="userInfo ? userInfo.photo : ''" class="avatar-view" id='defaultUserImg' @click='uploadPicBtn' >
            </li>
            <li v-text="userInfo ? userInfo.nickname : ''"></li>
            <li class="is-vip" v-if="isVip == 1">
              <i class="vip-icon"></i>
              <span>会员到期时间：{{endTime}}</span>
            </li>
            <li v-else>
              <i class="no-icon"></i>
              <span>你还不是会员</span>
              <a @click="goVip()">成为会员</a>
            </li>
            <li v-if="userInfo">
              <a @click="goUserFollowing('follow')"
                  :class="{'active': activeItem === 'follow' }">
                <span>{{userInfo.following_count ? userInfo.following_count : '0'}}</span>
                <span >关注</span>
              </a>
              <a @click="goUserFollow('followed')"
                  :class="{'active': activeItem === 'followed' }">
                <span>{{userInfo.followed_count ? userInfo.followed_count : '0'}}</span>
                <span >粉丝</span>
              </a>
              <a  @click="goUserDynamic('dynamic')"
                  :class="{'active': activeItem === 'dynamic' }">
                <span>{{'0'}}</span>
                <span >动态</span>
              </a>
            </li>
          </ol>
          <div v-show="false">
            <p><i></i>认证用户</p>
            <router-link tag="p" :class="{'active': judgeVip}" :to="{ path:'/app/vip-home' }" target="_blank"><i></i>会员用户</router-link>
          </div>
        </div>
        <div class="user-left-nav">
          <ul>
            <li>
              <router-link :class="{'active': activeItem === 'course' }"
                           :to="{ path:'/app/user/course' }">
                <i class="course"></i><span>课程</span>
              </router-link>
            </li>
            <li v-show="false">
              <a href="javascript:;">
                <i class="certification"></i><span>认证</span>
              </a>
            </li>
            <li>
              <router-link :class="{'active': activeItem === 'wallet' }"
                           :to="{ path:'/app/user/wallet' }">
                <i class="wallet"></i><span>钱包</span>
              </router-link>
            </li>
            <li>
              <router-link :class="{'active': activeItem === 'doc' }"
                           :to="{ path:'/app/user/doc' }">
                <i class="doc"></i><span>档案</span>
              </router-link>
            </li>
            <li>
              <router-link :class="{'active': activeItem === 'setting' }"
                           :to="{ path:'/app/user/setting' }">
                <i class="setting"></i><span>设置</span>
              </router-link>
            </li>
            <li  v-if="isAnonymous">
              <router-link :class="{'active': activeItem === 'bind' }"
                           :to="{ path:'/app/user/bind' }">
                <i class="spe-bind"></i><span>绑定</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class='user-right-wrap'>
        <user-vip-box :isVip="isVip" :startTime="startTime" :endTime="endTime"></user-vip-box>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Bus from '../../../bus.js'
import cookie from '../../../tool/cookie'
import { mapState, mapMutations, mapActions } from 'vuex'
import UserVipBox from './userVipBox.vue'

export default {
  data () {
    return {
      activeItem: '',
      judgeVip: false
    }
  },
  components: {
    UserVipBox
  },
  created () {
    this.$on('activeNavUserItem', (e) => {
      console.log('activeNavUserItem', e)
      this.activeItem = e
    })
    this.$on('activate', e => {
      $('#avatar-modal').hide()
    })
  },
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'user')
    this.getTradeRecord()
    this.getCoinsProduct()
    this.getMemberProductsList()
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    isVip () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return 0
      }
      return this.userInfo.member_info.member_type
    },
    isAnonymous () {
      return cookie.getCookie('is_anonymous') === 'true'
    },
    startTime () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return
      }
      var startTime = this.userInfo.member_info.start_time * 1000 || 0
      var date = new Date(startTime)
      var Y = date.getFullYear() + '-'
      var M = date.getMonth() + 1 + '-'
      var D = date.getDate()
      return Y + M + D
    },
    endTime () {
      if (!this.userInfo || !this.userInfo.member_info) {
        return
      }
      var endTime = this.userInfo.member_info.end_time * 1000 || 0
      var date = new Date(endTime)
      var Y = date.getFullYear() + '-'
      var M = date.getMonth() + 1 + '-'
      var D = date.getDate()
      return Y + M + D
    }
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
      getTradeRecord: 'user/getTradeRecord',
      getCoinsProduct: 'user/getCoinsProduct',
      getMemberProductsList: 'user/getMemberProductsList'
    }),
    // 关注
    goUserFollowing (navNum) {
      console.log(navNum)
      this.activeItem = navNum
      this.$emit('activeNavUserItem', navNum)
      // this.$router.push({path: '/app/user/user-follow'})
      this.$router.push({name: 'userFollow', params: {navFlag: navNum}})
      Bus.$emit('activeUserItem', navNum)
    },
    // 粉丝
    goUserFollow (navNum) {
      console.log(navNum)
      this.activeItem = navNum
      this.$emit('activeNavUserItem', navNum)
      // this.$router.push({path: '/app/user/user-follow'})
      this.$router.push({name: 'userFollow', params: {navFlag: navNum}})
      Bus.$emit('activeUserItem', navNum)
    },
    // 动态
    goUserDynamic (navNum) {
      this.activeItem = navNum
      this.$emit('activeNavUserItem', navNum)
      // this.$router.push({path: '/app/user/user-follow'})
      this.$router.push({name: 'userFollow', params: {navFlag: navNum}})
      Bus.$emit('activeUserItem', navNum)
    },
    uploadPicBtn () {
      $('#avatar-modal').fadeIn()
      console.log(window.location.href)
    },
    // 成为会员
    goVip () {
      if (!this.userInfo) {
        Bus.$emit('showGoLoginBox')
        return
      }
      let desc = '成为会员'
      if (this.isVip === 1) {
        desc = '升级会员'
      }
      window._czc.push(['_trackEvent', '学习系统', 'VIP banner', desc, '', '.vip-btn'])
      // this.$router.push({ path: '/app/vip-home' })
      let routeUrl = this.$router.resolve({
        path: '/app/vip-home'
      })
      window.open(routeUrl.href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.user-wrap {
  width: 100%;
}

.user-container {
  width: 1200px;
  margin: 0px auto 40px;
}
.user-left-bar {
  width: 280px;
  height: 100%;
  margin-top: 40px;
  margin-right: 20px;
}
.user-left-userDetail {
  width: 100%;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
  position: relative;
}
.user-left-userDetail ol {
  padding: 35px 52px 32px;
  text-align: center;
}
.user-left-userDetail ol li:nth-of-type(1) img {
  display: inline-block;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 5px solid #F1F4F6;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-left-userDetail ol li:nth-of-type(1) img:hover {
  box-shadow: 0 0 10px 0 rgba(200, 212, 219, 1);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-left-userDetail ol li:nth-of-type(2) {
  font-size:18px;
  font-weight:bold;
  color:rgba(51,51,51,1);
  padding-top: 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.user-left-userDetail ol li:nth-of-type(3) {
  font-size:12px;
  font-weight:500;
  color:rgba(60,91,111,1);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 8px;
  a{
    font-size:12px;
    font-weight:600;
    color:rgba(255,190,41,1);
    padding: 2px 8px;
    line-height: 14px;
    border-radius:11px;
    border:1px solid rgba(255,190,41,1);
    margin-left: 10px;
  }
  i {
    display: inline-block;
    width: 18px;
    height: 18px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-right: 6px;
    margin-bottom: 4px;
  }
  .no-icon {
    background-image: url('../../../../static/images/userInfo/no-vip.svg');
  }
}
.user-left-userDetail ol li:nth-of-type(3).is-vip {
  span {
    font-size:12px;
    font-family:PingFangSC-Semibold;
    font-weight:500;
    color:rgba(60,91,111,1);
    border-radius:11px;
    border:0px solid;
    padding: 0;
    line-height: 18px;
    margin-left: 0px;
  }
  .vip-icon {
    background-image: url('../../../../static/images/userInfo/is-vip.svg');
  }
}

.user-left-userDetail ol li:nth-of-type(4) {
  font-size:20px;
  font-weight:bold;
  color:rgba(10,43,64,1);
  display: flex;
  justify-content: space-between;
  padding-top: 24px;
  padding-bottom: 26px;
  border-bottom: 1px solid #F2F2F2FF;
  a {
    display: inline-block;
    &:hover {
      span,span:nth-child(2) {
        color: #2A9FE4;
      }
    }
    &.active {
      span,span:nth-child(2) {
        color: #2A9FE4;
      }
    }
    span {
      display: block;
    }
    span:nth-child(2) {
      font-size:12px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(153,153,153,1);
    }
  }
}
.user-left-userDetail div {
  width: 100%;
  height: 34px;
  line-height: 34px;
  text-align: center;
  color: #fff;
  margin-top: 34px;
  font-size: 14px;
}
.user-left-userDetail div p:nth-of-type(1) {
  width: 50%;
  background-color: #dcdadb;
  float: left;
  cursor: default;
  background-image: url(../../../../static/images/learn/learn-user-renzheng.svg);
  background-repeat: no-repeat;
  background-position: 39px center;
  padding-left: 15px;
}
.user-left-userDetail div p:nth-of-type(2) {
  width: 50%;
  background-color: #e0dfdf;
  float: left;
  cursor: pointer;
  background-image: url(../../../../static/images/learn/learn-user-huiyuan.svg);
  background-repeat: no-repeat;
  background-position: 39px center;
  padding-left: 15px;
}
.user-left-userDetail div p:nth-of-type(2):hover {
  background-color: #ffbb03;
}
.user-left-userDetail div p.active {
  background-color: #fdc62e;
}
.user-left-userDetail ol li:nth-of-type(4) i {
  width: 2px;
  height: 100%;
  background-color: #dcdadb;
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -1px;
}

// 左边导航
.user-left-nav {
  width: 100%;
  background: #ffffff;
  padding-bottom: 66px;
  ul {
    li {
      padding-bottom: 10px;
      a {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 10px 0;
        border-left: 3px solid #ffffff;
        i {
          display: inline-block;
          width: 15px;
          height: 17px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          margin-left: 51px;
          margin-right: 15px;
        }
        .course {
          background-image: url('../../../../static/images/userInfo/course.svg');
        }
        .certification {
          background-image: url('../../../../static/images/userInfo/certification.svg');
        }
        .wallet {
          width: 18px;
          height: 15px;
          background-image: url('../../../../static/images/userInfo/wallet.svg');
          margin-right: 12px;
        }
        .doc {
          width: 18px;
          height: 16px;
          background-image: url('../../../../static/images/userInfo/doc.svg');
          margin-right: 12px;
        }
        .setting {
          width: 17px;
          height: 16px;
          background-image: url('../../../../static/images/userInfo/setting.png');
          margin-right: 13px;
        }
        .spe-bind {
          width: 15px;
          height: 15px;
          background-image: url('../../../../static/images/userInfo/spe-bind.svg');
          margin-right: 13px;
        }
        &:hover {
          color: #2A9FE4FF;
          background: #EEF2F3FF;
          border-left: 3px solid #2A9FE4FF;
          .course {
            background-image: url('../../../../static/images/userInfo/course-hover.svg');
          }
          .certification {
            background-image: url('../../../../static/images/userInfo/certification-hover.svg');
          }
          .wallet {
            background-image: url('../../../../static/images/userInfo/wallet-hover.svg');
          }
          .doc {
            background-image: url('../../../../static/images/userInfo/doc-hover.svg');
          }
          .setting {
            background-image: url('../../../../static/images/userInfo/setting-hover.png');
          }
          .spe-bind {
            width: 15px;
            height: 15px;
            background-image: url('../../../../static/images/userInfo/spe-bind-hover.svg');
            margin-right: 13px;
          }
        }
        &.active {
          color: #2A9FE4FF;
          background: #EEF2F3FF;
          border-left: 3px solid #2A9FE4FF;
          .course {
            background-image: url('../../../../static/images/userInfo/course-hover.svg');
          }
          .certification {
            background-image: url('../../../../static/images/userInfo/certification-hover.svg');
          }
          .wallet {
            background-image: url('../../../../static/images/userInfo/wallet-hover.svg');
          }
          .doc {
            background-image: url('../../../../static/images/userInfo/doc-hover.svg');
          }
          .setting {
            background-image: url('../../../../static/images/userInfo/setting-hover.png');
          }
          .spe-bind {
            width: 15px;
            height: 15px;
            background-image: url('../../../../static/images/userInfo/spe-bind-hover.svg');
            margin-right: 13px;
          }
        }
      }
    }
    li:last-child {
      padding-bottom: 0;
    }
  }
}
.user-right-wrap {
  width: 890px;
  height: 100%;
  margin-top: 40px;
}
.spe-set {
  margin-top: 20px;
}
.spe-set li i {
  background-image: url(../../../../static/images/learn/learn-user-shezhi.svg);
}
.spe-bind li i {
  background-image: url(../../../../static/images/learn/learn-user-bind.svg);
}
</style>
