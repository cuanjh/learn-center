<template>
  <div class="record-box" @mouseenter="isShowTip = true" @mouseleave="isShowTip = false" v-show="kidRecordList.length > 0">
    <router-link :to="{path: '/kid/kid-record-list', query: {code: chapterCode, type: type}}" class="record-icon">
      <i></i>
      <span>{{ kidRecordList.length }}</span>
    </router-link>
    <transition name="fade" mode="out-in">
      <div class="tip" v-show="isShowTip">
        <span>我的{{ type=='draw' ? '绘本' : '单词' }}录音</span>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: ['chapterCode', 'type'],
  data () {
    return {
      isShowTip: false
    }
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapState({
      kidRecordList: state => state.kidRecordList
    })
  },
  methods: {
    ...mapActions([
      'getKidRecordList'
    ]),
    initData () {
      this.getKidRecordList({chapter_code: this.chapterCode, teacher_module: this.type})
    }
  }
}
</script>

<style lang="less" scoped>
.record-box {
  float: right;
  position: relative;
  margin-right: 80px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.record-icon {
  display: flex;
  flex-direction: row;
  justify-items: center;
  i {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: url('../../../../../static/images/kidcontent/icon-record-list.png');
    background-repeat: no-repeat;
    background-size: cover;
  }
  span {
    margin-left: 14px;
    line-height: 50px;
    font-size: 20px;
    font-weight: 600;
    color: #C3D0D8;
  }
}
.tip {
  position: absolute;
  width: 153px;
  height: 77px;
  background: url('../../../../../static/images/kidcontent/pic-blue-record-list.png');
  background-repeat: no-repeat;
  background-size: cover;
  top: 50px;
  left: -50px;
  text-align: center;
  line-height: 80px;
  span {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
