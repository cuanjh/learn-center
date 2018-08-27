import _ from 'lodash'

// 解锁课程的level实现方式
function unlockArr (unLockChapters) {
  var arr = []
  if (unLockChapters) {
    Object.keys(unLockChapters).forEach((key) => {
      arr.push(key)
    })
  }
  return arr
}

// 学习进度的实现调用三个方法
function progressAgain (obj) {
  var num = 0
  if (obj['A0']) {
    num += 50
    num += progressAgainOne(obj)
    num += progressAgainTwo(obj)
    num += progressAgainThree(obj)
  }
  return num
}
function progressAgainOne (obj) {
  var num = 0
  var arrTemp = ['A1', 'A2']
  for (var i = 0; i < arrTemp.length; i++) {
    if (obj[arrTemp[i]]) {
      num += 8
    }
  }
  return num
}
function progressAgainTwo (obj) {
  var num = 0
  var arrTemp = ['A3', 'A4', 'A5', 'A6']
  for (var i = 0; i < arrTemp.length; i++) {
    if (obj[arrTemp[i]]) {
      num += 6
    }
  }
  return num
}
function progressAgainThree (obj) {
  var num = 0
  if (obj['A8']) {
    num += 10
  }
  return num
}

// 判断课程是否购买的实现
function chapterPurchased (unLockChapterDetail) {
  if (unLockChapterDetail['Has_purchased']) {
    return true
  } else {
    return false
  }
}

// 实现解锁课程的点亮与实现和整体获取数据结构以实现转换和每个level实现的转化
export var getCourseStructure = (themes, unLockChapters) => {
  var structure = []
  _.map(themes, (theme) => {
    var unitCode = theme.code
    var splitLevel = 'Level'
    var splitUnit = 'Unit'
    var splitArr = unitCode.split('-')
    // var level = ''
    var unit = ''
    var chapters = []
    var arr = unlockArr(unLockChapters)
    for (var i = 0; i < splitArr.length; i++) {
      if (splitArr[i].match(splitLevel)) {
        // level = splitArr[i]
      }
      if (splitArr[i].match(splitUnit)) {
        unit = splitArr[i]
      }
    }
    _.map(theme.chapters, (chapter) => {
      if (chapters.length === 0 && unit === 'Unit1') {
        chapter.judge = true
        chapter.progress = 0
      }
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === chapter.code) {
          chapter.judge = true
          chapter.progressTest = progressAgain(unLockChapters[arr[i]])
          chapter.progress = progressAgain(unLockChapters[arr[i]])
          chapter.purchased = chapterPurchased(unLockChapters[arr[i]])
        }
      }
      var chapterArr = chapter.code.split('-')
      chapter.num = (parseInt(chapterArr[3][4]) - 1) * 6 + parseInt(chapterArr[4][7])
      // chapters.push(chapter)
      structure.push(chapter)
    })
  })
  return structure
}
