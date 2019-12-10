<template>
  <div class="form">
    <div class="img-wrap">
      <next-comp @next="next"/>
      <img :src="form.image" alt="">
      <transition name="fade" mode="out-in">
        <record-comp ref="recordItem" v-show="isShow" :sentence="form.sentence" :code="form.code"/>
      </transition>
    </div>
    <div class="content">
      <p class="text">
        <span v-for="(w, index) in formatSentence" :key="index" v-html="w.indexOf('-') > -1 ? w : ' ' + w" @click="showWordPanel($event, index)"></span>
      </p>
      <trumpet-comp ref="trumpet" :sound="form.sound" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import TrumpetComp from '../common/trumpet'
import RecordComp from '../common/record'
import nextComp from '../common/next'
import bus from '../../../bus'

export default {
  props: ['form'],
  data () {
    return {
      isShow: false,
      formatSentence: [],
      iseWords: []
    }
  },
  components: {
    TrumpetComp,
    RecordComp,
    nextComp
  },
  created () {
    this.$on('break', () => {
      this.reset()
      this.$refs['trumpet'].$emit('break')
    })

    this.$on('init', () => {
      console.log('repeatSpeak init')
      this.$refs['trumpet'].$emit('init', false, () => {
        this.isShow = true
        this.$refs.recordItem.$emit('init')
      })
      this.$refs.recordItem.closeRecord()
      this.formatSentence = this.formatContent(this.form.sentence)
    })

    this.$on('iseResultSet', () => {
      this.iseResultSet()
    })
  },
  methods: {
    reset () {
      this.isShow = false
      this.formatSentence = []
      setTimeout(() => {
        this.formatSentence = this.formatContent(this.form.sentence)
      }, 10)
      this.$refs['recordItem'].reset()
    },
    next () {
      this.$parent.$emit('nextForm')
      bus.$emit('setStudyFormScore', {formCode: this.form.code, score: 1})
    },
    // 格式化内容，添加span标签
    formatContent (content) {
      if (!content) {
        return ''
      }
      let result = []
      let arrBR = content.split('\n')
      console.log(arrBR)
      for (let m = 0; m < arrBR.length; m++) {
        let arr = arrBR[m].split(' ')
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].trim().length > 0) {
            if (arr[i] === '<br/>') {
              result.push('<br/>')
            } else if (arr[i].indexOf('<br/>') > -1) {
              let r = arr[i].split('<br/>')
              for (let l = 0; l < r.length; l++) {
                if (r[l].trim().length > 0) {
                  let tag = ''
                  if (l === 0) {
                    tag = '<br/>'
                  }
                  result.push(r[l].trim() + tag)
                }
              }
            } else if (arr[i].indexOf('?') > -1) {
              let r = arr[i].split('?')
              for (let j = 0; j < r.length; j++) {
                if (r[j].trim().length > 0) {
                  let tag = ''
                  if (j === 0) {
                    tag = '?'
                  }
                  result.push(r[j].trim() + tag)
                }
              }
            } else if (arr[i].indexOf('”') > -1) {
              let r = arr[i].split('”')
              for (let k = 0; k < r.length; k++) {
                if (r[k].trim().length > 0) {
                  let tag = ''
                  if (k === 0) {
                    tag = '”'
                  }
                  result.push(r[k].trim() + tag)
                }
              }
            } else if (arr[i].indexOf('《') > -1) {
              let r = arr[i].split('《')
              if (r[0].length > 0) {
                result.push(r[0])
              }
              result.push('《' + r[1])
            } else {
              if (arr[i].trim() === '—') {
                result.push(arr[i].trim())
                continue
              } else if (arr[i].trim().indexOf('-') > -1) {
                let arr1 = arr[i].trim().split('-')
                result.push(arr1[0])
                result.push('-' + arr1[1])
              } else {
                result.push(arr[i].trim())
              }
            }
          }
        }
        if (arrBR.length > 1 && m === 0) {
          result.push('<br/>')
        }
      }
      return result
    },
    // 评测结果处理
    iseResultSet () {
      let xfISEResult = JSON.parse(localStorage.getItem('xfISEResult'))
      this.iseWords = []
      if (xfISEResult && xfISEResult.length > 0) {
        let formObj = xfISEResult.find(item => {
          return item.form_code === this.form.code
        })
        if (!formObj) {
          return false
        }
        this.iseWords = formObj.words_score
        $('#pro-swiper .swiper-slide-active').find('.content p').data('isevaluate', '1')
        $('#pro-swiper .swiper-slide-active').find('.content p span').removeClass('right')
        $('#pro-swiper .swiper-slide-active').find('.content p span').removeClass('wrong')

        this.iseWords.forEach((word, index) => {
          let score = parseInt(word.score)
          switch (true) {
            case score >= 80:
              $('#pro-swiper .swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('right')
              break
            case score < 60:
              $('#pro-swiper .swiper-slide-active').find('.content p span:nth-child(' + (index + 1) + ')').addClass('wrong')
              break
            default:
              break
          }
        })
      }
    },
    showWordPanel (event, index) {
      let isEvaluate = $('.swiper-slide-active').find('.content p').data('isevaluate')
      if (isEvaluate !== '1') {
        return
      }
      if (this.iseWords.length > 0 && this.iseWords[index]) {
        let offset = $(event.target).offset()
        let word = this.iseWords[index]
        bus.$emit('showWordPanel', {word: word, offset: offset})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fade-enter-active {
  animation: fade-in .5s;
}
.fade-leave-active {
  animation: fade-in .1s reverse;
}
@keyframes fade-in {
  0% {
    transform: translateY(0);
    -webkit-transform: translateY(0);
    -o-transform: translateY(0);
    -moz-transform: translateY(0);
  }
  100% {
    transform: translateY(-150px);
    -webkit-transform: translateY(-150px);
    -o-transform: translateY(-150px);
    -moz-transform: translateY(-150px);
  }
}
.text {
  span {
    cursor: pointer;
  }
}
</style>
