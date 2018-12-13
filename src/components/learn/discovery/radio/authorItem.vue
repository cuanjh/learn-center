<template>
  <div>
    <div class="homework-info" v-if="feedInfo.info.type_info === 'homework'">
      <div class="time">
        <span>{{feedInfo.info.created_time*1000 | dateFmt('YYYY-MM-DD')}}</span>
        <span class="more"><i></i><i></i><i></i></span>
      </div>
      <div class="title">
        <span>#{{feedInfo.info.topic_info.topic_title}}#</span>
        <span>{{feedInfo.info.topic_info.other_info}}</span>
      </div>
      <div class="audio-play-box" :class="{'play': !isPlay, 'pause': isPlay}" @click="play(feedInfo)">
        <audio id="record-sound" :src="feedInfo.info.sound_url" />
        <i class="note-line">
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
        </i>
        <!--  v-text="toParseTime(card.sound_time) sound_time" -->
        <span class="hour" v-text="toParseTime(feedInfo.info.sound_time)"></span>
      </div>
      <div class="sentence">
        <span>{{feedInfo.info.content}}</span>
      </div>
    </div>
    <div v-if="feedInfo.info.type_info === 'sound'">
      <div class="time">
        <span>{{feedInfo.info.created_time*1000 | dateFmt('YYYY-MM-DD')}}</span>
        <span class="more"><i></i><i></i><i></i></span>
      </div>
      <div class="title">
        <span>#{{feedInfo.info.topic_info.topic_title}}#</span>
        <span>{{feedInfo.info.content.replace(/#[^#]+#/g,'')}}</span>
      </div>
      <div class="audio-play-box" :class="{'play': !isPlay, 'pause': isPlay}" @click="play(feedInfo)">
        <audio id="record-sound" :src="feedInfo.info.sound_url" />
        <i class="note-line">
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
          <span :class="{loadding:loadding}"></span>
        </i>
        <!--  v-text="toParseTime(card.sound_time) sound_time" -->
        <span class="hour" v-text="toParseTime(feedInfo.info.sound_time)"></span>
      </div>
    </div>
    <!-- 打赏人列表  v-if="rewardLists"-->
    <div class="reward">
      <ul>
        <li v-for="(item, index) in feedInfo.rewardLists" :key="index">
          <img :src="item.photo" alt="打赏人头像">
        </li>
      </ul>
      <div class="reward-img" @click="reward(feedInfo.info.id)">
        <i></i>
        <span>{{feedInfo.info.reward_num}}</span>
      </div>
    </div>
    <!-- 评论列表和回复评论列表 -->
    <div class="comments-content">
      <div class="comments-list">
        <div class="comments-item" v-for="(item, index) in feedInfo.comments" :key="index">
          <!-- 正常评论列表 -->
          <div v-if="item.is_reply === false">
            <div class="content" @click="replyComment(feedInfo.info.id, feedInfo.info.type_info, item.id, item.nickname)">
              <span v-text="item.nickname ? item.nickname + ':' : '用户' + item.talkmate_id + ':'"></span>
              <span>{{item.comment}}</span>
            </div>
          </div>
          <!-- 回复评论的列表 -->
          <div v-if="item.is_reply === true">
            <div class="content">
              <span v-text="item.nickname ? item.nickname + ':' : '用户' + item.talkmate_id + ':'"></span>
              <span>回复</span>
              <span v-text="item.reply_comment.nickname ? item.reply_comment.nickname + ':' : '用户' + item.reply_comment.talkmate_id + ':'"></span>
              <span>{{item.comment}}</span>
            </div>
          </div>
        </div>
        <div class="more" @click="viewMore(feedInfo.info.id)" v-show="isShow">查看更多评论</div>
        <div class="noMore" v-show="noShow">
          <span>已经全部加载完毕~</span>
          <a href="javascript:;" @click="packUp()">收起</a>
        </div>
      </div>
      <!-- 评论的对话框 -->
      <div class="comment-on">
        <div class="comment-pic" @click="showEmoji = !showEmoji">
          <i></i>
        </div>
        <div class="text">
          <!-- 说点什么吧... -->
          <input
                type="textarea"
                id="comment-content"
                class="input-comment"
                v-model="content"
                autocomplete="off"
                placeholder="说点什么吧">
        </div>
        <div class="but" @click="submit(feedInfo.info.id, feedInfo.info.type_info)">
          <span>评论</span>
        </div>
      </div>
      <transition name="fade" mode="">
        <div class="emoji-box" v-if="showEmoji" >
          <ul class="emojiWrap">
            <li v-for="(item,i) in emojiData" :key="i" v-html="item" @click="chooseEmoji(i, $event)" ></li>
          </ul>
        </div>
      </transition>
      <div class="alert-box" v-show="showText">
        <div class="alert-text">
          <span>你已经打赏过来~~~</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Bus from '../../../../bus'
import Cookie from '../../../../tool/cookie.js'
import SoundCtrl from '../../../../plugins/soundCtrl'
export default {
  props: ['feedInfo'],
  data () {
    return {
      isReward: false, // 没有打赏
      loadding: false,
      showText: false,
      flag: true,
      noShow: false,
      isShow: true,
      type: 0, // 正常 1回复
      content: '', // input输入的内容
      showEmoji: false, // 笑脸表情
      dataList: [], // 输入的内容评论列表
      emojiDataUTF: [],
      emojiData: [],
      page: 0,
      userId: '', // 作者的id
      curRadio: {},
      duration: 0,
      curTime: 0,
      isPlay: false,
      isEnd: false,
      sndctr: SoundCtrl
    }
  },
  // components: {vueEmoji},
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
      radioAuthorCommentRewardList: 'course/radioAuthorCommentRewardList', // 动态打赏列表接口
      radioAuthorCommentReward: 'course/radioAuthorCommentReward', // 打赏动态奖励的接口
      getAuthorCommentList: 'course/getAuthorCommentList', // 加载更多的评论列表
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
    // 播放录音
    play (feedInfo) {
      console.log('feedinfo', feedInfo)
      this.playRadio(feedInfo)
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
    playRadio (feedInfo) {
      this.curRadio = feedInfo.info.sound_url
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
    // 点击表情添加到input框
    chooseEmoji (index, e) {
      console.log('e', e)
      let text = e.target.innerHTML
      this.content = this.content + text
      this.showEmoji = !this.showEmoji
    },
    // 评论
    submit (id, typeInfo) {
      if (this.content === '') {
        alert('请输入内容')
        return
      }
      // let params = {id: id, type_info: typeInfo, comment: this.content}
      // if (this.type == 1) {
      // }
      // 点击评论的时候调一次评论列表的接口
      // this.content = this.emoji.uniiedToHTML(this.content)
      this.radioAuthorCommentPub({id: id, type_info: typeInfo, comment: this.content}).then((data) => {
        this.content = '' // 在返回结束时清空内容
        console.log('评论的内容', data)
        this.feedInfo.comments.unshift(data.comment)
      })
    },
    // 回复评论
    replyComment (id, typeInfo, replyCommentId, nickname) {
      // this.type = 1
      let currentUserId = Cookie.getCookie('user_id')
      console.log('current_user_id', currentUserId)
      console.log('replyCommentId', replyCommentId)
      console.log('nickname', nickname)
    },
    // 查看更多评论
    viewMore (id) {
      if (!this.flag) {
        return false
      }
      this.page++
      if (this.page === 1) {
        this.feedInfo.comments = []
      }
      // 加载更多的评论列表
      this.getAuthorCommentList({id: id, page: this.page}).then((res) => {
        console.log('page', this.page)
        console.log('评论列表', res)
        // 当前这个动态的评论列表改变一下，把列表中的数据替换动态返回的评论
        this.feedInfo.comments = this.feedInfo.comments.concat(res.comments)
        // this.feedInfos.comments = this.feedInfos.comments.concat(res.comments)
        if (res.page === -1) { // 当返回的页面是最后一页的时候加载完
          this.noShow = !this.noShow
          this.isShow = !this.isShow
          return false
        }
        console.log('评论列表===>', this.feedInfo.comments)
      })
    },
    // 点击收起
    packUp () {
      // 点击收起的时候知道是哪个的动态列表根据index截取前三条显示
      this.noShow = !this.noShow
      this.isShow = !this.isShow
      this.feedInfo.comments = this.feedInfo.comments.slice(0, 3)
      this.page = 0
    },
    // 打赏动态
    reward (id) {
      let currentUserId = Cookie.getCookie('user_id')
      console.log('rewardLists', this.feedInfo.rewardLists)
      // this.radioAuthorCommentReward({id: feedInfo.info.id, to_user_id: currentUserId, feedInfo})
      if (this.feedInfo.info.has_rewarded) {
        alert('你已经打赏过了~~~')
      } else {
        this.radioAuthorCommentReward({id: id, to_user_id: currentUserId}).then((res) => {
          console.log('是否打赏了', res)
          this.radioAuthorCommentRewardList({id: id}).then((data) => {
            console.log('data2', data)
            this.feedInfo.info.has_rewarded = true
            this.feedInfo.info.reward_num += 1
            this.feedInfo.rewardLists = data.detail.rewards
            console.log('rewardLists后', this.feedInfo.rewardLists)
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>

.time {
  height: 24px;
  font-size: 16px;
  color: #333333;
  display: flex;
  justify-content: space-between;
  span {
    display: inline-block;
  }
  .more{
    padding-top: 8px;
    cursor: pointer;
    i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin: 0 4px;
      background: #2A9FE4;
    }
  }
}
.title {
  font-size: 14px;
  color: #333333;
  margin: 22px 0;
  span:nth-child(1){
    color: #2a9fe4;
  }
}
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
.sentence {
  font-size: 24px;
  color: #333333;
  padding: 10px 0 20px 0;
  border-bottom: 1px solid #EAEAEA;
}
// 打赏
.reward {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #EAEAEA;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin-right: 20px;
      border-radius: 50%;
      margin-top: 20px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
  .reward-img {
    cursor: pointer;
    width: 100px;
    height: 36px;
    background: #2A9FE4;
    border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #FFFFFF;
    margin: 20px 0;
    i {
      display: inline-block;
      width: 16px;
      height: 14px;
      background: url('../../../../../static/images/headline/rewardpng.png') no-repeat center;
      background-size: cover;
      margin-right: 10px;
    }
  }
}
.comments-content {
  position: relative;
  width: 100%;
  // background: #ffffff;
  .comments-list {
    width: 100%;
    border-bottom: 1px solid #EAEAEA;
    // 默认显示
    .comments-item {
      cursor: pointer;
      padding: 23px 0 0 0;
      .content {
        font-size: 14px;
        color: #333333;
        span:nth-child(1) {
          color: #B8B8B8;
        }
        span:nth-child(3) {
          color: #B8B8B8;
        }
      }
    }
    // 加载更多
    .comments-item-more {
      cursor: pointer;
      padding: 23px 0 0 0;
      .content {
        font-size: 14px;
        color: #333333;
        span:nth-child(1) {
          color: #B8B8B8;
        }
        span:nth-child(3) {
          color: #B8B8B8;
        }
      }
    }
    .more {
      cursor: pointer;
      font-size: 14px;
      color: #D36E16;
      padding: 24px 0;
    }
    .noMore {
      width: 100%;
      font-size: 14px;
      color: #333333;
      padding: 24px 0;
      span {
        margin-right: 40px;
      }
      a {
        text-decoration: none;
        color: #D36E16;
      }
    }
  }
  .comment-on {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 30px;
    .comment-pic {
      cursor: pointer;
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      i {
        display: inline-block;
        background: url('../../../../../static/images/headline/face.png') no-repeat center;
        background-size: cover;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    .text {
      display: inline-block;
      .input-comment {
        color: red;
        -webkit-appearance: none;
        background-color: #F4F4F4;
        border: 1px solid #D8D8D8;
        background-image: none;
        border-radius: 20px;
        font-size: 14px;
        height: 40px;
        outline: 0;
        overflow: hidden;
        width: 680px;
        display: inline-block;
        padding: 10px 90px 10px 20px;
        resize: none;
        color: #C6C6C6;
      }
    }
    .but {
      cursor: pointer;
      width: 110px;
      height: 40px;
      background: #EEEEEE;
      text-align: center;
      border-radius: 20px;
      line-height: 40px;
      span {
        font-size: 14px;
        color: #C6C6C6;
      }
    }
  }
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
  .alert-box {
    position: absolute;
    top: 0;
    left: 40%;
    width: 200px;
    height: 100px;
    border-radius: 10px;
    background: #333333;
    .alert-text {
      width: 100%;
      height: 100%;
      padding: 20px;
      font-size: 24px;
      color: #ffffff;
      margin-top: 10px;
    }
  }
}

.fade-enter-active, .fade-leave-active { transition: opacity .5s; }
.fade-enter, .fade-leave-active { opacity: 0; }
.fade-move { transition: transform .4s; }
</style>
