<template>
  <multiselect
    label="name"
    track-by="name"
    :options="options"
    :close-on-select="true"
    v-model="selected"
    :multiple="true"
    :taggable="false"
    :loading='false'
    :max='3'
    @input="updateSelected"
    placeholder='精通语言'
    select-label='按回车可选择'
    deselect-label='按回车取消选择'
    selected-label='已选择'
  >
    <span slot="noResult" >未找到相匹配的语言</span>
    <span slot="maxElements">最多只能选3门精通语言</span>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { mapActions } from 'vuex'

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
  methods: {
    ...mapActions({
      getLanguages: 'user/getLanguages'
    }),
    updateSelected (newValue) {
      this.$emit('update', newValue)
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
          _tmp.language = value.lan_code
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
