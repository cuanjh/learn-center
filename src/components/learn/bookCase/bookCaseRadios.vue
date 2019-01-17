<template>
  <div>
    <ul class="book-resource">
      <li v-for="(item, index) in resourceInfoRadios" :key="index">
        <div class="book-img">
          <img v-lazy="item.cover" :key="item.cover" alt="资源图片">
        </div>
        <div class="book-content">
          <router-link tag="div" class="book-title" :to="{path: '/app/discovery/radio-detail/' + item.code}">
            <p class="share-title">{{ item.title }}</p>
            <p class="share">
              <span>BY:</span>
              <span>{{ item.author_name }}</span>
              <i></i>
              <span>128 W</span>
            </p>
          </router-link>
          <div class="icon"></div>
        </div>
      </li>
    </ul>
    <!-- <div class="up-all" v-if="resourceInfoRadios.length>0">
      <span @click="loadMore()" v-text="showMore?'全部展开':'已经没有更多内容了~~'" ></span>
      <i v-show="showMore"></i>
    </div>
    <div class="up-all" v-else>
      <span >暂时没有课程相关资源</span>
    </div> -->
  </div>
</template>
<script>
export default {
  props: ['resourceInfoRadios', 'showMore'],
  data () {
    return {
    }
  },
  methods: {
    loadMore () {
      this.$emit('loadingMoreRadio')
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
  display: inline-block;
  width:168px;
  height:80px;
  border-radius:3px;
}
.book-resource li .book-img img{
  width:168px;
  height:80px;
  border-radius:3px;
  object-fit: cover;
}
.book-resource li .book-content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 23px;
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
}
.book-resource li .book-title .share {
  font-size:12px;
  font-family:Helvetica;
  color:rgba(203,203,203,1);
}
.book-resource li .book-title .share span {
  color: #999999;
  margin-right: 10px;
}
.book-resource li .book-title .share span:nth-child(2) {
  display: inline-block;
  width: 100px;
  height: 24px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.book-resource li .book-title .share i {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: url('../../../../static/images/bookCase/icon.svg') no-repeat center;
  background-size: cover;
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
