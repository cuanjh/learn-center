<template>
<transition name="fade">
  <div class="word-modal-box" v-show="showWordBox">
    <div class="word-box-content">
      <div class="close-img-box" @click="closeModal()"></div>
      <word-item :newWords="newWords"/>
    </div>
  </div>
</transition>
</template>

<script>
import WordItem from './wordItem.vue'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      showWordBox: false,
      newWords: []
    }
  },
  components: {
    WordItem
  },
  computed: {
    ...mapState({
      xfSyllPhone: state => state.xfSyllPhone // 因素的对应表
    })
  },
  methods: {
    showWordListBox (params) {
      let words = params
      this.newWords = []
      words.forEach(word => {
        if (word.content !== 'sil' && word.content !== 'fil') {
          let w = {}
          w['content'] = word.content
          w['total_score'] = word.total_score
          w['phones'] = this.getPhones(word.syll)
          w['sylls'] = this.getSylls(this.getPhones(word.syll))
          this.newWords.push(w)
        }
      })
      console.log(this.newWords)
      this.showWordBox = true
    },
    closeModal () {
      this.showWordBox = false
    },
    // 获取单词发音
    getSylls (phones) {
      if (phones) {
        let syll = '['
        phones.forEach(p => {
          syll += this.xfSyllPhone[p.content]
        })
        syll += ']'
        return syll
      }
    },
    // 获取所有的音素
    getPhones (syll) {
      let phones = []
      if (Array.isArray(syll)) {
        syll.forEach(item => {
          if (Array.isArray(item.phone)) {
            item.phone.forEach(p => {
              phones.push(p)
            })
          } else {
            phones.push(item.phone)
          }
        })
      } else {
        if (syll) {
          if (Array.isArray(syll.phone)) {
            syll.phone.forEach(item => {
              phones.push(item)
            })
          } else {
            phones.push(syll.phone)
          }
        }
      }
      return phones
    }
  }
}
</script>

<style lang="less" scoped>
.word-modal-box {
  position: fixed;
  width:100%;
  height:100%;
  top:0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index:99999999;
  overflow: hidden;
  .word-box-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 470px;
    min-height: 260px;
    max-height: 600px;
    background: #fff;
    box-shadow:0px 24px 24px 0px rgba(0,0,0,0.12);
    border-radius:8px;
    .close-img-box {
      position: absolute;
      top: -30px;
      right: -30px;
      width: 30px;
      height: 30px;
      background: url('../../../../../static/images/kid/icon-close.png') no-repeat center;
      background-size: cover;
      cursor: pointer;
      &:hover {
        opacity: .8;
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
