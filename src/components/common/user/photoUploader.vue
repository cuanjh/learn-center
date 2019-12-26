<template>
  <div class="mark-box-bg" id="avatar-modal">
    <div class="modal learn-photo-upload" aria-hidden="true" aria-labelledby="avatar-modal-label" role="dialog" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <form class="avatar-form" v-bind:action="uploadPhotoUrl" enctype="multipart/form-data" method="post">
            <div class="modal-header">
              <button class="close" data-dismiss="modal" type="button" v-on:click='closeUploadView'>&times;</button>
              <h4 class="modal-title" id="avatar-modal-label">请选择图片</h4>
            </div>
            <div class="modal-body">
              <div class="avatar-body">
                <div class="avatar-upload" style='display:inline-block;'>
                  <input class="avatar-src" name="avatar_src" type="hidden">
                  <input class="avatar-data" name="avatar_data" type="hidden">
                  <label for="avatarInput">点击上传</label>
                  <input class="avatar-input" id="avatarInput" name="photo" type="file">
                </div>
                <input class="upload-url" type="text" id="uploadUrl" v-model="uploadUrl" name="uploadUrl" style='visibility:hidden' />
                <div class="row" style='margin-top: 0;'>
                  <div class="col-md-9">
                    <div class="avatar-wrapper"></div>
                  </div>
                  <div class="col-md-3">
                    <div class="avatar-preview preview-lg"></div>
                    <div class="avatar-preview preview-md"></div>
                    <div class="avatar-preview preview-sm"></div>
                  </div>
                </div>
                <div class="row avatar-btns">
                  <div class="col-md-9">
                    <div class="btn-group">
                      <button class="" data-method="rotate" data-option="-90" type="button" title="Rotate -90 degrees"><i class="fa fa-undo"></i> 向左旋转</button>
                    </div>
                    <div class="btn-group">
                      <button class="" data-method="rotate" data-option="90" type="button" title="Rotate 90 degrees"><i class="fa fa-repeat"></i> 向右旋转</button>
                    </div>
                  </div>
                  <div class="col-md-3" style='text-align: center'>
                    <button class="avatar-save login-save-upload-btn" type="submit" v-on:click='hidePicture'>保存修改</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="loading" aria-label="Loading" role="img" tabindex="-1"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import $ from 'jquery'

export default {
  data () {
    return {
      uploadUrl: ''
    }
  },
  computed: {
    ...mapState({
      uploadPhotoUrl: state => state.user.uploadPhotoUrl
    })
  },
  mounted () {
    this.getUploadPhotoUrl({})
    // 重新加载上传头像插件js
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = '/static/sitelogo.js'
    head.appendChild(script)
  },
  methods: {
    ...mapMutations({
    }),
    ...mapActions({
      getUploadPhotoUrl: 'user/getUploadPhotoUrl',
      updateInfo: 'updateUserInfo',
      getUserInfo: 'getUserInfo' // 获取用户信息
    }),
    // 用于隐藏图片
    hidePicture () {
      $('#avatar-modal').hide()
      setTimeout(() => {
        this.getUserInfo()
      }, 1000)
    },
    closeUploadView () {
      $('#avatar-modal').hide()
      setTimeout(() => {
        this.getUserInfo()
      }, 1000)
    }
  }
}
</script>

