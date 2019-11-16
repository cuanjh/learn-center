import $ from 'jquery'
import _ from 'lodash'

function resize (list) {
  // 导航栏高度
  const NAV_BAR_HEIGHT = 62
  // 选择类每个form最大宽度
  const BOX_MAX_WIDTH = 500

  let windowWidth = $(window).width()
  let windowHeight = $(window).height()

  // form的数量
  let num = _.size(_.flattenDeep(list))
  // 选择类行数
  var line = 1
  // 选择类每行的form数
  var layout = 2
  if (num > 8) {
    line = 3
  } else if (num > 3) {
    line = 2
  }
  if ([3, 5, 6, 9].indexOf(num) !== -1) {
    layout = 3
  }
  if (num === 7 || num === 8) {
    layout = 4
  }

  var stage = windowHeight - NAV_BAR_HEIGHT - 40
  var stageWidth
  switch (layout) {
    case 2:
      stageWidth = (stage / line - 60) / (0.05 + 9 / 16 * 0.45)
      break
    case 3:
      stageWidth = (stage / line - 60) / (0.033 + 9 / 16 * 0.3)
      break
    case 4:
      stageWidth = (stage / line - 60) / (0.02 + 9 / 16 * 0.23)
      break
  }
  let stageHeight = $(window).height() - NAV_BAR_HEIGHT
  let choiceListHeight = $(window).height() - NAV_BAR_HEIGHT - 116
  let choiceListWidth = (windowWidth - 200) > BOX_MAX_WIDTH * layout ? BOX_MAX_WIDTH * layout : windowWidth - 200

  stageWidth = stageWidth > windowWidth ? windowWidth - 200 : stageWidth
  stageWidth = stageWidth > BOX_MAX_WIDTH * layout ? BOX_MAX_WIDTH * layout : stageWidth
  console.log('stageWidth', stageWidth)
  let choiceItemWidth = choiceListWidth / layout
  let choiceItemHeight = choiceItemWidth * 246 / 429
  choiceItemHeight = choiceListHeight > choiceItemHeight * line ? choiceItemHeight : choiceListHeight / line
  choiceItemWidth = choiceItemHeight * 429 / 246
  $('.choice-item').css({
    width: choiceItemWidth,
    height: choiceItemHeight
  })

  choiceListWidth = choiceItemWidth * layout > choiceListWidth ? choiceListHeight : choiceItemWidth * layout
  choiceListHeight = choiceItemHeight * line
  $('.choice-list').css({
    width: choiceListWidth,
    height: choiceListHeight
  })

  let boxHeight = stageWidth * (0.05 + 246 / 429 * 0.45) + 60
  console.log('boxHeight', boxHeight)

  stageWidth = $(window).width() - 160
  $('.stage').css({
    height: stageHeight,
    width: stageWidth
  })
}

// 选择类定位每个form相对位置
function getPos (num) {
  switch (num) {
    case 2:
      return [
        ['25%', 0],
        ['25%', '50%']
      ]
    case 3:
      return [
        [0, 0],
        [0, '33.3333%'],
        [0, '66.6666%']
      ]
    case 4:
      return [
        [0, 0],
        [0, '50%'],
        ['50%', 0],
        ['50%', '50%']
      ]
    case 5:
      return [
        [0, 0],
        [0, '33.333%'],
        [0, '66.6666%'],
        ['50%', '16.665%'],
        ['50%', '49.995%']
      ]
    case 6:
      return [
        [0, 0],
        [0, '33.333%'],
        [0, '66.6666%'],
        ['50%', 0],
        ['50%', '33.333%'],
        ['50%', '66.6666%']
      ]
    case 8:
      return [
        [0, 0],
        [0, '25%'],
        [0, '50%'],
        [0, '75%'],
        ['50%', 0],
        ['50%', '25%'],
        ['50%', '50%'],
        ['50%', '75%']
      ]
  }
}

// 获取一段数字区间的随机数，比如[-10, 10]
function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default {
  resize,
  getPos,
  getRndInteger
}
