window._bd_share_main.F.module("view/image_view", function (e, t, n) {
  var r = e("base/tangram").T,
    i = e("base/class").Class,
    s = e("conf/const"),
    o = e("view/view_base");
  t.View = i.create(function (e) {
    function l() {
      var t = e.tag || "";
      r("img").each(function (e, n) {
        if (!t || r(n).attr(s.CONFIG_TAG_ATTR) == t) {
          if (r(n).attr("data-bd-imgshare-binded") == 1) return;
          r(n).on("mouseenter", c).on("mouseleave", h), r(n).attr("data-bd-imgshare-binded", 1)
        }
      })
    }

    function c(e) {
      var t = e.target;
      p(t) && (f.element = t, f.start())
    }

    function h() {
      f.abort()
    }

    function p(t) {
      var n = !0;
      if (e.bdMinHeight && e.bdMinHeight > t.offsetHeight) n = !1;
      else if (e.bdMinWidth && e.bdMinWidth > t.offsetWidth) n = !1;
      else if (t.offsetWidth < 100 || t.offsetHeight < 100) n = !1;
      return n
    }

    function d(e) {
      e && w(function () {
        g(e), i.show(), o = !1, u = e
      })
    }

    function v() {
      o || i.hide()
    }

    function m() {
      return i.find(".bdimgshare-icon")
    }

    function g(t) {
      if (e.viewType == "list") {
        var n = {
            16: {
              lbl: 53,
              pright: 8,
              item: 18
            },
            24: {
              lbl: 57,
              pright: 8,
              item: 28
            },
            32: {
              lbl: 61,
              pright: 8,
              item: 38
            }
          },
          s = n[e.viewSize],
          o = Math.floor((t.offsetWidth - s.lbl - s.pright - 10) / s.item),
          u = m();
        for (var a = 0, f = u.length - 1; a < f; a++) a < o - 1 ? r(u[a]).show() : r(u[a]).hide()
      }
      var l = {
          width: i.offsetWidth,
          height: i.offsetHeight
        },
        c = {
          width: t.offsetWidth,
          height: t.offsetHeight
        },
        h = y(r(t).offset(), c, l),
        p = {
          position: "absolute",
          top: h.top + "px",
          left: h.left + "px"
        };
      e.viewType == "list" && (p.width = c.width + "px"), i.css(p)
    }

    function y(t, n, r) {
      return e.viewType == "list" ? {
        top: t.top + (e.viewPos == "bottom" ? n.height - r.height : 0),
        left: t.left
      } : e.viewType == "collection" ? {
        top: t.top + (e.viewPos.toLowerCase().indexOf("bottom") > -1 ? n.height - r.height - 5 : 5),
        left: t.left + (e.viewPos.toLowerCase().indexOf("left") > -1 ? 5 : n.width - r.width - 5)
      } : {
        top: t.top + (e.viewPos == "bottom" ? n.height - r.height : 0),
        left: t.left + (n.width - r.width)
      }
    }

    function b() {
      var s = ["<div id='#{id}' class='sr-bdimgshare sr-bdimgshare-#{type} sr-bdimgshare-#{size} sr-bdimgshare-#{color}' style='height:#{height}px;line-height:#{lineHeight}px;font-size:#{fontSize}px;width:#{width}px;display:none;'>", "<div class='bdimgshare-bg'></div>", "<div class='bdimgshare-content bdsharebuttonbox bdshare-button-style#{style}-#{size}'>", "<label class='bdimgshare-lbl'>#{text}</label>", "#{list}", "</div>", "</div>"].join(""),
        o = "<a href='#' onclick='return false;' class='bds_#{icon}' data-cmd='#{icon}' hidefocus></a>",
        u = e.viewType == "list",
        a = [];
      u && r.each(e.viewList, function (e, t) {
        a.push(r.string(o).format({
          icon: t
        }))
      }), a.push(r.string(o).format({
        icon: "more"
      }));
      var l = {
          16: "36",
          24: "42",
          32: "48"
        },
        c = {
          16: "33",
          24: "39",
          32: "45"
        },
        h = {
          16: "60",
          24: "71",
          32: "82"
        },
        p = {
          16: "12",
          24: "14",
          32: "14"
        },
        d = r.string(s).format({
          id: n,
          text: e.viewText || (u ? "\u56fe\u7247\u5206\u4eab" : "\u5206\u4eab"),
          type: e.viewType,
          style: e.viewStyle,
          size: e.viewSize,
          color: e.viewColor,
          width: u ? "auto" : h[e.viewSize],
          height: (u ? l : c)[e.viewSize],
          lineHeight: (u ? l : c)[e.viewSize] - 10,
          fontSize: p[e.viewSize],
          list: a.join("")
        });
      r("body").insertHTML("beforeEnd", d), t._entities = i = r("#" + n), i.on("mouseleave", function () {
        f.abort()
      }).on("mouseenter", function () {
        f.clearAbort()
      })
    }

    function w(t) {
      if (e.bdCustomStyle) {
        var n = document.createElement("link");
        n.href = e.bdCustomStyle, n.rel = "styleSheet", n.type = "text/css", n.onLoad = function () {
          t && t()
        }, document.getElementsByTagName("head")[0].appendChild(n)
      } else window._bd_share_main.F.use(["imgshare.css", "share_style0_" + e.viewSize + ".css"], function () {
        t && t()
      })
    }
    var t = this,
      n = "bdimgshare_" + (new Date).getTime(),
      i = null,
      o = !1,
      u = null,
      a = function (e) {
        function i() {
          r && (r = clearTimeout(r)), n || (n = setTimeout(function () {
            e.startFn && e.startFn(), n = !1
          }, e.time))
        }

        function s() {
          n && (n = clearTimeout(n)), r || (r = setTimeout(function () {
            e.abortFn && e.abortFn(), r = !1
          }, e.time))
        }
        var t = this,
          n = !1,
          r = !1;
        t.clearAbort = function () {
          r && (r = clearTimeout(r))
        }, t.start = i, t.abort = s
      },
      f = new a({
        time: 200,
        startFn: function () {
          d(f.element)
        },
        abortFn: function () {
          v()
        }
      });
    t.render = function (e) {
      l(), b()
    }, t._init = function () {}, t._keepBarVisible = function () {
      f.clearAbort(), o = !0
    }, t._getImageSrc = function () {
      return u.src
    }, t._distory = function () {
      i.remove();
      var t = e.tag || "";
      r("img").each(function (e, n) {
        if (!t || r(n).attr(s.CONFIG_TAG_ATTR) == t) r(n).off("mouseenter", c).off("mouseleave", h), r(n).removeAttr("data-bd-imgshare-binded")
      })
    }
  }, o.ViewBase)
});
