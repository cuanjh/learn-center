<template>
  <div>
    <ul class="book-nation">
      <li v-for="(item, index) in countryLists" :key="index">
        <div class="nation-li">
          <div class="nation-title">
            <p>{{ item.name }}</p>
          </div>
          <div class="nation-img" @click="nationDetail(item.code, item.flag, item.name)">
            <img v-lazy="item.flag" :key="item.flag" :onerror="defaultImg" alt="资源图片">
          </div>
          <div class="nation-languages">
            <div class="languages">
              <p>Principal Languages:</p>
              <p>
                <span v-for="(el, index) in item.countryLangueInfos" :key="index">{{el.name}},</span>
              </p>
              <p>
                <span>Learn more</span>
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: ['countryLists', 'courseCode'],
  data () {
    return {
      langsInfoList: '',
      defaultImg: 'this.src="/static/images/bookCase/default_course.png"'
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions({
      countryInfo: 'course/countryInfo' // 国家详情
    }),
    getTextByJs (arr) {
      for (var i = 0; i < arr.length; i++) {
        this.langsInfoList += arr[i].name + ','
      }
      // 去掉最后一个逗号(如果不需要去掉，就不用写)
      if (this.langsInfoList.length > 0) {
        this.langsInfoList = this.langsInfoList.substr(0, this.langsInfoList.length - 1)
      }
      return this.langsInfoList
    },
    nationDetail (code, flag, name) {
      let OBJ = {
        'flag': flag,
        'name': name,
        'params': this.courseCode,
        'courseCode': this.courseCode
      }
      let jsonStr = JSON.stringify(OBJ)
      localStorage.setItem('nationInfos', jsonStr)
      this.$router.push({ path: `/app/nation-details/${code}` })
    }
  }
}
</script>
<style lang="less" scoped>
.book-nation {
  width: 100%;
  // min-height: 630px;
  padding: 50px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.book-nation:after {
  content: "";
  flex: auto;
}
.book-nation li {
  width: 318px;
  padding: 25px 0;
  // border-bottom: 1px solid #EBEBEB;
  cursor: pointer;
}
.book-nation li .nation-li {
  width: 100%;
  padding: 0 0 0 89px;
  border-right: 1px solid #EEF2F3FF;
}
.book-nation li .nation-img {
  width: 53px;
  height: 38px;
  margin: 18px 0;
}
.book-nation li .nation-img img{
  width: 53px;
  height: 38px;
  border-radius: 2px;
  box-shadow: 0px 4px 6px rgba(36, 87, 120, 0.21)
}
.book-nation li .nation-title {
  font-size:16px;
  font-family:PingFangSC-Semibold;
  font-weight:600;
  color:rgba(0,42,91,1);
}
.book-nation li .nation-languages .languages p:nth-child(1){
  font-size:14px;
  font-family:PingFang-SC-Regular;
  font-weight:400;
  color:rgba(51,51,51,1);
  margin-bottom: 6px;
}
.book-nation li .nation-languages .languages p:nth-child(2){
    display: inline-block;
    word-wrap: break-word;
    word-break: normal;
    width: 200px;
    height: 62px;
    font-size: 14px;
    font-family: PingFang-SC-Regular;
    font-weight: 400;
    color: #999999;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
}
.book-nation li .nation-languages .languages p:nth-child(3) {
  cursor: pointer;
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(42,159,228,1);
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
