<template>
  <div v-if="dynamic.info">
    <div class="item-top">
      <div class="people-img" v-if="dynamic.info">
        <img :src="dynamic.info.photo | urlFix('imageView2/0/w/200/h/200/format/jpg')" alt="动态头像">
        <div class="country" v-if="dynamic.info.author_info">
          <img :src="dynamic.info.author_info.country_flag" alt="国家">
        </div>
      </div>
      <div class="learn-coures-right">
        <p>{{dynamic.info.nickname}}</p>
        <!-- <div class="learn-one">
          <span>英语</span>
        </div> -->
        <div class="learn-more">
          <div class="language">
            <p>
              <span v-for="(lang, index) in dynamic.info.lang_infos" :key="index">
                {{lang.name}}&ensp;
              </span>
            </p>
          </div>
        </div>
      <div class="attention">
        <div class="relation" @click="relation()">
          <a v-if="dynamic.info.has_followed === false">关注</a>
          <a v-else>已关注</a>
        </div>
        <div class="jiantou">
          <i></i>
        </div>
      </div>
      </div>
    </div>
    <div class="homework-info" v-if="dynamic.info.type_info === 'homework'">
      <div class="dynamic-details">
        <span>#{{dynamic.info.topic_info.topic_title}}#</span>
        <span>{{dynamic.info.topic_info.other_info}}</span>
      </div>
      <!--  @click="play(dynamic)" :class="{'play': !isPlay, 'pause': isPlay}"-->
      <div class="audio-play-box" :class="{'play': !isPlay, 'pause': isPlay}" @click="play(dynamic)">
        <audio id="record-sound" :src="dynamic.info.sound_url" />
        <i class="note-line">
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
        </i>
        <!--  v-text="toParseTime(card.sound_time) sound_time" -->
        <span class="hour" v-text="toParseTime(dynamic.info.sound_time)"></span>
      </div>
      <div class="sentence">
        <span>{{dynamic.info.content}}</span>
      </div>
    </div>
    <div class="text-info" v-if="dynamic.info.type_info === 'text'">
      <div class="dynamic-details">
        <span>{{dynamic.info.topic_info.topic_title?'#'+dynamic.info.topic_info.topic_title+'#':''}}</span>
        <span>{{dynamic.info.content.replace(/#[^#]+#/g,'')}}</span>
      </div>
    </div>
    <div class="img-info" v-if="dynamic.info.type_info === 'image'">
      <div class="dynamic-details">
         <span>{{dynamic.info.topic_info.topic_title?'#'+dynamic.info.topic_info.topic_title+'#':''}}</span>
        <span>{{dynamic.info.content.replace(/#[^#]+#/g,'')}}</span>
      </div>
      <div class="images-content">
        <div class="images" v-if="dynamic.info">
          <div class="img-lists" v-if="dynamic.info.image_urls.length===1">
            <div class="img-item-big" v-for="(item, index) in dynamic.info.image_urls" :key="index">
              <img :src="item" alt="动态图片">
            </div>
          </div>
          <div class="img-lists" v-else>
            <div class="img-item" v-for="(img, index) in dynamic.info.image_urls" :key="index">
              <img :src="img" alt="动态图片">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sound-info" v-if="dynamic.info.type_info === 'sound'">
      <div class="dynamic-details">
        <span>{{dynamic.info.topic_info.topic_title?'#'+dynamic.info.topic_info.topic_title+'#':''}}</span>
        <span>{{dynamic.info.content.replace(/#[^#]+#/g,'')}}</span>
      </div>
      <!--  @click="play(dynamic)" :class="{'play': !isPlay, 'pause': isPlay}"-->
      <div class="audio-play-box" :class="{'play': !isPlay, 'pause': isPlay}" @click="play(dynamic)">
        <audio id="record-sound" :src="dynamic.info.sound_url" />
        <i class="note-line">
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
        </i>
        <!--  v-text="toParseTime(card.sound_time) sound_time" -->
        <span class="hour" v-text="toParseTime(dynamic.info.sound_time)"></span>
      </div>
    </div>
    <div class="video-info" v-if="dynamic.info.type_info === 'video'">
      <div class="dynamic-details">
        <span>{{dynamic.info.topic_info.topic_title?'#'+dynamic.info.topic_info.topic_title+'#':''}}</span>
        <span>{{dynamic.info.content.replace(/#[^#]+#/g,'')}}</span>
      </div>
      <!-- width="320" height="240" -->
      <div class="audio-video-box">
        <video class="record-video" id="record-video" :src="dynamic.info.video_url" controls/>
      </div>
    </div>
    <div class="dialectCourse-info" v-if="dynamic.info.type_info === 'dialectCourse'">
      <div class="dynamic-details">
        <span>{{dynamic.info.topic_info.topic_title?'#'+dynamic.info.topic_info.topic_title+'#':''}}</span>
        <span>{{dynamic.info.content.replace(/#[^#]+#/g,'')}}</span>
      </div>
      <!-- width="320" height="240" -->
      <div class="dialectCourse-box">
        <div class="dialectCourse-img">
          <img :src="dynamic.info.image_urls[0]" alt="母语代言">
        </div>
        <div class="dialectCourse-play-box">
          <!-- <audio id="record-sound" :src="dynamic.info.sound_url" /> -->
          <i class="note-line">
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
          </i>
        </div>
      </div>
    </div>
    <div class="dialectCourse-info" v-if="dynamic.info.type_info === 'langTopicCourse'">
      <div class="dynamic-details">
        <span>{{dynamic.info.topic_info.topic_title?'#'+dynamic.info.topic_info.topic_title+'#':''}}</span>
        <span>{{dynamic.info.content.replace(/#[^#]+#/g,'')}}</span>
      </div>
      <!-- width="320" height="240" -->
      <div class="dialectCourse-box">
        <div class="dialectCourse-img">
          <img :src="dynamic.info.image_urls[0]" alt="母语代言">
        </div>
        <div class="dialectCourse-play-box">
          <!-- <audio id="record-sound" :src="dynamic.info.sound_url" /> -->
          <i class="note-line">
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
            <span :class="{loadding:loadding}"></span>
          </i>
        </div>
      </div>
    </div>
    <!-- 打赏，分享，评论 video-->
    <div class="description">
      <p @click="clickShoeReview()">
        <i class="comment"></i>
        <span>{{dynamic.info.comment_num}}</span>
      </p>
      <p @click="clickReward(dynamic.info.id)">
        <i class="coins" :class="{'active': activeReward}"></i>
        <span>{{dynamic.info.reward_num}}</span>
      </p>
      <div class="coin-ball" v-show="coinBallShow">
        <i class="coin-ball-correct"></i>
      </div>
      <p>
        <i class="share"></i>
        <span>{{dynamic.info.shared_num}}</span>
      </p>
    </div>
    <!-- 评论的输入框 -->
    <div class="review" v-show="reviewShow">
      <div class="review-content">
        <div class="text">
          <textarea id="character"
                    autocomplete="off"
                    v-model="content"
                    placeholder="说点什么吧~~">
          </textarea>
        </div>
        <div class="review-pic">
          <div class="face" @click="showEmoji = !showEmoji">
            <i :class="{active: showEmoji === true}"></i>
            <span>表情</span>
          </div>
          <div class="send" @click="send(dynamic.info.id, dynamic.info.type_info)">
            <span>发送</span>
          </div>
        </div>
      </div>
      <!-- 表情包 -->
      <transition name="fade" mode="">
        <div class="emoji-box" v-if="showEmoji" >
          <ul class="emojiWrap">
            <li v-for="(item,i) in emojiData" :key="i" v-html="item" @click="chooseEmoji(i, $event)" ></li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="hit" v-show="hitShow">
      <div class="hit-lists">
        <ul>
          <span>{{dynamic.info.reward_num}}个打赏</span>
          <li v-for="(reward, index) in dynamic.rewardLists" :key="index">
            <img :src="reward.photo" alt="打赏人头像">
          </li>
          <i class="circle"></i>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Cookie from '../../../tool/cookie'
import Bus from '../../../bus'
import SoundCtrl from '../../../plugins/soundCtrl'

export default {
  props: ['dynamic'],
  data () {
    return {
      loadding: false,
      coinBallShow: false,
      activeReward: false,
      reviewShow: false, // 评论输入框
      hitShow: true, // 打赏名单
      showEmoji: false, // 笑脸表情
      emojiDataUTF: [],
      emojiData: [],
      content: '', // input输入的内容
      curRadio: {},
      duration: 0,
      curTime: 0,
      isPlay: false,
      isEnd: false,
      sndctr: SoundCtrl
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo // 用户信息
    })
  },
  created () {
    Bus.$on('radioPlay', () => {
      this.play()
    })
    Bus.$on('radioPause', () => {
      this.end()
      this.isPlay = !this.isPlay
    })
  },
  mounted () {
    for (let key in this.$emoji.EMOJI_MAP) {
      this.emojiDataUTF.push(key) // 和后端交互时使用UTF码
      this.emojiData.push(this.$emoji.unifiedToHTML(key))
    }
  },
  methods: {
    ...mapActions({
      getRadioRelationFollow: 'course/getRadioRelationFollow', // 关注
      remRadioRelationCancel: 'course/remRadioRelationCancel', // 取消关注
      radioAuthorCommentRewardList: 'course/radioAuthorCommentRewardList', // 动态打赏列表接口
      radioAuthorCommentReward: 'course/radioAuthorCommentReward', // 打赏动态奖励的接口
      radioAuthorCommentPub: 'course/radioAuthorCommentPub' // 发表动态评论、批改作业接口
    }),
    toParseTime (data) {
      let m = parseInt(data / 60)
      if (m < 10) {
        m = '0' + m
      }
      let s = Math.round(data % 60)
      if (s < 10) {
        s = '0' + s
      }
      return m + ':' + s
    },
    play (dynamic) {
      console.log('dynamic', dynamic)
      this.playRadio(dynamic)
      if (this.isEnd) {
        this.curTime = 0
        this.isEnd = false
      }
      if (this.isPlay) {
        this.pause()
      } else {
        this.sndctr.play(() => {
          this.end()
        })
        this.isPlay = !this.isPlay
      }
    },
    end () {
      this.isPlay = false
      this.isEnd = true
      clearInterval(this.interval)
    },
    pause () {
      this.sndctr.pause()
      this.isPlay = false
      clearInterval(this.interval)
    },
    playRadio (dynamic) {
      this.curRadio = dynamic.info.sound_url
      this.curTime = 0
      this.isEnd = false
      this.sndctr.setSndCallback(this.curRadio, () => {
        this.duration = Math.round(this.sndctr.getDuration())
        console.log('duration', this.duration)
      })
      this.isPlay = true
      this.loadding = true
      this.sndctr.play(() => {
        this.end()
        this.loadding = false
        console.log('end')
      })
    },
    // 评论输入框
    clickShoeReview () {
      this.reviewShow = !this.reviewShow
      this.hitShow = !this.hitShow
    },
    // 评论
    send (id, typeInfo) {
      this.radioAuthorCommentPub({id: id, type_info: typeInfo, comment: this.content}).then((data) => {
        console.log('点击评论返回', data)
        this.content = '' // 在返回结束时清空内容
        // 处理评论列表的内容
        this.dynamic.info.comment_num += 1
      })
    },
    // 打赏动态
    clickReward (id) {
      let currentUserId = Cookie.getCookie('user_id')
      if (this.dynamic.info.has_rewarded) {
        alert('你已经打赏过了~~~')
      } else {
        this.radioAuthorCommentReward({id: id, to_user_id: currentUserId}).then(res => {
          this.radioAuthorCommentRewardList({id: id}).then(data => {
            console.log('打赏列表', data)
            this.dynamic.info.has_rewarded = true
            this.dynamic.info.reward_num += 1
            this.activeReward = true
            this.coinBallShow = true
            setTimeout(() => {
              this.coinBallShow = false
            }, 2000)
            this.dynamic.rewardLists = data.detail.rewards.reverse()
          })
        })
      }
    },
    // 关注
    relation () {
      if (!this.userInfo) {
        Bus.$emit('showGoLoginBox')
        return
      }
      let _this = this
      let followId = _this.dynamic.info.user_id
      if (_this.dynamic.info.has_followed === true) {
        _this.remRadioRelationCancel({following_id: followId}).then(data => {
          if (data.success) {
            _this.dynamic.info.has_followed = false
          }
        })
      } else {
        _this.getRadioRelationFollow({following_id: followId}).then(data => {
          if (data.success) {
            _this.dynamic.info.has_followed = true
          }
        })
      }
    },
    // 点击表情添加到input框
    chooseEmoji (index, e) {
      console.log('e', e)
      let text = e.target.innerHTML
      this.content = this.content + text
      this.showEmoji = !this.showEmoji
    }
  }
}
</script>
<style lang="less" scoped>
.item-top {
  display: flex;
  .people-img {
    position: relative;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .country {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .learn-coures-right {
    width: 100%;
    position: relative;
    p {
      font-size:14px;
      font-weight:600;
      color:rgba(10,43,64,1);
    }
    .learn-one {
      font-size:12px;
      font-weight:500;
      color:rgba(144,162,174,1);
    }
    .learn-more {
      font-size:12px;
      font-weight:500;
      color:rgba(144,162,174,1);
      span {
        display: inline-block;
        font-size:12px;
        font-weight:500;
        color:rgba(144,162,174,1);
        // i {
        //   display: inline-block;
        //   width: 10px;
        //   height: 11px;
        //   background: url('../../../../static/images/community/Line.svg') no-repeat center;
        //   background-size: 100%;
        //   margin-top: 6px;
        // }
      }
    }
    .attention {
      cursor: pointer;
      position: absolute;
      top: 8px;
      right: 0;
      text-align: center;
      display: flex;
      .relation {
        margin-right: 15px;
        a {
          font-size:12px;
          font-weight:bold;
          color:rgba(42,159,228,1);
          padding: 0 16px;
          border-radius:16px;
          border:1px solid rgba(213,221,226,1);
        }
      }
      .jiantou {
        i {
          display: inline-block;
          width: 8px;
          height: 24px;
          background: url('../../../../static/images/community/jiantou.svg') no-repeat center;
          background-size: 100%;
        }
      }
    }
  }
}
.dynamic-details {
  width: 100%;
  font-size:14px;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:20px;
  margin: 15px 0;
  span:nth-child(1) {
    color: rgb(15, 133, 230);
  }
}
// 作业
.homework-info {
  .audio-play-box {
    cursor: pointer;
    width: 266px;
    height: 36px;
    background: #2A9FE4;
    border-radius: 5px;
    position: relative;
    left: 0;
    top: 0;
    i {
      display: flex;
      // width: 70px;
      height: 32px;
      padding: 0 6px;
      margin: 0 auto;
      align-items: center;
      font-style: normal;
      // margin-right: 200px;
    }
    i span {
      display: inline-block;
      width: 4px;
      height: 8px;
      border-radius: 127px;
      margin-right: 4px;
      background: #ffffff;
      // -webkit-animation: load 1s ease infinite;
      // animation-play-state: paused;
      &.loadding {
        -webkit-animation: loadding 1s ease infinite;
      }
      &:nth-child(1){
        animation-delay:0.2s;
        -webkit-animation-delay:0.2s;
        -ms-animation-delay:0.2s;
        -o-animation-delay:0.2s;
        -moz-animation-delay:0.2s;
      }
      &:nth-child(2){
        animation-delay:0.3s;
        -webkit-animation-delay:0.3s;
        -ms-animation-delay:0.3s;
        -o-animation-delay:0.3s;
        -moz-animation-delay:0.3s;
      }
      &:nth-child(3){
        height: 16px;
      }
      &:nth-child(4){
        height: 16px;
        animation-delay:0.1s;
        -webkit-animation-delay:0.1s;
        -ms-animation-delay:0.1s;
        -o-animation-delay:0.1s;
        -moz-animation-delay:0.1s;
      }
      &:nth-child(5){
        animation-delay:0.4s;
        -webkit-animation-delay:0.4s;
        -ms-animation-delay:0.4s;
        -o-animation-delay:0.4s;
        -moz-animation-delay:0.4s;
      }
      &:nth-child(6){
        animation-delay:0.5s;
        -webkit-animation-delay:0.5s;
        -ms-animation-delay:0.5s;
        -o-animation-delay:0.5s;
        -moz-animation-delay:0.5s;
      }
    }
    .hour {
      font-size: 13px;
      color: #ffffff;
      position: absolute;
      right: 0;
      top: 6px;
      right: 6px;
    }
  }
  .sentence {
    font-size: 24px;
    color: #333333;
    padding: 10px 0;
    border-bottom: 1px solid #EAEAEA;
  }
  @keyframes loadding{
    0%,100%{
      height: 8px;
    }
    50%{
      height: 16px;
    }
  }
}
// 声音
.sound-info {
  .audio-play-box {
    cursor: pointer;
    width: 266px;
    height: 36px;
    background: #2A9FE4;
    border-radius: 5px;
    position: relative;
    left: 0;
    top: 0;
    i {
      display: flex;
      // width: 70px;
      height: 32px;
      padding: 0 6px;
      margin: 0 auto;
      align-items: center;
      font-style: normal;
      // margin-right: 200px;
    }
    i span {
      display: inline-block;
      width: 4px;
      height: 8px;
      border-radius: 127px;
      margin-right: 4px;
      background: #ffffff;
      // -webkit-animation: load 1s ease infinite;
      // animation-play-state: paused;
      &.loadding {
        -webkit-animation: loadding 1s ease infinite;
      }
      &:nth-child(1){
        animation-delay:0.2s;
        -webkit-animation-delay:0.2s;
        -ms-animation-delay:0.2s;
        -o-animation-delay:0.2s;
        -moz-animation-delay:0.2s;
      }
      &:nth-child(2){
        animation-delay:0.3s;
        -webkit-animation-delay:0.3s;
        -ms-animation-delay:0.3s;
        -o-animation-delay:0.3s;
        -moz-animation-delay:0.3s;
      }
      &:nth-child(3){
        height: 16px;
      }
      &:nth-child(4){
        height: 16px;
        animation-delay:0.1s;
        -webkit-animation-delay:0.1s;
        -ms-animation-delay:0.1s;
        -o-animation-delay:0.1s;
        -moz-animation-delay:0.1s;
      }
      &:nth-child(5){
        animation-delay:0.4s;
        -webkit-animation-delay:0.4s;
        -ms-animation-delay:0.4s;
        -o-animation-delay:0.4s;
        -moz-animation-delay:0.4s;
      }
      &:nth-child(6){
        animation-delay:0.5s;
        -webkit-animation-delay:0.5s;
        -ms-animation-delay:0.5s;
        -o-animation-delay:0.5s;
        -moz-animation-delay:0.5s;
      }
    }
    .hour {
      font-size: 13px;
      color: #ffffff;
      position: absolute;
      right: 0;
      top: 6px;
      right: 6px;
    }
  }
  @keyframes loadding{
    0%,100%{
      height: 8px;
    }
    50%{
      height: 16px;
    }
  }
}
// 图片
.img-info {
  .images-content {
    width: 100%;
    .images {
      width: 100%;
      .img-lists {
        width: 100%;
        height: 100%;
        display: flex;
        .img-item {
          margin-right: 10px;
          width: 80px;
          height: 80px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
        }
        .img-item-big {
          width: 100%;
          height: 300px;
          object-fit: cover;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
// 视频
.video-info {
  .audio-video-box {
    width: 100%;
    height: 200px;
    .record-video {
      width: 100%;
      height: 200px;
    }
  }
}
// 母语代言
.dialectCourse-info {
  .dialectCourse-box{
    position: relative;
    .dialectCourse-img {
      width: 100%;
      height: 200px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .dialectCourse-play-box {
      cursor: pointer;
      width: 74px;
      height: 74px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -37px;
      margin-top: -37px;
      i {
        display: flex;
        width: 74px;
        height: 74px;
        padding: 0 16px;
        box-shadow: 0 8px 25px rgba(172,191,203,.6);
        background: rgba(255,255,255,.8);
        margin: 0 auto;
        justify-content: space-around;
        align-items: center;
        border-radius: 100%;
        font-style: normal;
      }
      i span {
        display: inline-block;
        width: 4px;
        height: 8px;
        border-radius: 127px;
        margin-right: 4px;
        background: #2a9fe4;
        &:nth-child(3){
          height: 16px;
        }
        &:nth-child(4){
          height: 16px;
        }
      }
    }
  }
}
.description {
  position: relative;
  display: flex;
  margin: 27px 0 20px;
  p {
    cursor: pointer;
    font-size:13px;
    font-weight:500;
    color:rgba(144,162,174,1);
    line-height:18px;
    margin-right: 26px;
    i {
      display: inline-block;
      margin-top: 2px;
    }
    .comment {
      width: 11px;
      height: 13px;
      background: url('../../../../static/images/community/comment.svg') no-repeat center;
      background-size: 100%;
    }
    .coins {
      width: 11px;
      height: 15px;
      background: url('../../../../static/images/community/coins.svg') no-repeat center;
      background-size: 100%;
      &.active {
        width: 11px;
        height: 15px;
        background: url('../../../../static/images/community/dashang.svg') no-repeat center;
        background-size: 100%;
      }
    }
    .share {
      width: 13px;
      height: 13px;
      background: url('../../../../static/images/community/share.svg') no-repeat center;
      background-size: 100%;
    }
  }
  .coin-ball {
    position: absolute;
    top: -60px;
    left: 36px;
    width: 60px;
    height: 60px;
    animation:coin-ball-correct-keyframes 2000ms ease-in-out;
    .coin-ball-correct {
      display: inline-block;
      width: 60px;
      height: 60px;
      background: url('../../../../static/images/learnSystem/ball.png') no-repeat center;
      background-size: cover;
    }
  }
}
// 打赏动画
@keyframes coin-ball-correct-keyframes {
  0% {
    transform: translate(0px, 0px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  10% {
    transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
  20% {
    transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateZ(0deg);
  }
  30% {
    transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg) rotateY(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  40% {
    transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateZ(0deg);
  }
  50% {
    transform: translate(0px, -54.075px) scale(1.12) rotateX(0deg) rotateY(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  60% {
    transform: translate(0px, -53.5938px) scale(1.05) rotateX(0deg)
      rotateZ(0deg);
  }
  70% {
    transform: translate(0px, -63.7px) scale(0.98) rotateX(0deg) rotateY(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  80% {
    transform: translate(0px, -47.6437px) scale(0.91) rotateX(0deg)
      rotateZ(0deg);
  }
  90% {
    transform: translate(0px, -21.175px) scale(0.84) rotateX(0deg) rotateY(0deg)
      rotateY(0deg) rotateZ(0deg);
  }
  100% {
    transform: translate(0px, -10px) scale(0.7) rotateX(0deg) rotateY(0deg)
      rotateZ(0deg);
  }
}
// 评论输入框
.review {
  width: 100%;
  .review-content {
    width: 100%;
    .text {
      textarea {
        padding: 0 3px;
        width: 100%;
        height: 64px;
        background:rgba(246,248,249,1);
        border-radius:3px;
        border:1px solid rgba(216,227,233,1);
      }
    }
    .review-pic {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .face {
        i {
          cursor: pointer;
          display: inline-block;
          width: 16px;
          height: 16px;
          background: url('../../../../static/images/community/smile.svg') no-repeat center;
          background-size: 100%;
          margin-top: 2px;
          &:hover {
            background: url('../../../../static/images/community/smilehover.svg') no-repeat center;
            background-size: 100%;
          }
          &.active {
            background: url('../../../../static/images/community/smileclick.svg') no-repeat center;
            background-size: 100%;
          }
        }
        span {
          font-size:14px;
          font-weight:500;
          color:rgba(144,162,174,1);
          line-height:20px;
        }
      }
      .send {
        cursor: pointer;
        width:74px;
        height:30px;
        background:rgba(42,159,228,1);
        border-radius:15px;
        text-align: center;
        line-height: 30px;
        span {
          font-size:14px;
          font-weight:500;
          color:rgba(255,255,255,1);
        }
      }
    }
  }
  // 表情包
  .emoji-box {
    position: absolute;
    z-index: 10;
    left: 10px;
    width: 400px;
    height: 200px;
    // top: 290px;
    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, 0.2);
    background: white;
    ul {
      width: 400px;
      height: 200px;
      overflow: auto;
      padding: 10px;
      li {
        width: 30px;
        cursor: pointer;
        display: inline-block;
        margin: 2px;
      }
    }
  }
}
// 打赏人列表
.hit {
  width: 100%;
  .hit-lists {
    padding: 10px 0;
    border-top: 1px solid #E0E6EB;
    border-bottom: 1px solid #E0E6EB;
    span {
      font-size:14px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(10,43,64,1);
      margin-right: 11px;
    }
    ul {
      width: 100%;
      position: relative;
      li {
        width: 20px;
        height: 20px;
        display: inline-block;
        margin-right: 6px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .circle {
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 0;
        display: inline-block;
        width: 18px;
        height: 3px;
        background: url('../../../../static/images/community/more.svg') no-repeat center;
        background-size: cover;
      }
    }
  }
}
</style>
