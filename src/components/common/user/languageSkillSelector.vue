<template>
  <multiselect
    label="name"
    :selected="value"
    v-model="selected"
    :options="options"
    :searchable='false'
    @input="updateSelected"
    :show-labels="false"
    placeholder='搜索国籍/地区'
    select-label='按回车可选择'
    deselect-label='按回车取消选择'
    selected-label='已选择'
  >
    <span slot="noResult" >未找到相匹配的语言</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapActions } from 'vuex'
import $ from 'jquery'

export default {
  props: ['value'],
  components: {
    Multiselect
  },
  data () {
    return {
      selected: this.value,
      options: [] // 国家列表
    }
  },
  created () {
    this.$on('init', (val) => {
      this.selected = val
    })
  },
  updated () {
    this.sellangResetCss()
  },
  methods: {
    ...mapActions({
      getLanguages: 'user/getLanguages'
    }),
    updateSelected (newValue) {
      this.$emit('update', newValue)
    },
    sellangResetCss () {
      $('#sellang-content .multiselect__content').css({
        'width': '203px',
        'overflow-y': 'auto'
      })
      $('#sellang-content .multiselect__content li').css({
        'width': '204px',
        'font-size': '14px'
      })
      $('#sellang-content .multiselect__content li .multiselect__option').css({
        'width': '204px',
        'font-family': 'PingFang-SC-Medium',
        'color': '#103044FF',
        'font-size': '14px',
        'font-weight': '500',
        'background': '#fff'
      })
      $('#selcity-content.multiselect__content .multiselect__element').find('.multiselect__option--selected').css({
        'font-size': '14px',
        'font-weight': '500',
        'color': '#103044FF',
        'background': '#EEF2F3FF'
      })
      $('#sellang-content .multiselect__content .multiselect__element').find('.multiselect__option--highlight').css({
        'font-size': '14px',
        'font-weight': '500',
        'color': '#103044FF',
        'background': '#EEF2F3FF'
      })
      $('#sellang-content .multiselect__content li').hover(() => {
        $('#sellang-content .multiselect__content li').css('background-color', '#EEF2F3FF')
      }, () => {
        $('#sellang-content .multiselect__content li').css('background-color', '#ffffff')
      })
    }
  },
  mounted () {
    // 加载语言列表数据
    var _this = this
    this.getLanguages({}).then((res) => {
      console.log('=====', res)
      if (res.success) {
        _this.options = []
        res.mother_tongue.forEach((value, index, array) => {
          var _tmp = {}
          _tmp.lan_code = value.lan_code
          _tmp.name = value.name[_this.languageHandler]
          _this.options.push(_tmp)
        })
      } else {
        var msgStr = 'language skill load error![' + res.code + ']' + res.errorMsg
        throw msgStr
      }
    })
  },
  computed: {
    languageHandler () {
      return this.$store.state.user.languageHandler
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style>
  .user-setting-form form > div .sellang {
    width: 390px;
  }
  .multiselect__tags-wrap .multiselect__tag {
    margin: 0px 5px 8px 5px;
  }
  .multiselect__tag {
    background: #3c9bbe;
  }
</style>
