<template>
  <div v-show="type === 'UploadType_video'">
    <textarea id="textarea"
              autocomplete="off"
              v-model="content"
              placeholder="说点什么吧~~">
    </textarea>
    <div class="pic">
      <el-upload
        class="avatar-uploader"
        accept="video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb"
        action="#"
        :show-file-list="false"
        :http-request="upload"
        :before-upload="beforeUploadVideo"
        :on-preview="uploadVideoProcess"
        >
        <i class="el-icon-plus avatar-uploader-icon" v-show="videoForm.VideoUrl ===''"></i>
        <video v-if="videoForm.VideoUrl !=''"
              :src="videoForm.VideoUrl" controls="controls"></video>
      </el-upload>
    </div>
    <div class="publish" @click="publish()">
      <span>发布</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import moment from 'moment'
import Cookie from '../../../tool/cookie.js'
import Recorder from '../../../plugins/recorder'

export default {
  props: ['type'],
  data () {
    return {
      videoFlag: true,
      videoUploadPercent: 0,
      content: '',
      videoForm: {
        videoUploadId: '',
        Video: '',
        VideoUrl: ''
      },
      qiniuUrl: '',
      fileList: []
    }
  },
  mounted () {
    // 初始化
    Recorder.init()
  },
  computed: {
    ...mapState({
      FileQiniuToken: state => state.FileQiniuToken, // 七牛的token
      dynamicsLists: state => state.course.dynamicsLists // 动态首页列表和打赏列表数据
    })
  },
  methods: {
    ...mapActions({
      getDynamic: 'course/getDynamic', // 发布动态接口
      getUploadFileToken: 'getUploadFileToken' // 上传七牛
    }),
    ...mapMutations({
      updateFileQiniuToken: 'updateFileQiniuToken' // 更新上传七牛token
    }),
    upload (params) {
      console.log('params', params)
      let file = params.file
      console.log('file', file)
      let url = window.URL.createObjectURL(params.file)
      let fileObj = {}
      fileObj.name = file.name
      fileObj.url = url
      this.fileList.push(fileObj)
      console.log('url', url)
      this.videoForm.VideoUrl = url
      this.getUploadFileToken().then((res) => {
        this.updateFileQiniuToken(res)
        console.log('res', res)
        let date = new Date()
        let d = date.format('yyyy/MM/dd')
        let userId = Cookie.getCookie('user_id')
        let time = date.getTime()
        let suffix = file.name.split('.')
        let fileImgKey = 'feed/video/' + d + '/' + userId + '/' + moment(time) + '.' + suffix[suffix.length - 1]
        console.log('fileImgKey', fileImgKey)
        Recorder.uploadQiniuVideo(file, this.FileQiniuToken, fileImgKey).then(data => {
          console.log('data', data)
          this.qiniuUrl = data.key
        })
        console.log('qiniuUrl', this.qiniuUrl)
      })
    },
    beforeUploadVideo (file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
        this.$alert(`请上传正确的视频格式`, '温馨提示!', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        return false
      }
      if (!isLt10M) {
        this.$alert(`上传视频大小不能超过10M哦!`, '温馨提示!', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        return false
      }
    },
    // 长传进度显示
    uploadVideoProcess (event, file, fileList) {
      this.videoFlag = true
      this.videoUploadPercent = parseInt(file.percentage.toFixed(0))
    },
    publish () {
      // 请求后端接口
      let params = {}
      if (this.content !== '') {
        params = {
          content: this.content,
          video_url: this.qiniuUrl
        }
      } else {
        params = {
          video_url: this.qiniuUrl
        }
      }
      this.getDynamic(params).then(res => {
        console.log('发布动态返回数据', res)
        this.dynamicsLists.unshift(res.feedInfo)
        this.videoForm.VideoUrl = ''
      })
    }
  }
}
</script>
<style lang="less">
#textarea {
  padding: 0 3px;
  width: 100%;
  height: 64px;
  background:rgba(246,248,249,1);
  border-radius:3px;
  border:1px solid rgba(216,227,233,1);
}
.publish{
  cursor: pointer;
  position: absolute;
  bottom: 6px;
  right: 0;
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
.el-upload {
  width: 178px;
  height: 178px;
  border: 1px dashed #C8D4DB;
  video {
    height: 178px;
  }
}
.el-upload .progress-circle {
  width: 80px!important;
  height: 80px!important;
  margin-top: 10px!important;
}
.el-upload .el-progress-circle {
  width: 80px!important;
  height: 80px!important;
}
.el-upload.el-upload--text {
  &:hover {
    border-color: rgb(21, 145, 218);
  }
}
</style>
