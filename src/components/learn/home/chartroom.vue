<template>
  <div class="chat-room">
    <div class="chat-content">
      <div class="header">
        <div class="left">
          <i></i>
          <span>主题聊天室</span>
        </div>
        <router-link tag="div" class="all" :to="{path: 'subject-chat'}"><span>更多主题</span></router-link>
      </div>
      <div class="chat-img">
        <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5c2586f93f34186bf1192fe4/5c2586f93f34186bf1192fe4.jpg?hash=FqZF9gAe1ZLv47blmy4epMriNnmG" alt="主题图片">
        <div class="title-box">
          <span>我们在日本的足迹</span>
        </div>
      </div>
      <div class="person-img">
        <div class="img-lists">
          <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5c2586f93f34186bf1192fe4/5c2586f93f34186bf1192fe4.jpg?hash=FqZF9gAe1ZLv47blmy4epMriNnmG" alt="头像图片">
        </div>
        <div class="img-lists">
          <img src="https://uploadfile1.talkmate.com/uploadfiles/avatar/5c2586f93f34186bf1192fe4/5c2586f93f34186bf1192fe4.jpg?hash=FqZF9gAe1ZLv47blmy4epMriNnmG" alt="头像图片">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.chat-room {
  width: 100%;
  margin-top: 20px;
  background: #ffffff;
  .header {
    display: flex;
    justify-content: space-between;
    font-size:16px;
    font-family:PingFang-SC-Bold;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:36px;
    i {
      display: inline-block;
      width: 36px;
      height: 36px;
      background: url('../../../../static/images/community/language.svg') no-repeat center;
      background-size: 100%;
      margin-right: 10px;
    }
    .all {
      cursor: pointer;
      font-size:14px;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(60,91,111,1);
      line-height:36px;
    }
  }
  .chat-content {
    width: 100%;
    padding: 37px 30px 43px;
    .chat-img {
      position: relative;
      width: 100%;
      height: 110px;
      border-radius:5px;
      margin: 20px 0;
      img {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      .title-box {
        width: 100%;
        height: 110px;
        position: absolute;
        top: 0;
        background:rgba(0,0,0,.3);
        text-align: center;
        span {
          font-size:14px;
          font-family:PingFang-SC-Bold;
          font-weight:bold;
          color:rgba(255,255,255,1);
          line-height:110px;
        }
      }
    }
    .person-img {
      display: flex;
      .img-lists {
        width: 36px;
        height: 36px;
        margin-right: 15px;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .img-lists:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>
