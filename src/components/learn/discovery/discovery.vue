<template>
  <div class="discovery-wrap">
    <router-view></router-view>
    <voice-player></voice-player>
  </div>
</template>

<script>
import VoicePlayer from '../../common/voicePlayer.vue'
export default {
  data () {
    return {
    }
  },
  components: {
    VoicePlayer
  },
  mounted () {
    this.$parent.$emit('initLayout')
    this.$parent.$emit('navItem', 'discovery')
  }
}
</script>

<style scoped>
.discovery-wrap {
  background: #ecf4f7;
  width: 100%;
  min-height: 1000px;
}
</style>
