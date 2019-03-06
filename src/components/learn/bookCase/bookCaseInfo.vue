<template>
  <div>
    <ul class="book-info">
      <li v-for="(item, key, index) in langInfoObj" :key="index">
        <p class="title">{{item.title}}</p>
        <p v-if="key === 'LanguageResources'" class="desc">
          <a :href="item.info">{{item.info}}</a>
        </p>
        <p v-else class="desc">{{item.info}}</p>
      </li>
    </ul>
    <!-- <div class="up-all">
      <span >全部展开</span>
      <i></i>
    </div> -->
  </div>
</template>
<script>
export default {
  props: ['langInfoObj'],
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.book-info {
  min-height: 630px;
  padding: 58px 89px 35px;
  li {
    border-bottom: 1px solid #EBEBEB;
    padding: 28px 0;
  }
  li:last-child {
    border-bottom: none;
  }
}
.book-info .title {
  font-size:14px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(51,51,51,1);
}
.book-info .desc {
  width: 100%;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(132,147,165,1);
  margin-top: 2px;
}
.book-info .desc a {
  color: #0581D1;
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
