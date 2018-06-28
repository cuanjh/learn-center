<style scoped>
  .book-details {
    width: 1200px;
    margin: 0px auto 144px;
  }
  .details-header {
    width: 100%;
    height: 302px;
    border-radius: 3px;
    box-shadow: 0px 2px 4px #DAE6F3;
    background-color: #fff;
    padding: 18px 36px 0px;
    position: relative;
  }
  .tab-item {
    overflow: hidden;
    position: absolute;
    bottom: 0px;
  }
  .tab-item span {
    float: left;
    display: block;
    font-size: 16px;
    color: #999;
    cursor: pointer;
    margin-right: 68px;
    padding: 0px 2px 12px;
  }
  .tab-item .active {
    color: #0581D1;
    border-bottom: 4px solid #0581D1;
  }
  .tab-content {
    border-radius: 3px;
    background-color: #fff;
    /* box-shadow: 0px 2px 4px #DAE6F3; */
    padding: 46px 36px 22px;
  }
  .book-info  li {
    margin-bottom: 34px;
  }
  .book-info .title {
    font-size: 16px;
    color: #0581D1;
    border-bottom: 1px solid #EBEBEB;
    padding-bottom: 12px;
  }
  .book-info .desc {
    width: 506px;
    font-size: 16px;
    color: #494949;
    margin-top: 12px;
  }
</style>
<template>
  <div class="book-details">
    <div class="details-header">
      <div class="tab-item">
        <span class="active">信息</span>
        <span>资源</span>
      </div>
    </div>
    <div class="tab-content">
      <ul class="book-info">
        <li>
          <p class="title">简介</p>
          <p class="desc">Luganda (Luganda) also known as Ganda, is the main language of Uganda. More than ten million of the users are mainly concentrated in southern Uganda, includingthe cap... </p>
        </li>
        <li>
          <p class="title">简介</p>
          <p class="desc">Luganda (Luganda) also known as Ganda, is the main language of Uganda. More than ten million of the users are mainly concentrated in southern Uganda, includingthe cap... </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import http from './../../../api/bookCase.js'
export default {
  data () {
    return {}
  },
  mounted () {
    console.log(http.langInfo)
    http.langInfo({lang_code: 'eng-Basic'}).then(res => {
      for (var item in res.langInfo) {
        console.log(res.langInfo[item])
      }
    })
  }

}
</script>
