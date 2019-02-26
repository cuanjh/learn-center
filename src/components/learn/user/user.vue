<template>
  <div class='user-wrap'>
    <div class="user-container row">
      <div class='user-left-bar'>
        <div class='user-left-userDetail'>
          <ol>
            <li id="crop-avatar">
              <img :src="userInfo.photo" class="avatar-view" id='defaultUserImg' @click='uploadPicBtn' >
            </li>
            <li v-text='userInfo.nickname'></li>
            <li>全球说ID:<span v-text='userInfo.talkmate_id'></span></li>
            <li>
              <span>{{ userInfo.following_count }}<em> 关注</em></span>
              <span>{{ userInfo.followed_count }}<em> 粉丝</em></span>
              <i></i>
            </li>
          </ol>
          <div>
            <p><i></i>认证用户</p>
            <router-link tag="p" :class="{'active': judgeVip}" :to="{ path:'/app/user/vip' }"><i></i>会员用户</router-link>
          </div>
        </div>
        <div class="user-left-nav">
          <ul>
            <li :class="{'active': activeItem === 'course' }">
              <router-link tag="p" :to="{ path:'/app/user/course' }"><i></i>课程</router-link>
            </li>
            <li :class="{'active': activeItem === 'doc' }">
              <router-link tag="p" :to="{ path:'/app/user/doc' }"><i></i>档案</router-link>
            </li>
          </ul>
          <ul class='spe-ul'>
            <li :class="{'active': activeItem === 'wallet' }">
              <router-link tag="p" :to="{ path:'/app/user/wallet' }" ><i></i>钱包</router-link>
            </li>
            <li :class="{'active': activeItem === 'vip' }">
              <router-link tag="p" :to="{ path:'/app/user/vip' }" ><i></i>会员</router-link>
            </li>
          </ul>
          <ul class='spe-set'>
            <li :class="{'active': activeItem === 'setting' }">
              <router-link tag="p" :to="{ path:'/app/user/setting' }" ><i></i>设置</router-link>
            </li>
          </ul>
          <ul class='spe-bind' v-if="isAnonymous">
            <li :class="{'active': activeItem === 'bind' }">
              <router-link tag="p" :to="{ path:'/app/user/bind' }" ><i></i>绑定</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class='user-right-wrap'>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import cookie from '../../../tool/cookie'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data () {
    return {
      activeItem: '',
      judgeVip: false
    }
  },
  created () {
    this.$on('activeNavUserItem', (e) => {
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
    isAnonymous () {
      return cookie.getCookie('is_anonymous') === 'true'
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
    uploadPicBtn () {
      $('#avatar-modal').fadeIn()
      console.log(window.location.href)
    }
  }
}
</script>

<style scoped>
.user-wrap {
  /* background: #ecf4f7; */
  width: 100%;
  /*height: 1000px;*/
  min-height: 1000px;
}
.user-container {
  width: 1000px;
  margin: 20px auto;
}
.user-left-bar {
  width: 320px;
  height: 100%;
  /* background: #ecf4f7; */
  float: left;
}
.user-left-userDetail {
  width: 100%;
  height: 330px;
  border-radius: 5px;
  background: #fff;
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
}
.user-left-userDetail ol {
  padding: 35px 43px 0 43px;
  text-align: center;
}
.user-left-userDetail ol li:nth-of-type(1) img {
  display: inline-block;
  width: 120px;
  height: 120px;
  border-radius: 500px;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-left-userDetail ol li:nth-of-type(1) img:hover {
  box-shadow: 0 0 16px 0 rgba(000, 000, 000, 0.3);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.user-left-userDetail ol li:nth-of-type(2) {
  font-size: 18px;
  color: #4a4a4a;
  padding-top: 14px;
}
.user-left-userDetail ol li:nth-of-type(3) {
  color: #9d9d9d;
  font-size: 14px;
}
.user-left-userDetail ol li:nth-of-type(4) {
  position: relative;
  margin-top: 20px;
}
.user-left-userDetail ol li:nth-of-type(4) span {
  color: #4a4a4a;
  font-size: 18px;
  text-align: center;
  margin: 0 20px;
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
.user-left-nav ul {
  border-radius: 5px;
  background: #fff;
  width: 100%;
  /*padding: 0 26.5px;*/
}
.user-left-nav ul li {
  height: 53px;
  padding: 0 28px;
  line-height: 53px;
  background: url(../../../../static/images/learn/learn-user-arrow.svg)
    no-repeat;
  background-position: 280px center;
  cursor: pointer;
  position: relative;
  color: #4a4a4a;
  font-size: 18px;
}
.user-left-nav ul li:hover::before {
  content: "";
  width: 4px;
  height: 44px;
  background-color: #3c9bbe;
  position: absolute;
  top: 4px;
  left: 0;
}
.user-left-nav ul li p {
  padding-left: 25px;
  border-bottom: 1px solid #ededed;
  position: relative;
}
.user-left-nav ul li:nth-last-of-type(1) p {
  border: none;
}
.user-left-nav ul:nth-of-type(1) {
  border-radius: 5px;
  margin-bottom: 20px;
}
.user-right-wrap {
  width: 659px;
  height: 100%;
  float: left;
}
.user-left-nav li i {
  width: 16px;
  height: 16px;
  position: absolute;
  background-image: url(../../../../static/images/learn/learn-user-course.svg);
  background-repeat: no-repeat;
  background-position: center center;
  left: 0;
  top: 50%;
  margin-top: -8.5px;
}
.user-left-nav li:nth-of-type(2) i {
  background-image: url(../../../../static/images/learn/learn-user-zuoye2.svg);
}
.user-left-nav li:nth-of-type(3) i {
  background-image: url(../../../../static/images/learn/learn-user-dangan.svg);
}
.user-left-nav .spe-ul li:nth-of-type(1) i {
  background-image: url(../../../../static/images/learn/learn-user-qianbao.svg);
}
.user-left-nav .spe-ul li:nth-of-type(2) i {
  background-image: url(../../../../static/images/learn/learn-user-huangguan.svg);
}
.user-left-nav li.active {
  background-color: #d9ecf3;
  line-height: 47px;
  border-top: 3px solid #fff;
  border-bottom: 3px solid #fff;
}
.user-left-nav li.active::after {
  content: "";
  width: 4px;
  height: 100%;
  background-color: #3c9bbe;
  position: absolute;
  top: 0;
  left: 0;
}
.user-left-nav li.active p {
  border-bottom: none;
}
.user-right-wrap {
  margin-left: 20px;
}
.spe-set {
  margin-top: 20px;
}
.spe-set li i {
  background-image: url(../../../../static/images/learn/learn-user-shezhi.svg);
}
.spe-bind {
  margin-top: 20px;
}
.spe-bind li i {
  background-image: url(../../../../static/images/learn/learn-user-bind.svg);
}
</style>
