<template>
  <div class="user">
    <div class="top">
      <div class="user-img">
        <img :src="userInfoMessage.photo" alt="用户头像">
      </div>
      <div class="name">
        <span>{{userInfoMessage.nickname}}</span>
      </div>
      <div class="focus">
        <p>
          <span>{{userInfoMessage.following_count}}</span>
          <span>关注</span>
        </p>
        <p class="line"></p>
        <p>
          <span>{{userInfoMessage.followed_count}}</span>
          <span>粉丝</span>
        </p>
        <p class="line"></p>
        <p>
          <span>{{userInfoMessage.dynamic_num ? userInfoMessage.dynamic_num : '0'}}</span>
          <span>动态</span>
        </p>
      </div>
    </div>
    <div class="operation">
      <div class="prompt">
        <span>分享你的足迹、文章、照片、视频或新鲜事！</span>
      </div>
    </div>
    <upload-img :type="type"/>
    <upload-text :type="type"/>
    <upload-video :type="type"/>
    <upload-voice :type="type" :uploadVoiceShow="uploadVoiceShow" @uploadVoiceHidden="hiddenBox"/>
    <upload-topic :type="type" :showTopicLists="showTopicLists" @topcItemHidden="hiddenLists"/>

    <div class="shareing">
      <div class="shareLists">
        <span class="img" @click="uploadImgs()"><i></i>图片</span>
        <span class="text" @click="uploadTexts()"><i></i>文字</span>
        <span class="video" @click="uploadVideos()"><i></i>视频</span>
        <span class="voice" @click="uploadVoices()"><i></i>语音</span>
        <span class="topic" @click="uploadTopics()"><i></i>话题</span>
      </div>
      <div class="publish" v-show="false">
        <span>发布</span>
      </div>
    </div>
  </div>
</template>
<script>
import UploadImg from './uploadImg.vue'
import UploadText from './uploadText.vue'
import UploadVideo from './uploadVideo.vue'
import UploadVoice from './uploadVoice.vue'
import UploadTopic from './uploadTopic.vue'

export default {
  props: ['userInfoMessage'],
  data () {
    return {
      type: '', // UploadType_photo:上传图片 UploadType_text:上传文字 UploadType_video:视频 UploadType_voice:语音 UploadType_topic:话题
      showTopicLists: false,
      uploadVoiceShow: false
    }
  },
  components: {
    UploadImg,
    UploadText,
    UploadVideo,
    UploadVoice,
    UploadTopic
  },
  mounted () {
  },
  methods: {
    uploadImgs () {
      this.type = 'UploadType_photo'
    },
    uploadTexts () {
      this.type = 'UploadType_text'
    },
    uploadVideos () {
      this.type = 'UploadType_video'
    },
    uploadVoices () {
      this.type = 'UploadType_voice'
      this.uploadVoiceShow = true
    },
    uploadTopics () {
      this.type = 'UploadType_topic'
      this.showTopicLists = true
    },
    hiddenBox (data) {
      this.uploadVoiceShow = data
    },
    hiddenLists (data) {
      this.showTopicLists = data
    }
  }
}
</script>
<style lang="less" scoped>
.user {
  position: relative;
  width: 100%;
  .top {
    position: relative;
    display: flex;
    padding-bottom: 13px;
    border-bottom: 1px solid #EAF0F4;
    .user-img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .name {
      line-height: 70px;
      span:nth-child(1) {
        font-size:22px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(16,48,68,1);
        padding-left: 12px;
      }
      span:nth-child(2) {
        font-size:18px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(144,162,174,1);
        padding-left: 25px;
      }
    }
    .focus {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      p {
        display: flex;
        flex-direction: column;
        // padding: 10px;
        span {
          text-align: center;
        }
        span:nth-child(1) {
          font-size:16px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(16,48,68,1);
          line-height:30px;
        }
        span:nth-child(2) {
          font-size:14px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(144,162,174,1);
          line-height:25px;
          margin-top: 4px;
        }
      }
      p:nth-child(3) {
        span:nth-child(1) {
          color: rgb(248, 132, 24);
        }
      }
      .line {
        width: 1px;
        background: rgb(161, 160, 160);
        height: 50px;
        margin: 6px 16px 0;
      }
    }
  }
  .operation {
    width: 100%;
    .prompt {
      padding: 10px 0;
      span {
        font-size:16px;
        font-weight:500;
        color:rgba(60,91,111,1);
      }
    }
  }
  .shareing {
    margin-top: 34px;
    font-size:14px;
    font-family:PingFangSC-Semibold;
    font-weight:600;
    color:rgba(126,146,159,1);
    display: flex;
    justify-content: space-between;
    .shareLists {
      display: inline-block;
      span {
        cursor: pointer;
        display: inline-block;
        border-radius: 18px;
        background:rgba(246,248,249,1);
        padding: 7PX 20PX;
        i {
          margin-right: 10px;
          display: inline-block;
        }
      }
      .img {
        i {
          width: 18px;
          height: 20px;
          background: url('../../../../static/images/community/goparnter.svg') no-repeat center;
          background-size: 100%;
        }
      }
      .text {
        i {
          width: 18px;
          height: 20px;
          background: url('../../../../static/images/community/goparnter.svg') no-repeat center;
          background-size: 100%;
        }
      }
      .video {
        i {
          width: 18px;
          height: 20px;
          background: url('../../../../static/images/community/goparnter.svg') no-repeat center;
          background-size: 100%;
        }
      }
      .voice {
        i {
          width: 18px;
          height: 20px;
          background: url('../../../../static/images/community/goparnter.svg') no-repeat center;
          background-size: 100%;
        }
      }
      .topic {
        i {
          width: 18px;
          height: 20px;
          background: url('../../../../static/images/community/goparnter.svg') no-repeat center;
          background-size: 100%;
        }
      }
    }
    .publish{
      margin-top: 7px;
      display: inline-block;
      span {
        font-size:14px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,255,255,1);
        padding: 6px 31px;
        background-color: #7ED321;
        border-radius: 18px;
      }
    }
  }
}
</style>
