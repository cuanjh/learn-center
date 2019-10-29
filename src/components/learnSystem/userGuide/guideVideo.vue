<template>
  <div class="module-video guide-body" :class="{videoani:ani}">
    <guide-header :title="'video-header'" />
    <section class="guide-container">
        <p class="desc">
          {{ $t('guide.video-desc') }}
        </p>
        <video src="http://mobile-static.talkmate.com/resource/2017-01-16/jiaoxuefa-zh.mp4" width="560" height="315" poster="http://mobile-static.talkmate.com/resource/2017-01-16/jiaoxuefa.png" controls preload class="movie_player"></video>
    </section>
    <guide-bottom :page="'video'"></guide-bottom>
  </div>
</template>

<script>
import $ from 'jquery'
import { mapState } from 'vuex'
import GuideHeader from './guideHeader.vue'
import GuideBottom from './guideBottom.vue'

export default {
  data () {
    return {
      ani: '',
      src: ''
    }
  },
  components: {
    GuideHeader,
    GuideBottom
  },
  mounted () {
    var videoSrc = {
      'chinese': 'http://mobile-static.talkmate.com/resource/2017-01-16/jiaoxuefa-zh.mp4',
      'english': 'http://mobile-static.talkmate.com/resource/2017-01-16/jiaoxuefa-us.mp4'
    }
    this.$nextTick(() => {
      if (this.language !== 'chinese') {
        $('video')[0].src = videoSrc['english']
      }
    })
  },
  created () {
    this.$on('changePage', (page) => {
      if (page === 'video') {
        this.ani = 'ani'
        $(this.$el)
          .find('video')
          .remove()
      }
      return false
    })
    this.$on('playVideo', () => {})
  },
  computed: {
    ...mapState({
      language: state => state.course.language
    })
  }
}
</script>

<style lang="less" scoped>
.module-video {
  z-index: 98;
  .desc {
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    margin-top: 10px;
  }
  .movie_player {
    margin: 0 auto;
    display: block;
    margin-bottom: 26px;
  }
}
</style>
