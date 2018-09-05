/* eslint-disable */
// 获取解锁课程总数
// import _ from 'loadsh'
// import * as expenseTest from './expense.js'
// var expenseTwo = expenseTest['expenseTest']
export var chapteNum = function (obj) {
  var tempArr = {
    'unlocklast': [],
    'num': 0,
    'level': '',
    'describle': '',
    'corrate': 0,
    'levelRate': '初级A1',
    'compate': '',
    'course': '课程'
  }
  Object.keys(obj).forEach(function (key) {
    tempArr['unlocklast'].push(key)
  })
  tempArr['num'] = unlockChapter(tempArr)
  var code = tempArr['unlocklast'][tempArr['unlocklast'].length - 1]
  var tempArrTwo = code.split('-');
  tempArr['corrate'] = (levelCorrate(obj, tempArrTwo[2]) * 100).toFixed(2) + '%'
  tempArr['complate'] = (levelComplate(obj, tempArrTwo[2]) / 24).toFixed(2) + '%'
  tempArr['level'] = tempArrTwo[2];
  tempArr['course'] += (parseInt(tempArrTwo[3][4]) - 1) * 6 + parseInt(tempArrTwo[4][7])
  tempArr['levelRate'] = levelDescrible(tempArrTwo[2])
  // tempArr['describle'] = unlockDescrible(tempArrTwo)
  // tempArr['describle'] = unlockDescrible(tempArr)
  return tempArr
}
// 获取解锁课程的总数
function unlockChapter(arr) {
  return arr['unlocklast'].length
}
// 获取某个课程下最后一次学习的内容的章节
// function unlockDescrible(tempArr) {
// 	var str = '';
// 	str += levelDescrible(tempArr[2])
// 	str += unitDescrible(tempArr[3])
// 	str += chapterDescrible(tempArr[4])
// 	return str
// }
// 某个具体level的描述
function levelDescrible(level) {
  var str = ''
  var obj = {
    'Level1': '初级A1',
    'Level2': '初级A2',
    'Level3': '中级B1',
    'Level4': '中级B2',
    'Level5': '高级C1',
    'Level6': '高级C2'
  }
  Object.keys(obj).forEach(function (key) {
    if (key === level) {
      str = obj[key];
    }
  })
  return str
}
// 档案level正确率的实现方式
function levelCorrate(obj, level) {
  var corrate = 0;
  var num = 0;
  Object.keys(obj).forEach(function (key) {
    var code = key.split('-')[2];
    if (code === level) {
      corrate += obj[key]['Correct_rate']
      num += 1
    }
  })
  return corrate / num
}
// 档案完成率具体对应的某个level的实现
function levelComplate(obj, level) {
  var num = 0;
  Object.keys(obj).forEach(function (key) {
    var code = key.split('-')[2];
    if (code === level) {
      num += progressAgain(obj[key])
    }
  })
  return num
}

function progressAgain(obj) {
  var num = 0;
  if (obj['A0']) {
    num += 50
    num += progressAgainOne(obj)
    num += progressAgainTwo(obj)
    num += progressAgainThree(obj)
  }
  return num;
}

function progressAgainOne(obj) {
  var num = 0;
  var arrTemp = ['A1', 'A2'];
  for (var i = 0; i < arrTemp.length; i++) {
    if (obj[arrTemp[i]]) {
      num += 8
    }
  }
  return num;
}

function progressAgainTwo(obj) {
  var num = 0;
  var arrTemp = ['A3', 'A4', 'A5', 'A6'];
  for (var i = 0; i < arrTemp.length; i++) {
    if (obj[arrTemp[i]]) {
      num += 6
    }
  }
  return num;
}

function progressAgainThree(obj) {
  var num = 0;
  if (obj['A8']) {
    num += 10
  }
  return num;
}
export var expense = function (record, expense, language, describle) {
  for (var i = 0; i < record.length; i++) {
    Object.keys(expense).forEach(function (key) {
      if (record[i]['trade_type'] === key) {
        record[i]['desc'] = expense[key]
        record[i]['trade_date'] = Showtime(record[i]['trade_date'])
      }
    })
  }
  return record
}

function Showtime(tradedate) {
  var date = new Date(tradedate * 1000)
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var mm = date.getMinutes();
  // var s = date.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + '  ' + add0(h) + ":" + add0(mm)
}

function add0(m) {
  return m < 10 ? '0' + m : m
}
// 课程过滤
export var courseFilter = function (courses) {
  var tempCourseArr = [];
  _.map(courses, function (course) {
    if (course['course_type'] === 0) {
      tempCourseArr.push(course)
    }
  })
  return tempCourseArr
}
// 获取国家课程列表
export var countryList = function (countries, language) {
  var tempArr = []
  for (var i = 0; i < countries.length; i++) {
    tempArr.push(countries[i]['country_name'][language])
  }
  return tempArr
}
// 获取语言列表
export var LanguageList = function (languages, language) {
  var tempArr = []
  for (var i = 0; i < languages.length - 1; i++) {
    tempArr.push(languages[i]['name'][language])
  }
  return tempArr
}
// 表头搜索框的语言列表数据转换
export var courseAllFilter = function (courseList, language) {
  var tempArr = []
  for (var i = 0; i < courseList.length; i++) {
    var tempObj = {};
    tempObj['name'] = courseList[i]['name'][language];
    tempObj['lan_code'] = courseList[i]['lan_code']
    tempArr.push(tempObj)
  }
  return tempArr
}
