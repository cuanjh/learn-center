<template>
  <div v-show="type === 'UploadType_photo'">
    <textarea id="textarea"
              autocomplete="off"
              v-model="content"
              placeholder="说点什么吧~~">
    </textarea>
    <div class="pic">
      <el-upload
        ref="upload"
        action="#"
        :http-request="upload"
        accept="image/png,image/gif,image/jpg,image/jpeg"
        list-type="picture-card"
        :limit=limitNum
        :before-upload="handleBeforeUpload"
        :on-preview="handlePictureCardPreview"
        :file-list="fileList"
        :on-remove="handleRemove">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
    <div class="publish" @click="publish()">
      <span>发布</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Cookie from '../../../tool/cookie.js'
import { uploadImgToBase64, uploadQiniu } from '../../../plugins/uploadCommiunty'

export default {
  props: ['type'],
  data () {
    return {
      file: '',
      limitNum: 2,
      content: '',
      qiniuUrl: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: []
    }
  },
  computed: {
    ...mapState({
      qiniuToken: state => state.learn.qiniuToken, // 七牛的token
      dynamicsLists: state => state.course.dynamicsLists // 动态首页列表和打赏列表数据
    })
  },
  methods: {
    ...mapActions({
      getDynamic: 'course/getDynamic', // 发布动态接口
      getQiniuToken: 'learn/getQiniuToken'
    }),
    ...mapMutations({
      updateQiniuToken: 'learn/updateQiniuToken'
    }),
    upload (params) {
      let that = this
      console.log('params', params)
      console.log('params.file', params.file)
      let url = window.URL.createObjectURL(params.file)
      console.log('url', url)
      let file = params.file
      let fileObj = {}
      fileObj.name = file.name
      fileObj.url = url
      that.fileList.push(fileObj)
      let base64file = uploadImgToBase64(params.file)
      base64file.then(function (result) {
        let date = new Date()
        let d = date.format('yyyy/MM/dd')
        let userId = Cookie.getCookie('user_id')
        let time = date.getTime()
        let fileImgKey = 'feed/image/' + d + '/' + userId + '/' + time + file.name
        that.getQiniuToken().then((res) => {
          that.updateQiniuToken(res)
          let upload = uploadQiniu(result.result, that.qiniuToken, fileImgKey)
          upload.then(function (result) {
            console.log('result', result)
            if (result.success) {
              // success
              // shang chuan
              fileObj.qiniuUrl = fileImgKey
            }
            console.log('that.qiniuUrl', that.fileList)
            console.log('upload', upload)
            console.log('url', fileImgKey)
          })
        })
      })
    },
    // 上传文件之前的钩子
    handleBeforeUpload (file) {
      console.log('before')
      if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'mp4')) {
        this.$alert(`请上传正确的图片格式`, '温馨提示!', {
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
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      console.log('file', file)
      for (var i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].url === file.url) {
          this.fileList.splice(i, 1)
        }
      }
      console.log('fileList', this.fileList)
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 点击上传上传图片
    publish () {
      this.qiniuUrl = []
      this.fileList.forEach(item => {
        this.qiniuUrl.push(item.qiniuUrl)
      })
      console.log('this.qiniuUr', this.qiniuUrl)
      // 请求后端接口
      let params = {}
      if (this.content !== '') {
        params = {
          content: this.content,
          'image_urls[]': this.qiniuUrl
        }
      } else {
        params = {
          'image_urls[]': this.qiniuUrl
        }
      }
      this.getDynamic(params).then(res => {
        console.log('发布动态返回数据', res)
        this.dynamicsLists.unshift(res.feedInfo)
        // 4.jpg:1 GET https://uploadfile1.talkmate.com/feed/image/2019/01/12/1547272054727/5b74e4432152c797519a092a/1547272054776/4.jpg 404
      })
    }
  }
}
</script>
<style lang="less">
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
#textarea {
  padding: 0 3px;
  width: 100%;
  height: 64px;
  background:rgba(246,248,249,1);
  border-radius:3px;
  border:1px dashed rgba(216,227,233,1);
}
.pic {
  margin-top: 30px;
}
.el-form-item .el-form-item__content {
  margin-left: 0px !important;
  margin-top: 20px;
}
.button-conten .el-form-item__content {
  margin-top: 20px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 178px;
  height: 178px;
  border-radius: 0px;
}
.el-upload-list--picture-card .is-ready {
  width: 178px;
  height: 178px;
  border-radius: 0px;
}
.button-conten {
  margin-top: 0px;
}
.el-upload.el-upload--picture-card {
  background-color: #ffffff;
  border-color: #C8D4DB;
  border-radius: 0px;
  width: 178px;
  height: 178px;
  &:hover {
    border-color: rgb(21, 145, 218);
  }
}
.el-upload .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  vertical-align: inherit;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
