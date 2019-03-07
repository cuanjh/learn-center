<template>
  <div>
    <ul class="book-resource">
      <li v-for="(item, index) in resourceInfoRadios" :key="index">
        <div class="book-img">
          <img @click="goDetail(item.code)" v-lazy="item.cover" :key="item.cover" alt="资源图片">
          <div class="gradient-layer-play" @click="loadRadioList($event, item)">
            <i class="play"></i>
          </div>
        </div>
        <div class="book-content">
          <router-link tag="div" class="book-title" :to="{path: '/app/discovery/radio-detail/' + item.code}">
            <p class="share-title">{{ item.title }}</p>
            <p class="share">
              <span>作者：{{ item.author_name }}</span>
              <span><i></i>{{item.buy_num}}次播放</span>
              <span v-text="(item.money === 0) ? $t('free') : (item.money_type === 'CNY') ? '￥' +item.money : $t('coins') + ' ' + item.money"></span>
            </p>
          </router-link>
          <div class="icon" v-show="false"></div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import Bus from '../../../bus.js'
import $ from 'jquery'

export default {
  props: ['resourceInfoRadios'],
  data () {
    return {
    }
  },
  methods: {
    // 点击播放电台
    loadRadioList (e, radio) {
      console.log('e', e)
      console.log('radio', radio)
      if (this.isPlay && radio.code === this.lastCode) {
        $('.gradient-layer-play i').removeClass('pause')
        $(e.target).addClass('play')
        Bus.$emit('radioPause')
      } else {
        $('.gradient-layer-play i').removeClass('pause')
        $('.gradient-layer-play i').addClass('play')
        $(e.target).removeClass('play')
        $(e.target).addClass('pause')
        if (radio.code !== this.lastCode) {
          Bus.$emit('getRadioCardList', radio)
          this.lastCode = radio.code
        } else {
          Bus.$emit('radioPlay')
        }
      }
      this.isPlay = !this.isPlay
    },
    // 详情页面
    goDetail (code) {
      this.$router.push({
        path: `/app/discovery/radio-detail/${code}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
.book-resource {
  width: 100%;
  padding: 50px 100px;
}

.book-resource li {
  display: flex;
  position: relative;
  width: 100%;
  padding: 20px 0;
  border-bottom:1px solid rgba(234,234,234,1);
}
.book-resource li .book-img {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width:160px;
  height:80px;
  border-radius:3px;
}
.gradient-layer-play {
  cursor: pointer;
  display: inline-block;
  position: absolute;
  right: 6px;
  bottom: 6px;
  background: rgba(18, 18, 18, .415);
  border-radius: 50%;
  .play {
    width: 24px;
    height: 24px;
    background-image: url('../../../../static/images/radionoPlay.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
  }
  .pause {
    width: 24px;
    height: 24px;
    background-image: url('../../../../static/images/radioPlay.svg');
    background-repeat: no-repeat;
    background-size: cover;
    display: inline-block;
  }
}
.book-resource li .book-img img{
  width:160px;
  height:80px;
  border-radius:3px;
  object-fit: cover;
}
.book-resource li .book-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 12px;
}
.book-resource li .book-content .book-title {
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  font-size: 14px;
}
.book-resource li .book-title .share-title {
  font-size:16px;
  font-family:PingFangSC-Medium;
  font-weight:500;
  color:rgba(51,51,51,1);
  width: 300px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.book-resource li .book-title .share {
  display: flex;
  font-size:12px;
  font-family:Helvetica;
  color:rgba(203,203,203,1);
}
.book-resource li .book-title .share span {
  display: flex;
  align-items: center;
  color: #999999;
  margin-right: 32px;
}
.book-resource li .book-title .share span:nth-child(1) {
  margin-right: 0;
  display: inline-block;
  width: 100px;
  height: 24px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-right: 2px;
}
.book-resource li .book-title .share i {
  display: inline-block;
  width: 12px;
  height: 9px;
  background: url('../../../../static/images/listening.png') no-repeat center;
  background-size: cover;
  margin-right: 10px;
}
.book-resource li .book-content .icon {
  cursor: pointer;
  display: inline-block;
  width: 10px;
  height: 18px;
  background: url('../../../../static/images/bookCase/jiantou.png') no-repeat;
  background-size: 10px 18px;
}

.book-resource li:last-child {
  border: 0;
}
.up-all {
  cursor: pointer;
  width: 100%;
  background: #DEDEDEFF;
  text-align: center;
  line-height: 42px;
  font-size:14px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(42,159,228,1);
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url('../../../../static/images/authLogin/weixin.svg') no-repeat center;
    background-size: cover;
    margin-left: 10px;
  }
}
</style>
