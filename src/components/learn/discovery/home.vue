<template>
  <div class="discovery-wrap">
    <div class="discovery-container">
      <div class="discovery-category">
        <div class="name">
          <span>全球头条</span>
          <router-link tag="span" :to="{path: '/app/headline'}">查看更多<i></i></router-link>
        </div>
        <div class="headline-list">
          <div class="headline-item1" v-for="(item, index) in headlines.slice(0, 1)" :key="'headline-item1' + index" @click="get(item.id)">
            <img v-lazy="item.thumb" :key="item.thumb" alt="">
            <div class="title" v-text="item.title"></div>
            <div class="headline-item1-bottom">
              <span v-text="item.tag_title"></span>
              <span v-text="'阅读 ' + item.hits"></span>
            </div>
          </div>
          <div class="headline-item2" v-for="(item, index) in headlines.slice(1, 9)" :key="'headline-item2' + index" @click="get(item.id)">
            <img v-lazy="item.thumb" :key="item.thumb" alt="">
            <div class="title" v-text="item.title"></div>
            <div class="headline-item2-bottom">
              <span v-text="item.tag_title"></span>
              <span v-text="'阅读 ' + item.hits"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="discovery-category">
        <div class="name">
          <span>电台</span>
          <router-link tag="span" :to="{path: '/app/discovery/radio-home'}">查看更多<i></i></router-link>
        </div>
        <div class="radio-list">
          <div class="radio-item" v-for="item in radios.slice(0, 3)" :key="item.code">
            <a @mouseenter="radioMouseEnter($event)" @mouseleave="radioMouseLeave($event)">
              <img v-lazy="item.cover" :key="item.cover" alt="">
              <div class="gradient-layer-play" @click="loadRadioList($event, item)" style="display: none">
                <i class="play"></i>
              </div>
              <div class="subscribe">
                <i></i>
                <span v-text="item.buy_num"></span>
              </div>
            </a>
            <router-link tag="div" :to="{path: '/app/discovery/radio-detail/' + item.code}" class="title" v-text="item.title"></router-link>
            <div class="author" v-text="item.author_name"></div>
            <div class="money" v-text="(item.money === 0) ? $t('free') : (item.money_type === 'CNY') ? '￥' +item.money : $t('coins') + ' ' + item.money"></div>
          </div>
          <div class="author-item" v-for="item in authors.slice(0, 3)" :key="item.user_id" @click="goToUser(item.user_id)">
            <img v-lazy="item.photo" :key="item.photo" alt="">
            <div class="author-name" v-text="item.author_name"></div>
            <div class="title" v-text="'《' + item.title + '》'"></div>
          </div>
          <div class="radio-item" v-for="item in radios.slice(3)" :key="item.code">
            <a @mouseenter="radioMouseEnter($event)" @mouseleave="radioMouseLeave($event)">
              <img v-lazy="item.cover" :key="item.cover" alt="">
              <div class="gradient-layer-play" @click="loadRadioList($event, item)" style="display: none">
                <i class="play"></i>
              </div>
              <div class="subscribe">
                <i></i>
                <span v-text="item.buy_num"></span>
              </div>
            </a>
            <router-link tag="div" :to="{path: '/app/discovery/radio-detail/' + item.code}" class="title" v-text="item.title"></router-link>
            <div class="author" v-text="item.author_name"></div>
            <div class="money" v-text="(item.money === 0) ? $t('free') : (item.money_type === 'CNY') ? '￥' +item.money : $t('coins') + ' ' + item.money"></div>
          </div>
        </div>
      </div>
      <div class="discovery-category">
        <div class="name">热门游戏</div>
        <div class="game-list">
          <div class="game-item" v-for="(item, index) in games" :key="'game' + index">
            <img v-lazy="item.image_url" :key="item.image_url" alt="">
            <div class="name" v-text="item.name"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Bus from '../../../bus'
import $ from 'jquery'

export default {
  data () {
    return {
      authors: [],
      headlines: [],
      radios: [],
      games: []
    }
  },
  // components: {
  //   VoicePlayer
  // },
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'discovery')
    this.postDisvHome().then((res) => {
      console.log('发现首页', res)
      this.authors = res.data.authors
      this.headlines = res.data.headlines
      this.radios = res.data.radios
      this.games = res.data.games
    })
  },
  methods: {
    ...mapActions({
      postDisvHome: 'course/postDisvHome'
    }),
    loadRadioList (e, item) {
      if (this.isPlay && item.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
        $(e.target).addClass('play')
        Bus.$emit('radioPause')
      } else {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target).removeClass('play')
        $(e.target).addClass('pause')
        $('.gradient-layer-play').not($(e.target).parent()).hide()
        if (item.code !== this.lastCode) {
          Bus.$emit('getRadioCardList', item)
          this.lastCode = item.code
        } else {
          Bus.$emit('radioPlay')
        }
      }
      this.isPlay = !this.isPlay
    },
    radioMouseEnter (e) {
      $('.gradient-layer-play', $(e.target)).show()
    },
    radioMouseLeave (e) {
      if ($('.gradient-layer-play i', $(e.target)).hasClass('play')) {
        $('.gradient-layer-play', $(e.target)).hide()
      }
    },
    get (id) {
      this.$router.push({
        path: `/app/headline-details/${id}`
      })
    },
    goToUser (userId) {
      this.$router.push({
        path: `/app/discovery/author-detail/${userId}`
      })
    }
  }
}
</script>

<style scoped>
.discovery-wrap {
  /* background: #ecf4f7; */
  width: 100%;
  min-height: 1000px;
}

.discovery-container {
  width: 1200px;
  /* height: 100%;
  background-color: red; */
  margin: 0 auto 100px;
}