<style>
.mark-box-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .4);
  z-index: 105044455555;
  display: none;
}
.cropper-container {
  position: relative;
  overflow: hidden;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
.cropper-container img {
  display: block;
  width: 100%;
  min-width: 0 !important;
  max-width: none !important;
  height: 100%;
  min-height: 0 !important;
  max-height: none !important;
  image-orientation: 0deg !important;
}
.cropper-canvas,
.cropper-crop-box,
.cropper-drag-box,
.cropper-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.cropper-drag-box {
  background-color: #fff;
  filter: alpha(opacity=0);
  opacity: 0;
}
.cropper-modal {
  background-color: #000;
  filter: alpha(opacity=50);
  opacity: 0.5;
}
.cropper-view-box {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: #69f solid 1px;
  outline-color: rgba(102, 153, 255, 0.75);
}
.cropper-dashed {
  position: absolute;
  display: block;
  filter: alpha(opacity=50);
  border: 0 dashed #fff;
  opacity: 0.5;
}
.cropper-dashed.dashed-h {
  top: 33.33333333%;
  left: 0;
  width: 100%;
  height: 33.33333333%;
  border-top-width: 1px;
  border-bottom-width: 1px;
}
.cropper-dashed.dashed-v {
  top: 0;
  left: 33.33333333%;
  width: 33.33333333%;
  height: 100%;
  border-right-width: 1px;
  border-left-width: 1px;
}
.cropper-face,
.cropper-line,
.cropper-point {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  filter: alpha(opacity=10);
  opacity: 0.1;
}
.cropper-face {
  top: 0;
  left: 0;
  cursor: move;
  background-color: #fff;
}
.cropper-line {
  background-color: #69f;
}
.cropper-line.line-e {
  top: 0;
  right: -3px;
  width: 5px;
  cursor: e-resize;
}
.cropper-line.line-n {
  top: -3px;
  left: 0;
  height: 5px;
  cursor: n-resize;
}
.cropper-line.line-w {
  top: 0;
  left: -3px;
  width: 5px;
  cursor: w-resize;
}
.cropper-line.line-s {
  bottom: -3px;
  left: 0;
  height: 5px;
  cursor: s-resize;
}
.cropper-point {
  width: 5px;
  height: 5px;
  background-color: #69f;
  filter: alpha(opacity=75);
  opacity: 0.75;
}
.cropper-point.point-e {
  top: 50%;
  right: -3px;
  margin-top: -3px;
  cursor: e-resize;
}
.cropper-point.point-n {
  top: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize;
}
.cropper-point.point-w {
  top: 50%;
  left: -3px;
  margin-top: -3px;
  cursor: w-resize;
}
.cropper-point.point-s {
  bottom: -3px;
  left: 50%;
  margin-left: -3px;
  cursor: s-resize;
}
.cropper-point.point-ne {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
}
.cropper-point.point-nw {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
}
.cropper-point.point-sw {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
}
.cropper-point.point-se {
  right: -3px;
  bottom: -3px;
  width: 20px;
  height: 20px;
  cursor: se-resize;
  filter: alpha(opacity=100);
  opacity: 1;
}
.cropper-point.point-se:before {
  position: absolute;
  right: -50%;
  bottom: -50%;
  display: block;
  width: 200%;
  height: 200%;
  content: " ";
  background-color: #69f;
  filter: alpha(opacity=0);
  opacity: 0;
}
@media (min-width: 768px) {
  .cropper-point.point-se {
    width: 15px;
    height: 15px;
  }
}
@media (min-width: 992px) {
  .cropper-point.point-se {
    width: 10px;
    height: 10px;
  }
}
@media (min-width: 1200px) {
  .cropper-point.point-se {
    width: 5px;
    height: 5px;
    filter: alpha(opacity=75);
    opacity: 0.75;
  }
}
.cropper-bg {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
}
.cropper-invisible {
  filter: alpha(opacity=0);
  opacity: 0;
}
.cropper-hide {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  filter: alpha(opacity=0);
  opacity: 0;
}
.cropper-hidden {
  display: none !important;
}
.cropper-move {
  cursor: move;
}
.cropper-crop {
  cursor: crosshair;
}
.cropper-disabled .cropper-canvas,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
  cursor: not-allowed;
}
.avatar-view {
  display: block;
  cursor: pointer;
  overflow: hidden;
}

.avatar-view img {
  width: 100%;
}

.avatar-body {
  padding-right: 15px;
  padding-left: 15px;
}

.avatar-upload {
  overflow: hidden;
}

