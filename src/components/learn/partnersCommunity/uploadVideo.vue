<template>
  <div v-show="type === 'UploadType_video'">
    <textarea id="textarea"
              autocomplete="off"
              v-model="content"
              placeholder="说点什么吧~~">
    </textarea>
    <el-form>
      <el-form-item prop="Video">
        <!-- action必选参数, 上传的地址 -->
        <el-upload  class="avatar-uploader el-upload--text"
                    action="#"
                    accept="video/mp4,video/ogg,video/flv,video/avi,video/wmv,video/rmvb"
                    :http-request="upload"
                    :show-file-list="false"
                    :before-upload="beforeUploadVideo"
                    :on-progress="uploadVideoProcess">
            <video
                    v-if="videoForm.Video !='' && videoFlag == false"
                    :src="videoForm.VideoUrl"
                    class="avatar"
                    controls="controls">您的浏览器不支持视频播放</video>
            <i v-else-if="videoForm.Video =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon"></i>
            <el-progress
                          v-if="videoFlag == true"
                          class="progress-circle"
                          type="circle"
                          :percentage=videoUploadPercent
                          ></el-progress>
        </el-upload>
      </el-form-item>
    </el-form>
    <div class="publish" @click="publish()">
      <span>发布</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Recorder from '../../../plugins/recorder'
export default {
  props: ['type'],
  data () {
    return {
      videoFlag: false,
      videoUploadPercent: 0,
      content: '',
      videoForm: {
        videoUploadId: '',
        Video: ''
      },
      qiniuUrl: ''
    }
  },
  mounted () {
    // 初始化
    Recorder.init()
  },
  computed: {
    ...mapState({
      qiniuToken: state => state.learn.qiniuToken // 七牛的token
    })
  },
  methods: {
    ...mapActions({
      getQiniuToken: 'learn/getQiniuToken', // 获取七牛token
      getDynamic: 'course/getDynamic' // 发布动态接口
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken'
    }),
    upload (params) {
      console.log('params', params)
      let file = params.file
      console.log('file', file)
      // let blob = Recorder.getBlobfromFile(file, file.type)
      // file, type, token, callback
      this.getQiniuToken().then((res) => {
        this.updateQiniuToken(res)
        Recorder.uploadQiniuType(file, 'UploadType_video', this.qiniuToken)
        this.qiniuUrl = Recorder.recorderUrl
        console.log('qiniuUrl', this.qiniuUrl)
      })
      // console.log('blob', blob)
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
        // this.$message.error('上传视频大小不能超过10MB哦!')
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
      this.getDynamic({content: this.content, video_url: this.qiniuUrl}).then(res => {
        console.log('发布动态返回数据', res)
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
  width: 100px;
  height: 100px;
  border: 1px dashed #C8D4DB;
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
