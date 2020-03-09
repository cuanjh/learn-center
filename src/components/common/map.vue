<template>
  <div class="baidumap" id="allmap"></div>
</template>

<script>
// import $ from 'jquery'
// import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import BMap from 'BMap'
import BMapLib from 'BMapLib'
import Bus from '../../bus'
import mapData from '../../api/mapData'
import cookie from '../../tool/cookie'

var mp = null
var lastInfoBox = null
// import BMapSymbolSHAPEPOINT from 'BMap_Symbol_SHAPE_POINT'
export default {
  props: ['data'],
  data () {
    return {
      map: null,
      markers: [],
      langList: [],
      winOpts: {
        width: 0, // 信息窗口宽度
        height: 0, // 信息窗口高度
        title: '' // 信息窗口标题
      },
      myGeo: null,
      copyrightText: '联合国教科文组织-全球说世界语言地图',
      partnerIndex: 0,
      endangerList: []
    }
  },
  created () {
    Bus.$on('mapSearch', (key) => {
      this.removeMarks()
      if (key) {
        this.mapSearch(key)
      }
    })

    // 加载官方语言数据
    this.$on('loadCourseLangs', () => {
      this.removeMarks()
      this.courseLangsMap(this.courseLangsList)
    })

    this.$on('removeMarks', () => {
      this.removeMarks()
    })

    this.$on('loadRecommendTeachers', (data) => {
      this.removeMarks()
      this.loadRecommendTeachers(data)
    })

    this.$on('loadEndangerMap', (data) => {
      console.log('濒危语种：', data)
      this.removeMarks()
      this.endangerList = data
      this.loadEndanger(this.endangerList)
    })
  },
  mounted () {
    console.log('mapData', mapData)
    this.baiduMap()
  },
  computed: {
    ...mapState({
      courseLangsList: state => state.courseLangsList,
      recommendRadioTeachers: state => state.recommendRadioTeachers
    })
  },
  methods: {
    ...mapActions([
      'getEndangeredMap'
    ]),
    // 返回
    goback () {
      this.$router.go(-1)
    },
    baiduMap () {
      let _this = this
      // 创建地图实例
      mp = new BMap.Map('allmap', {
        enableMapClick: false,
        minZoom: 3,
        maxZoom: 6
      })
      // 开启鼠标滚轮缩放
      mp.enableScrollWheelZoom(true)
      console.log('bmaplib', BMapLib)

      mp.addEventListener('load', () => {
        let userId = cookie.getCookie('user_id')
        if (userId) {
          this.loadRecommendTeachers()
        } else {
          _this.courseLangsMap(_this.courseLangsList)
        }

        // 设置版权控件位置
        /* eslint-disable */
        var cr = new BMap.CopyrightControl({
          anchor: BMAP_ANCHOR_TOP_LEFT
        })
        /* eslint-enable */

        // 添加版权控件
        mp.addControl(cr)

        // 返回地图可视区域
        var bs = mp.getBounds()
        console.log('bs', bs)
        cr.addCopyright({
          id: 1,
          content: '<span style="font-size:14px; font-weight: 500; color:#4c4c4c ;background:;margin-left: 50px; line-height:40px;">' + this.copyrightText + '</span>',
          bounds: bs
        })
      })

      this.setMapStyle()

      var myCity = new BMap.LocalCity()
      myCity.get((result) => {
        console.log(result)
        var cityName = result.name
        mp.setCenter(cityName)
        mp.centerAndZoom(cityName, 4)
        // alert('当前定位城市:' + cityName)
      })
    },
    // 设置地图样式
    setMapStyle () {
      /* eslint-disable */
      let styleJson = mapData.mapStyle
      /* eslint-enable */
      mp.setMapStyle({styleJson: styleJson})
    },
    addMarker (point, index) {
      // 创建图标对象
      var myIcon = new BMap.Icon('../../../static/images/home/back-top.png', new BMap.Size(23, 25), {
        // 指定定位位置。
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是
        // 图标中央下端的尖角位置。
        anchor: new BMap.Size(10, 25),
        // 设置图片偏移。
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。
        imageOffset: new BMap.Size(0, 0 - index * 25)
      })
      // 创建标注对象并添加到地图
      var marker = new BMap.Marker(point, { icon: myIcon })
      marker.addEventListener('click', () => {
        alert('您点击了标注')
      })
      mp.addOverlay(marker)
    },
    // 定义自定义覆盖物的构造函数
    SquareOverlay (center, length, color) {
      // this._center = center
      // his._length = length
      // this._color = color
    },
    addClickHandler (content, marker) {
      marker.addEventListener('click', (e) => {
        this.openInfo(content, e)
      })
    },
    addMouseoverHandler (content, marker) {
      marker.addEventListener('mouseover', (e) => {
        this.openInfo(content, e)
      })
    },
    openInfo (content, e) {
      var p = e.target
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
      // 创建信息窗口对象
      // var infoWindow = new BMap.InfoWindow(content, {
      //   offset: new BMap.Size(0, -25)
      // })
      var opt = {
        offset: new BMap.Size(-20, 22),
        boxStyle: {
          width: '176px',
          height: '98px',
          background: 'url("../../../../static/images/learnIndex/map/map-infowin-bg.svg") no-repeat center top',
          padding: '12px',
          borderRadius: '5px',
          marginLeft: '6px'
        },
        closeIconMargin: '-4px 14px 0 0',
        closeIconUrl: '../../../../static/images/learnIndex/map/map-infowin-close.svg',
        enableAutoPan: true,
        alignBottom: false
      }
      if (lastInfoBox) {
        lastInfoBox.close()
      }
      var infoBox = new BMapLib.InfoBox(mp, content, opt)
      lastInfoBox = infoBox
      infoBox.open(point)
      // 开启信息窗口
      // mp.openInfoWindow(infoWindow, point)
    },
    mapSearch (key) {
      console.log(key)
      console.log(mp)
      let _this = this
      // 课程检索
      let lanlist = this.courseLangsList.filter((item) => {
        return item.letter.toUpperCase() === key.toUpperCase() || item.pinyin.indexOf(key) > -1 || item.name.indexOf(key) > -1 || item.lan_code.toUpperCase() === key.toUpperCase()
      })
      if (lanlist.length > 0) {
        _this.courseLangsMap(lanlist)
      }

      // 濒危语言检索
      _this.getEndangeredMap({keyword: key}).then(res => {
        if (res.success) {
          _this.loadEndanger(res.data)
        }
      })
    },
    // 官方语言地图
    courseLangsMap (lanList) {
      console.log('courseLangsList', lanList)
      mapData.courseLangMap.forEach(lang => {
        if (!lang.lng) {
          console.log('lang', lang)
        }

        let obj = lanList.find((x) => {
          return x.code === lang.lang_code + '-Basic'
        })

        if (obj) {
          let pt = new BMap.Point(lang.lng, lang.lat)
          var myCompOverlay = new ComplexCustomOverlay(pt, obj, 'course')
          mp.addOverlay(myCompOverlay)
        } else {
          console.log(lang.lang_code)
        }
      })
    },
    // 删除覆盖物
    removeMarks () {
      mp.clearOverlays()
    },
    // 加载推荐的电台主播
    loadRecommendTeachers () {
      this.recommendRadioTeachers.forEach(item => {
        this.setRecTeacherPoint(item)
      })
    },
    setRecTeacherPoint (item) {
      let point = {}
      if (item.location.lat && item.location.long) {
        point['lng'] = parseFloat(item.location.long)
        point['lat'] = parseFloat(item.location.lat)
      } else {
        mapData.countryCaptial.forEach(countryItem => {
          if (countryItem.country === item.country_name) {
            point['lng'] = parseFloat(countryItem.lng)
            point['lat'] = parseFloat(countryItem.lat)
          }
        })
      }

      let arr = [-1, 1]
      let pt = new BMap.Point(point.lng + Math.random() * 10 * arr[parseInt(Math.random() * 2)], point.lat + Math.random() * 10 * arr[parseInt(Math.random() * 2)])

      var myCompOverlay = new ComplexCustomOverlay(pt, item, 'partner')
      mp.addOverlay(myCompOverlay)
    },
    // 缩放拖拽控件
    addNavigationAnchor () {
      /* eslint-disable */
      var opts = {
        // offset: new BMap.Size(150, 5),
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        type: BMAP_NAVIGATION_CONTROL_SMALL
      }
      /* eslint-enable */
      mp.addControl(new BMap.NavigationControl(opts))
    },
    // 加载濒危语言
    loadEndanger (list) {
      let _this = this
      list.forEach(endanger => {
        _this.setEndangerPoint(endanger)
      })
    },
    setEndangerPoint (item) {
      let point = {}
      point['lng'] = parseFloat(item.coordinate.long)
      point['lat'] = parseFloat(item.coordinate.lat)

      let pt = new BMap.Point(point.lng, point.lat)
      let endangerLevel = item.endangered_level.toLowerCase()
      let iconUrl = '../../../../static/images/learnIndex/map/map-vulnerable.svg'
      switch (endangerLevel) {
        case 'vulnerable':
          iconUrl = '../../../../static/images/learnIndex/map/map-vulnerable.svg'
          break
        case 'definitely endangered':
          iconUrl = '../../../../static/images/learnIndex/map/map-definitely-endangered.svg'
          break
        case 'severely endangered':
          iconUrl = '../../../../static/images/learnIndex/map/map-severely-endangered.svg'
          break
        case 'critically endangered':
          iconUrl = '../../../../static/images/learnIndex/map/map-critically-endangered.svg'
          break
        case 'extinct':
          iconUrl = '../../../../static/images/learnIndex/map/map-extinct.svg'
          break
      }
      var myIcon = new BMap.Icon(iconUrl, new BMap.Size(150, 150))
      let marker = new BMap.Marker(pt, {icon: myIcon, offset: new BMap.Size(65, 40)})
      mp.addOverlay(marker)
      // 添加点击事件
      let endangerStr = (item['ISO-639-3'] && item['ISO-639-3'].length > 0) ? item['ISO-639-3'].join(',') : ''
      let text = '了解详情'
      let p = ''
      if (endangerStr) {
        p = '<p style="font-size: 12px; font-weight: 500; color: #2A9FE4; margin-left: 6px; margin-top: 12px; text-decoration: underline;">' +
              '<a href="./book-details/' + endangerStr + '">' +
                text +
              '</a>' +
            '</p>'
      }
      var sContent =
        '<div>' +
          '<p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' +
            '<span style="font-size:18px; font-weight:bold; color:#333333; line-height: 20px; margin-left: 5px;">' +
              item.en_name +
            '</span>' +
          '</p>' +
            p +
        '</div>'
      // sContent = ''
      this.addClickHandler(sContent, marker)
    }
  }
}

