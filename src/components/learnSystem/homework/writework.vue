<template>
  <div class="homework-box">
    <div class="head">{{ $t("homework.title") }}</div>
    <div class="content">
      <div class="question"> <b></b><span>{{ $t("homework.write") }}</span>
        <div class="tip" @click="showTips()"><b></b>{{ $t("homework.tip") }}</div>
      </div>
      <div class="que-con f-wwb">
        <p>{{words}}</p>
      </div>
      <div class="que-input" :class="{rtl:dir}">
        <textarea :placeholder="$t('homework.input')" v-focus="hideTips()" v-input="saveMyInput()" v-keydown="preventUndo()" v-model="input"></textarea>
      </div>
      <p class="info">{{ $t("homework.info") }}</p>
    </div>
    <div class="footer f-cb">
      <div class="btn submit" :class="{disable:gray}" @click="exit(0)">{{ $t("homework.submit") }}</div>
      <div class="btn cancel" @click="exit(1)">{{ $t("homework.cancel") }}</div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['data', 'id'],
  // 初始数据/////////////////////////////
  data () {
    return {
      words: '',
      tips: false,
      input: '',
      myInput: '',
      gray: true
      // ,
      // dir: Config.direction < 0
    }
  },
  directives: {
    focus: {
      inserted: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    },
    input: {
      inserted: function (el, {value}) {
        if (value) {
          el.input()
        }
      }
    },
    keydown: {
      inserted: function (el, {value}) {
        if (value) {
          el.keydown()
        }
      }
    }
  },
  created () {
    this.$on('init', () => {
      this.init()
    })
  },
  computed: {
    ...mapState({
      direction: state => state.learn.direction
    }),
    dir () {
      return this.direction < 0
    }
  },
  methods: {
    preventUndo (e) {
      // if (e.ctrlKey || e.metaKey) {
      //   e.preventDefault()
      // }
    },
    init () {
      this.clear()
      var words = this.data.form_options
      // console.log('words:', words)
      if (words) {
        this.words = this.data.form_options.join(' ')
      }
    },

    clear () {
      this.words = ''
      this.tips = false
      this.input = ''
      this.myInput = ''
      this.gray = true
    },

    showTips () {
      this.tips = true
      this.input = this.data.sentence
      console.log('input:', this.input)
    },

    hideTips () {
      if (this.tips) {
        this.input = this.myInput
      } else {
        this.input = this.myInput
      }

      this.tips = false
    },

    saveMyInput () {
      this.myInput = this.input
      this.gray = this.myInput.length === 0
      console.log('gray:', this.gray)
    },

    exit (value) {
      // var _this = this
      if (this.gray && !value) return
      this.gray = true
      // value==1 忽略作业

      // statistics.finish_del_homework({
      //   user_id: Config.userData.userID,
      //   homework_id: this.id,
      //   type: value ? 'del' : 'finish'
      // })
      var sendData = {
        code: this.id,
        ignore: value, // 1忽略 0
        type: this.data.form_show_type,
        word: this.words,
        sentence: this.myInput,
        txt: this.data.sentence
      }
      console.log(sendData)
      // 发送数据
      // var _this = this
      // $.ajax({
      //   method: 'post',
      //   url: Config.URL.homework,
      //   data: send_data,
      //   dataType: 'json'
      // }).done(function(data) {
      //   console.log('callback:', data)
      //   // if(!value)toaster.success(Config.tips.homework_sendSuccess)
      //   if (!value) _this.$dispatch('update-progress')
      //   _this.$dispatch('back-content')
      // })
      this.clear()
    }
  }
}
</script>
