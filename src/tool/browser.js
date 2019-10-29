export const getOSAndBrowser = () => {
  let h = navigator.platform
  let e = navigator.userAgent
  let g = []
  let f = {os: 'Other', browser: 'Other'}
  if (h.indexOf('Win') > -1) {
    if (e.indexOf('Windows NT 5.0') > -1) {
      f.os = 'Windows 2000'
    } else {
      if (e.indexOf('Windows NT 5.1') > -1) {
        f.os = 'Windows XP'
      } else {
        if (e.indexOf('Windows NT 5.2') > -1) {
          f.os = 'Windows 2003'
        } else {
          if (e.indexOf('Windows NT 6.0') > -1) {
            f.os = 'Windows Vista'
          } else {
            if (e.indexOf('Windows NT 6.1') > -1 || e.indexOf('Windows 7') > -1) {
              f.os = 'Windows 7'
            } else {
              if (e.indexOf('Windows 8') > -1) {
                f.os = 'Windows 8'
              } else {
                if (e.indexOf('Windows NT 10.0') > -1) {
                  f.os = 'Windows 10'
                }
              }
            }
          }
        }
      }
    }
  } else {
    if (h.indexOf('Mac') > -1) {
      f.os = 'Mac'
    } else {
      if (h.indexOf('X11') > -1) {
        f.os = 'Unix'
      } else {
        if (h.indexOf('Linux') > -1) {
          f.os = 'Linux'
        }
      }
    }
  }
  if (/[Ff]irefox(\/\d+\.\d+)/.test(e)) {
    g = /([Ff]irefox)\/(\d+\.\d+)/.exec(e)
  } else {
    if (/MSIE \d+\.\d+/.test(e)) {
      g = /MS(IE) (\d+\.\d+)/.exec(e)
    } else {
      if (/[Cc]hrome\/\d+/.test(e)) {
        g = /([Cc]hrome)\/(\d+)/.exec(e)
      } else {
        if (/[Ss]afari\/\d+/.test(e)) {
          g = /([Ss]afari)\/(\d+)/.exec(e)
        } else {
          if (/[Oo]pera.+[Vv]ersion\/\d+\.\d+/.test(e)) {
            g = /([Oo]pera).+[Vv]ersion\/(\d+)\.\d+/.exec(e)
          } else {
            if (/rv:11.0\) like Gecko/.test(e)) {
              g = ['IEEdge', 'IE', '11']
            }
          }
        }
      }
    }
  }
  if (g.length >= 3) {
    f.browser = g[1] + g[2]
  }
  if (/[Ee]dge\/\d+/.test(e)) {
    g = /([Ee]dge)\/(\d+)/.exec(e)
    f.browser = g[1] + g[2]
  }
  return f
}