function ComplexCustomOverlay (point, data, type) {
  this._point = point
  this._data = data
  this._type = type
}

ComplexCustomOverlay.prototype = new BMap.Overlay()

ComplexCustomOverlay.prototype.initialize = function (map) {
  var that = this
  this._map = map
  var div = this._div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat)
  div.style.whiteSpace = 'nowrap'
  div.style.MozUserSelect = 'none'
  // div.style.animation = 'myfirst 2s infinite'

  var divPhoto = this._divPhoto = document.createElement('div')
  if (this._type === 'partner') {
    divPhoto.style.background = 'url(' + this._data.photo + ') no-repeat'
    divPhoto.style.height = '22px'
    divPhoto.style.width = '22px'
    divPhoto.style.borderRadius = '50%'
    divPhoto.style.top = '3px'
    divPhoto.style.left = '4px'
  } else if (this._type === 'course') {
    divPhoto.style.background = 'url(' + this._data.flag + ') no-repeat'
    divPhoto.style.height = '22px'
    divPhoto.style.width = '22px'
    divPhoto.style.borderRadius = '2px'
    divPhoto.style.top = '3px'
    divPhoto.style.left = '3px'
  }
  divPhoto.style.position = 'absolute'
  divPhoto.style.backgroundSize = 'cover'
  divPhoto.style.zIndex = 2
  // var span = this._span = document.createElement('span')
  div.appendChild(divPhoto)
  // span.appendChild(document.createTextNode(this._text))
  // var that = this

  var arrow = this._arrow = document.createElement('div')

  if (this._type === 'partner') {
    arrow.style.background = 'url(../../../static/images/learnIndex/map/map-partner.svg) no-repeat'
    arrow.style.width = '30px'
    arrow.style.height = '43px'
  } else if (this._type === 'course') {
    arrow.style.background = 'url(../../../static/images/learnIndex/map/map-course.svg) no-repeat'
    arrow.style.width = '28px'
    arrow.style.height = '35px'
  }

  arrow.style.position = 'absolute'
  arrow.style.backgroundSize = 'cover'
  arrow.style.top = '0px'
  arrow.style.left = '0px'
  arrow.style.overflow = 'hidden'
  arrow.style.zIndex = 1
  div.appendChild(arrow)

  div.onmouseover = function () {
    div.style.transform = 'translateY(-5px)'
    // 创建信息窗口对象
    var sContent = ''
    var text = ''
    if (that._type === 'partner') {
      text = '个人主页'
      sContent =
        '<div>' +
          '<p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' +
            '<img style="float:left;margin-left:2px; border: 2px solid #E5E9DB; border-radius: 50%;" src="' + that._data.photo + '" width="32" height="32" title=""/>' +
            '<span style="font-size:14px; font-weight:600; color:#333333; line-height: 32px; margin-left: 5px;">' +
              that._data.author_name +
            '</span>' +
          '</p>' +
          '<p style="font-size: 12px; font-weight: 500; color: #2A9FE4; margin-left: 6px; margin-top: 4px; text-decoration: underline;">' +
            '<a href="./discovery/author-detail/' + that._data.user_id + '" target="_blank">' +
              text +
            '</a>' +
          '</p>' +
        '</div>'
    } else if (that._type === 'course') {
      window.zhuge.track('学习系统-map-点击课程分布', {
        name: that._data.name
      })
      text = '了解详情'
      sContent =
        '<div>' +
          '<p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">' +
            '<img style="width: 32px; height:32px; float:left;margin:0 4px; border-radius:6px; border: 2px solid rgba(229,233,219,1);" src="' + that._data.flag + '" width="50" height="50" title=""/>' +
            '<span style="font-size:14px; font-weight:600; color:#333333; line-height: 32px; margin-left: 5px;">' +
              that._data.name +
            '</span>' +
          '</p>' +
          '<p style="font-size: 12px; font-weight: 500; color: #2A9FE4; margin-left: 6px; margin-top: 4px; text-decoration: underline;">' +
            '<a href="./book-details/' + that._data.code + '">' +
              text +
            '</a>' +
          '</p>' +
        '</div>'
    }
    // var infoWindow = new BMap.InfoWindow(sContent, {
    //   offset: new BMap.Size(15, -25)
    // })
    // // 开启信息窗口
    // mp.openInfoWindow(infoWindow, that._point)

    var opt = {
      offset: new BMap.Size(0, 22),
      boxStyle: {
        width: '176px',
        height: '98px',
        background: 'url("../../../../static/images/learnIndex/map/map-infowin-bg.svg") no-repeat center top',
        padding: '12px',
        borderRadius: '5px',
        marginLeft: '24px'
      },
      closeIconMargin: '-4px 14px 0 0',
      closeIconUrl: '../../../../static/images/learnIndex/map/map-infowin-close.svg',
      enableAutoPan: true,
      alignBottom: false
    }
    if (lastInfoBox) {
      lastInfoBox.close()
    }
    var infoBox = new BMapLib.InfoBox(mp, sContent, opt)
    lastInfoBox = infoBox
    infoBox.open(that._point)
  }

  div.onmouseout = function () {
    div.style.transform = 'translateY(0)'
    arrow.style.backgroundPosition = '0px 0px'
  }

  mp.getPanes().labelPane.appendChild(div)

  return div
}
ComplexCustomOverlay.prototype.draw = function () {
  var map = this._map
  var pixel = map.pointToOverlayPixel(this._point)
  this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + 'px'
  this._div.style.top = pixel.y - 30 + 'px'
}
ComplexCustomOverlay.prototype.getPosition = function () {
  return this._point
}
ComplexCustomOverlay.prototype.getLabel = function () {
}
ComplexCustomOverlay.prototype.getMap = function () {
  return mp
}
ComplexCustomOverlay.prototype.setLabel = function () {
}
</script>

<style>
/* .baidumap {
} */

/*.BMap_cpyCtrl {
  display: none;
}*/
  .anchorBL{
    display: none;
  }

  /* @keyframes myfirst {
    0% {
      transform: translate(0px, 0px);
    }
    50% {
      transform: translate(0px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  } */
</style>
