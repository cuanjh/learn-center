<template>
  <div class="word-panel" :style="{left: left + 'px', top: top + 'px'}" v-show="isShow">
    <div class="triangle_border_down">
      <span></span>
    </div>
    <div class="word">
      {{ word }}
    </div>
    <table class="syll-phone">
      <tr v-for="(phone, index) in phones" :key="index">
        <td>{{ (index == 0) ? syll : '' }}</td>
        <td>{{ '音素 [' + xfSyllPhone[phone.content] + ']' }}</td>
        <td>{{ phone.dp_message == '0' ? '朗读正常' : '未朗读' }}</td>
      </tr>
    </table>
    <ise-area
      :isEvaluation="false"
      @startRecord="startRecord"
      @stopRecord="stopRecord"
      @playRecord="playRecord"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import IseArea from './iseArea.vue'
export default {
  data () {
    return {
      isShow: false,
      left: 0,
      top: 0,
      word: '',
      syll: '',
      phones: []
    }
  },
  components: {
    IseArea
  },
  computed: {
    ...mapState({
      xfSyllPhone: state => state.xfSyllPhone
    })
  },
  methods: {
    show (params) {
      console.log(params)
      this.left = params.offset.left - 100
      this.top = params.offset.top - 230
      this.word = params.word.content
      this.phones = []
      if (Array.isArray(params.word.syll)) {
        params.word.syll.forEach(item => {
          if (Array.isArray(item.phone)) {
            item.phone.forEach(p => {
              this.phones.push(p)
            })
          } else {
            this.phones.push(item.phone)
          }
        })
      } else {
        if (Array.isArray(params.word.syll.phone)) {
          params.word.syll.phone.forEach(item => {
            this.phones.push(item)
          })
        } else {
          this.phones.push(params.word.syll.phone)
        }
      }
      this.syll = '['
      this.phones.forEach(p => {
        this.syll += this.xfSyllPhone[p.content]
      })
      this.syll += ']'
      this.isShow = !this.isShow
    },
    startRecord () {
      this.$emit('startRecord')
    },
    stopRecord () {
      this.$emit('stopRecord')
    },
    playRecord (flag) {
      this.$emit('playRecord', flag)
    }
  }
}
</script>

<style lang="less" scoped>
.word-panel {
  position: absolute;
  padding: 24px;
  width: 400px;
  background: #fff;
  border-radius: 6px;
  box-shadow:0px 0px 17px 0px rgba(0,0,0,0.1);
  z-index: 99999;
  .word {
    font-size: 20px;
    font-weight: 500;
    color: #000000;
    line-height: 28px;
  }
  .syll-phone {
    tr {
      td {
        padding: 6px 12px 0 0;
        font-size: 14px;
        color: #5D717F;
        line-height: 20px;
        font-weight: 400;
        &:first-child {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }
}

.triangle_border_down span{
  display:block;
  width:0;
  height:0;
  border-width:0px 10px 10px;
  border-style:solid;
  border-color:transparent transparent #fff;/*黄 透明 透明 */
  position:absolute;
  left: 75px;
  top: -9px;
}
</style>