.avatar-upload label {
  display: block;
  float: left;
  clear: left;
  width: 100px;
  height: 30px;
  border-radius: 4px;
  background-color: #3c9bbe;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.avatar-upload label:hover {
  background-color: #05618d;
}
.avatar-upload input {
  display: block;
  margin-left: 110px;
  opacity: 0;
}

.avater-alert {
  margin-top: 10px;
  margin-bottom: 10px;
}

.avatar-wrapper {
  height: 364px;
  width: 100%;
  margin-top: 15px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.25);
  background-color: #fcfcfc;
  overflow: hidden;
}

.avatar-wrapper img {
  display: block;
  height: auto;
  max-width: 100%;
}

.avatar-preview {
  float: left;
  margin-top: 15px;
  margin-right: 15px;
  border: 1px solid #eee;
  border-radius: 500px;
  background-color: #fff;
  overflow: hidden;
  margin: 20px auto;
}
.avatar-preview {
}
.avatar-preview:hover {
  border-color: #ccf;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}

.avatar-preview img {
  width: 100%;
}

.preview-lg {
  height: 184px;
  width: 184px;
  margin-top: 15px;
}

.preview-md {
  height: 100px;
  width: 100px;
}

.preview-sm {
  height: 50px;
  width: 50px;
}

@media (min-width: 992px) {
  .avatar-preview {
    float: none;
  }
}

.avatar-btns {
  margin-top: 0px;
  /*margin-bottom: 15px;*/
}

.avatar-btns .btn-group {
  margin-right: 5px;
  float: left;
  margin: 0;
}

.loading {
  display: none;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.75;
  filter: alpha(opacity=75);
  z-index: 20140628;
}
/*沿用bootStrap样式*/
.modal-open .modal {
  overflow-x: hidden;
  overflow-y: auto;
}
.fade.in {
  opacity: 1;
}
.modal {
  position: fixed;
  top: 50%;
  right: 50%;
  margin-top: -300px;
  margin-right: -460px;
  /* z-index: 105044455555;
  display: none; */
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  outline: 0;
  width: 920px;
  height: 620px;
  border-radius: 5px;
}
.fade {
  opacity: 0;
  -webkit-transition: opacity 0.15s linear;
  -o-transition: opacity 0.15s linear;
  transition: opacity 0.15s linear;
}
.modal.in .modal-dialog {
  -webkit-transform: translate(0, 0);
  -ms-transform: translate(0, 0);
  -o-transform: translate(0, 0);
  transform: translate(0, 0);
}
.modal-dialog {
  position: relative;
  width: auto;
  margin: 10px;
}
.modal-content {
  position: relative;
  background-color: #fff;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border: 1px solid #999;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  outline: 0;
  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: none;
}
.close {
  float: right;
  font-size: 21px;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  filter: alpha(opacity=20);
  opacity: 0.2;
  cursor: pointer;
}
.modal-header {
  min-height: 16.43px;
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
}
.modal-header .close {
  margin-top: -2px;
}
button.close {
  -webkit-appearance: none;
  padding: 0;
  cursor: pointer;
  background: 0 0;
  border: 0;
}
.modal-title {
  margin: 0;
  line-height: 1.42857143;
  width: 150px;
  padding-left: 17px;
}
.modal-body {
  position: relative;
  padding: 15px;
}
.login-save-upload-btn {
  width: 152px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  color: #fff;
  border-radius: 4px;
  background-color: #3c9bbe;
}
.login-save-upload-btn:hover {
  background-color: #05618d;
  color: #fff;
}
.avatar-btns .btn-group button {
  width: 100px;
  height: 30px;
  border-radius: 4px;
  background-color: #3c9bbe;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  margin: 30px 30px 0 0;
  -webkit-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
}
.avatar-btns .btn-group button i {
  position: relative;
  top: 8px;
}
.avatar-btns .btn-group button:hover {
  background-color: #05618d;
}
.learn-photo-upload {
  z-index: 100000028 !important;
}
</style>
