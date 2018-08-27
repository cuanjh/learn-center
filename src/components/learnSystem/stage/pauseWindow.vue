<template>
  <div id="pause-conatiner" v-show="show">
    <div class='pop'>
      <div class='pause' @click="resume">
        <b></b>
        {{$t("pause")}}
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import dialog from '../../../plugins/dialog'

export default {
  name: 'pause-window',
  data () {
    return {
      show: false,
      window: {}
    }
  },
  created () {
    this.$on('pause-show', () => {
      this.window = dialog({
        content: document.querySelector('.pop')
      }).showModal()
    })
  },
  methods: {
    resume () {
      this.window.remove()
      $('#pause-conatiner').append($('.pop'))
      this.$parent.$emit('component-resume')
    }
  }
}
</script>

<style lang="less" scoped>
.pop {
  background-color: #55a4fc;
  width: 320px;
  height: 175px;
  border-radius: 3px;
  display: table;
  text-align: center;
  font-size: 1.4em;
  color: #fff;
  .pause {
    vertical-align: middle;
    display: table-cell;
    cursor: pointer;
    b {
      transition: all 0.3s ease;
      background: url(../../../../static/images/learnSystem/progress/play.png);
      width: 25px;
      height: 25px;
      display: inline-block;
      position: relative;
      top: 6px;
      margin-right: 7px;
    }
    &:hover {
      b {
        background: url(../../../../static/images/learnSystem/progress/play-hover.png);
      }
    }
  }
}
</style>
