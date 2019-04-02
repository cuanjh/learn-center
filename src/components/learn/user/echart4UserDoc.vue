<template>
  <div></div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: ['echartdata'],
  mounted () {
    var _array = [0, 0, 0, 0, 0]
    if (this.echartdata['model_mother_tongue'] > 0) {
      _array[0] = this.echartdata['model_mother_tongue']
    }
    if (this.echartdata['model_language_expression'] > 0) {
      _array[1] = this.echartdata['model_language_expression']
    }
    if (this.echartdata['model_statement_comprehensive'] > 0) {
      _array[2] = this.echartdata['model_statement_comprehensive']
    }
    if (this.echartdata['model_comprehensive_app'] > 0) {
      _array[3] = this.echartdata['model_comprehensive_app']
    }
    if (this.echartdata['model_language_logic'] > 0) {
      _array[4] = this.echartdata['model_language_logic']
    }
    var myChart = echarts.init(this.$el)
    this.drawChart(myChart, _array)
  },
  methods: {
    drawChart (obj, _array) {
      obj.setOption({
        title: {
          text: ''
        },
        tooltip: {},
        radar: {
          indicator: [
            { name: '母语思维', max: 1 },
            { name: '语言表达', max: 1 },
            { name: '语句理解', max: 1 },
            { name: '综合应用', max: 1 },
            { name: '语言逻辑', max: 1 }
          ],
          name: {
            textStyle: {
              color: '#999999FF',
              lineHeight: 20,
              fontSize: 14,
              borderRadius: 2,
              padding: [2, 0]
            },
            formatter: (text) => {
              text = text.replace(/\S{2}/g, function (match) {
                console.log(match)
                return match + '\n'
              })
              return text
            }
          },
          nameGap: 7,
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#ededed'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#ededed'
            }
          }
        },
        series: [
          {
            type: 'radar',
            symbol: 'circle',
            data: [
              {
                value: _array,
                name: '数据分析',
                lineStyle: {
                  normal: {
                    color: '#61C9FC73',
                    width: 0
                  }
                },
                areaStyle: {
                  normal: {
                    color: '#61C9FC73'
                  }
                }
              }
            ],
            symbolSize: 6,
            itemStyle: {
              normal: {
                color: '#4F97FEFF'
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
body {
  /* color: #7bc16b; */
}
</style>
