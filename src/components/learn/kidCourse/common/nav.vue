<template>
  <div class="nav-container">
    <div class="left">
      <router-link class="back" :to="{path:'/app/kid-course-list/' + chapterCode.split('-').slice(0, 2).join('-')}">
        <i></i>
      </router-link>
      <span>{{ chapterDes }}</span>
      <span data-intro="this is a tooltip">{{ type == 'draw' ? '绘本阅读' : '绘本单词' }}</span>
    </div>
    <record-box :chapterCode="chapterCode" :type="type"/>
  </div>
</template>

<script>
import RecordBox from './recordBox.vue'
export default {
  props: ['chapterCode', 'type'],
  data () {
    return {}
  },
  components: {
    RecordBox
  },
  computed: {
    chapterDes () {
      let arr = this.chapterCode.toLowerCase().split('-')
      return '课程' + ((parseInt(arr[3].replace('unit', '')) - 1) * 6 + parseInt(arr[4].replace('chapter', '')))
    }
  }
}
</script>

<style lang="less" scoped>
.nav-container {
  width: 100%;
  height: 76px;
  background: #fff;
  .back {
    margin-left: 76px;
    min-width: 42px;
    text-align: center;
    i {
      display: inline-block;
      text-align: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background-image: url('../../../../../static/images/kid/icon-back.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    &:hover {
      i {
        width: 42px;
        height: 42px;
        box-shadow:0px 4px 9px -4px rgba(24,193,255,1);
      }
    }
  }
  span {
    font-size: 24px;
    font-weight: 600;
    color:#3C5B6F;
    margin-left: 32px;
  }
  .left {
    height: 100%;
    float: left;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
