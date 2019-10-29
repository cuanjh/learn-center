<template>
  <div class="stage f-cb f-usn" :class="{shake:isShake}">
    <div class="sentencetoimg">
      <component :is="'form-sentencetoimg'" :data="group" :cutdown="true" ref="form-sentencetoimg"></component>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import SentenceToImg from '../form/sentenceToImg.vue'
import SoundManager from '../../../plugins/soundManager'
import common from '../../../plugins/common'

export default {
  props: ['data', 'path'],
  components: {
    'form-sentencetoimg': SentenceToImg
  },
  mounted () {
    this.$nextTick(() => {
      this.groups = this.getGroups(this.data)
      this.showgroup()
    })
    // 来自挑战者的攻击
    this.$on('pk_player_getProgress', () => {
      SoundManager.playSnd('kick')
      this.isShake = true
      this.timeoutId_shake = setTimeout(() => {
        this.isShake = false
      }, this.delay_shake)
    })
  },
  // 初始数据/////////////////////////////
  data () {
    return {
      timeoutId_shake: null,
      delay_shake: 800,
      groups: [],
      group: [],
      score: 0,
      cur: 0,
      isShake: false
    }
  },
  beforeDestroy () {
    this.$refs['form-sentencetoimg'].$emit('break')
  },
  created () {
    this.$on('next-component', (score, bool) => {
      console.log('next-component')
      this.score += score || 0
      this.$parent.$emit('form-score', this.cur, score)
      // pk prog的日志数据在cutdown中进行采集
      if (bool) {
        var isFirst = 1 // 检测是否首次学习，默认为第一次
        var formNum =
          this.groups[this.cur][0].form_sound.src
            .split('sounds/')[1]
            .replace(/-\d+.mp3$/, '')
            .split('/')
            .join('-') +
          '-' +
          (this.cur + 1)
        var type = this.groups[this.cur][0].form_show_type
        var optinon = 'null'
        var result = score
        // var p11 = formNum
        //   .split('-')
        //   .slice(0, 6)
        //   .join('-')
        this.$dispatch('pkProgLog', isFirst, formNum, type, optinon, result)
      }

      this.$refs['form-sentencetoimg'].$emit('break')
      // this.$emit('pk_player_setProgress', [this.cur, score])

      this.cur++

      if (this.cur === this.groups.length) {
        this.timeup()
        this.clear()
      } else {
        this.showgroup()
      }
    })

    this.$on('timeup', () => {
      this.timeup()
      this.clear()
      this.$emit('break')
    })

    this.$on('break', () => {
      this.timeup()
      this.clear()
      this.$refs['form-sentencetoimg'].$emit('break')

      clearTimeout(this.timeoutId_shake)
      this.timeoutId_shake = null
    })
  },

  methods: {
    getGroups (lis) {
      var arr = []
      var len = parseInt(lis.length / 2)
      console.log('groups:', len)
      for (var i = 0; i < len; i++) {
        var itm1 = lis[i * 2]
        var itm2 = lis[i * 2 + 1]
        var group = [itm1, itm2]
        group = _.shuffle(group)
        arr.push(group)
      }
      return arr
    },

    showgroup () {
      this.$set(this, 'group', this.groups[this.cur])
      // 重置
      common.reset()

      window.onresize = () => {
        common.resize(this.group, ['sentencetoimg'])
      }
      this.$nextTick(() => {
        this.$refs['form-sentencetoimg'].$emit('start')
        this.$refs['form-sentencetoimg'].$emit('init')
        common.resize(this.group, ['sentencetoimg'])
      })
    },

    timeup () {
      var score = this.score / this.groups.length

      this.$parent.$emit('finished-pk', score)
    },

    clear () {
      this.score = 0
      this.cur = 0
      this.timeoutId_shake = null
    }
  }
}
</script>