.discovery-category {
  width: 100%;
  margin-top: 35px;
  display: inline-block;
}

.discovery-category .name {
  font-size: 20px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 5px;
}

.discovery-category .name span:first-child {
  font-size: 20px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 5px;
}

.discovery-category .name span:last-child {
  float:right;
  font-size: 15px;
  color: #2A9FE4;
  font-weight: bold;
  margin-bottom: 5px;
  margin-right: 30px;
  cursor: pointer;
}

.discovery-category .name span:last-child i{
  width: 5px;
  height: 9px;
  background-image: url('../../../../static/images/discovery/home-more.png');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 8px;
  margin-left: 5px;
}

.headline-list {
  width: 100%;
  float: left;
}

.headline-list .headline-item1 {
  cursor: pointer;
  float: left;
  width: 460px;
  height: 236px;
  margin-top: 20px;
  margin-right: 20px;
  box-shadow: 1px 2px 8px rgba(218, 230, 243, .56);
}
.headline-list .headline-item1:hover {
  box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -ms-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}

.headline-list .headline-item1 img {
  width: 100%;
  height: 236px;
  object-fit: cover;
  border-radius: 4px;
}

.headline-list .headline-item1 .title {
  color: #ffffff;
  font-size: 16px;
  margin-top: -70px;
  margin-left: 10px;
}

.headline-list .headline-item1 .headline-item1-bottom {
  color: #dddddd;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 10px;
}

.headline-list .headline-item1 .headline-item1-bottom span:last-child{
  margin-left: 15px;
}

.headline-list .headline-item2 {
  cursor: pointer;
  float: left;
  width: 220px;
  height: 236px;
  margin-top: 20px;
  margin-right: 20px;
  background-color: #ffffff;
  box-shadow: 1px 2px 8px rgba(218, 230, 243, .56);
  border-radius: 4px;
}
.headline-list .headline-item2:hover {
  box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -ms-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.headline-list .headline-item2 img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.headline-list .headline-item2 .title {
  color: #333333;
  font-size: 14px;
  margin: 0 10px;
  margin-top: 15px;
  line-height: 20px;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.headline-list .headline-item2 .headline-item2-bottom {
  color: #B8B8B8;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 10px;
}

.headline-list .headline-item2 .headline-item2-bottom span:last-child{
  float:right;
  margin-right: 15px;
}

.radio-list {
  width: 100%;
  float: left;
}
.radio-item {
  float: left;
  width: 220px;
  min-width: 220px;
  height: 223px;
  margin-top: 20px;
  margin-right: 20px;
  background: #ffffff;
  box-shadow: 1px 2px 8px rgba(218, 230, 243, .56);
  border-radius: 4px;
}

.radio-item img {
  width: 100%;
  height: 117px;
  object-fit: cover;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  z-index: 1;
}

.radio-item .gradient-layer-play {
  width: 220px;
  height: 117px;
  position: absolute;
  background-image: url('../../../../static/images/discovery/radio-gradient-layer.png');
  background-repeat: no-repeat;
  background-size: cover;
  margin-top: -117px;
  text-align:  center;
  z-index: 2;
}

.radio-item .gradient-layer-play .play {
  width: 52px;
  height: 52px;
  background-image: url('../../../../static/images/discovery/radio-list-play.svg');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 30px;
}

.radio-item .gradient-layer-play .pause {
  width: 52px;
  height: 52px;
  background-image: url('../../../../static/images/discovery/radio-list-pause.svg');
  background-repeat: no-repeat;
  background-size: cover;
  display: inline-block;
  margin-top: 30px;
}

.radio-item .subscribe {
  position: relative;
  display: -webkit-box;
  margin-top: -25px;
  z-index: 3;
}

.radio-item .subscribe i {
  display: inline-block;
  margin: 0 8px;
  width: 14px;
  height: 14px;
  background-image: url('../../../../static/images/discovery/home-radio.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.radio-item .subscribe span {
  color: #ffffff;
  font-size: 12px;
  display: inline-block;
  margin-top: -5px;
  margin-left: -3px;
}

.radio-item .title {
  margin: 15px 10px;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
}
.radio-item:hover {
  box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -ms-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.radio-item .author {
  color: #B8B8B8;
  width: 120px;
  font-size: 12px;
  display: inline-block;
  position: relative;
  margin-left: 10px;
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.radio-item .money {
  color: #B8B8B8;
  font-size: 12px;
  float: right;
  /* display: inline-block; */
  position: relative;
  margin-right: 18px;
  margin-top: 10px;
}

.author-item {
  cursor: pointer;
  float: left;
  width: 140px;
  min-width: 140px;
  height: 223px;
  margin-top: 20px;
  margin-right: 20px;
  background: #ffffff;
  box-shadow: 1px 2px 8px rgba(218, 230, 243, .56);
  border-radius: 4px;
}
.author-item:hover {
  box-shadow: 0 0 26px 0 rgba(000, 000, 000, 0.3);
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -ms-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.author-item img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 35px auto;
  display: block;
  position: relative;
}

.author-item .author-name {
  color: #333333;
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.author-item .title {
  color: #999999;
  width: 120px;
  font-size: 14px;
  margin: 0 auto;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-list {
  width: 100%;
  float: left;
}

.game-item {
  float: left;
  width: 220px;
  min-width: 220px;
  height: 265px;
  margin-top: 20px;
  margin-right: 20px;
  background: #ffffff;
  box-shadow: 1px 2px 8px rgba(218, 230, 243, .56);
  border-radius: 4px;
}

.game-item img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.game-item .name {
  color: #444444;
  font-size: 14px;
  margin: 10px 5px;
}
</style>
