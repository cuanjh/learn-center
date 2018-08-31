<template>
  <div class="learn-wrap">
    <!-- 头部 -->
    <learn-header></learn-header>
    <router-view></router-view>
    <!-- 底部 -->
    <learn-bottom></learn-bottom>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import $ from 'jquery'
import learnHeader from './learnHeader.vue'
import learnBottom from './learnBottom.vue'
export default {
  data () {
    return {}
  },
  created () {
    this.$on('initLayout', () => {
      this.changeWrapHeight()
    })
    this.getUserInfo().then(() => {
      console.log('12121212')
      console.log(this.userInfo.current_course_code)
    })
  },
  components: {
    learnHeader,
    learnBottom
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo'
    }),
    changeWrapHeight () {
      /**
       * 为了完成导航栏会往下掉的动效, body不能设置样式为100%, 否则无法正确计算高度
       * 故而凡是页面高度不足一屏的都需要动态设置页面高度, 避免背景颜色无法完整填充
       */
      var clientHeight = $(window).innerHeight()
      $('.current-course').css('min-height', clientHeight + 'px')
      $('.test-level-wrap').css('min-height', clientHeight + 'px')
      $('.confirm-wrap').css('min-height', clientHeight + 'px')
      $('.homework-wrap').css('min-height', clientHeight + 'px')
    }
  }
}
</script>

<style scoped>
  .learn-wrap {
    padding-top: 80px;
    background: #f1f5f8;
  }
</style>
