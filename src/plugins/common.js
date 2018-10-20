/* eslint-disable */
var Then = require("thenjs");
var $ = require("jquery");
var _ = require("lodash");
// var EventEmitter = require("EventEmitter");
var obtainId = 0;

// requestAnimationFrame 兼容处理

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

/*********************
 ** 继承
 *********************/

var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }

    function ctor() {
        this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};


/*********************
 ** 资源hack自动加尾缀
 *********************/

function webpHack(res) {
    return Then(function(cb) {
        check(cb)
    }).then(function(cb, support) {
        var data;

        res = _.map(res, function(val) {
            if (/mp3/.test(val.url)) {
                return val;
            } else {
                if (!support) {
                    val.url += "?imageMogr2/thumbnail/460x258!/format/jpg/q/80";
                } else {
                    val.url += "?imageMogr2/thumbnail/460x258!/q/80";
                }
                return val
            }
        });
        cb(null, res)
    })
}

/*********************
 ** 目录的自动加后缀
 *********************/
// function webpObject(res) {
//     return Then(function(cb) {
//         check(cb)
//     }).then(function(cb, support) {
//         var data;
//         if (!support) {
//             _.map(res, function(level, lkey) {
//                 _.map(level, function(unit, ukey) {
//                     res[lkey][ukey]["img"] = _.map(unit.img, function(img) {
//                         return img + "?imageView2/0/format/jpg/q/80"
//                     })
//                 })
//             })
//         }
//         cb(null, res)
//     })
// }

/*********************
 ** 检测是否支持webP
 *********************/

function check(cb) {
    var image = new Image();
    image.onerror = function() {
        cb(null, false);
    };
    image.onload = function() {
        cb(null, true);
    };
    image.src = 'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==';
}

/**洗牌*/
function randomItems(itms) {
    var arr = itms.concat();
    var len = itms.length;
    var index;
    var itm;
    if (len < 2) {
        return arr;
    } else if (len == 2) {
        index = Math.random() > 0.5 ? 1 : 0;
        itm = arr[0];
        arr[0] = arr[index];
        arr[index] = itm;

    } else {
        for (var i = 0; i < len - 1; i++) {
            var j = i + 1;
            index = Math.floor(Math.random() * (len - j)) + 1;
            itm = arr[i];
            arr[i] = arr[i + index];
            arr[i + index] = itm;
        }
    }
    return arr;
}

function fullKey() {
    var preKey = ["Level", "Unit", "Chapter", "slide"];
    var keyArray;
    if (_.isArray(arguments[0])) {
        keyArray = arguments[0]
    } else {
        keyArray = arguments;
    }
    var resArray = _.fill(Array(keyArray.length), "");
    _.each(keyArray, function(val, idx) {
        resArray[idx] = preKey[idx] + val
    });
    return resArray;
}


function keyNumber() {
    var keyArray;
    var result = {};
    if (_.isArray(arguments[0])) {
        keyArray = arguments[0]
    } else {
        keyArray = arguments;
    }
    _.each(keyArray, function(val) {
        var reg = val.match(/([a-zA-Z]+)(\d+)/);
        reg && (result[reg[1]] = +reg[2]);
    })
    return result;
}

function httpRequest(url, cb, root) {
    $.getJSON(url, function(data) {
        if (root) {
            root.$broadcast("addProcess", url);
        }
        cb(null, data)
    })
}

function jsonpRequest(url, data, cb) {
    $.ajax({
        url: url,
        dataType: 'jsonp',
        jsonp: 'callback',
        data: data,
        success: function(result) {
            cb(null,result)
        }
    })

}

function size(list, type) {
    console.log('size')
    var BOX_MAX_WIDTH = 500;
    var PADDING_WIDTH = 200;
    var HEADER_HEIGHT = 50;
    var num = _.size(_.flattenDeep(list));
    var absolute_height;
    var $box = $(".autospeak,.repeatspeak,.writewords,.fillgap,.makesentence,.image-box,.imgtosentence");
    var $single_box = $box.not(".image-box");
    var typeString = type.join("");
    var line = 1;
    var layout = 2;
    if (num > 8) {
        line = 3;
    } else if (num > 3) {
        line = 2;
    }
    if ([3, 5, 6, 9].indexOf(num) != -1) {
        $box.addClass("layout-3")
        layout = 3;
    }
    if (num == 7 || num == 8) {
        $box.addClass("layout-4")
        layout = 4;
    }
    var window_width = $(window).width();
    var window_height = $(window).height();
    var text_height = $(".sentence-box").height() + 30;
    var stage = window_height - text_height - 10 - HEADER_HEIGHT;
    var stage_width;
    switch (layout) {
        case 2:
            stage_width = (stage / line - 60) / (0.05 + 9 / 16 * 0.45)
            break;
        case 3:
            stage_width = (stage / line - 60) / (0.033 + 9 / 16 * 0.3)
            break;
        case 4:
            stage_width = (stage / line - 60) / (0.02 + 9 / 16 * 0.23)
            break;
    }

    stage_width = stage_width > window_width ? window_width - 200 : stage_width;
    stage_width = stage_width > BOX_MAX_WIDTH * layout ? BOX_MAX_WIDTH * layout : stage_width;

    // 分析是否是杂糅类型

    var moreHeight = 0;

    if (/auto.*sentencetoimg/i.test(typeString)) {
        moreHeight = $(".autospeak").height();
    }

    $(".stage").css({
        height: stage,
        width: stage_width
    })


    // 处理单行
    var $dom = $(".sentencetoimg,.imgtosentencew,.speaktoimg");
    var translateY = 0;
    if (line == 1) {
        var children;
        if (num == 3) {
            children = stage_width * (0.033 + 9 / 16 * 0.3) + 60;
        } else {
            children = stage_width * (0.05 + 9 / 16 * 0.45) + 60;
        }
        translateY = (stage - children) / 2 + "px";
        if (!$dom.length) {
            $(".stage").children().css({
                transform: "translateY(" + translateY + ")"
            })
        } else {
            $dom.css({
                transform: "translateY(" + translateY + ")"
            })
        }
        absolute_height = children;
    } else {
        var box_height = 0;
        if (layout == 3) {
            box_height = stage_width * (0.033 + 9 / 16 * 0.3) + 60;
        }
        if (layout == 4) {
            box_height = stage_width * (0.02 + 9 / 16 * 0.23) + 60;
        }
        if (layout == 2) {
            box_height = stage_width * (0.05 + 9 / 16 * 0.45) + 60;
        }
        absolute_height = box_height * line;

        // 如果有选图的则不去更改组建内部box

        translateY = (stage - box_height * line) / 2 + "px";

        $dom.css({
            transform: "translate(0," + translateY + ")"
        });

        $single_box.css({
            position: "relative",
            top: translateY
        })
    }


    //处理5 7 居中

    if ($dom.length == 0 && (num == 5 || num == 7)) {
        var width = $(".stage").children().width() / 2;
        var transform = "translate(" + width + "px," + translateY + ")";
        var Children = $(".stage").children().not(".fade-leave");
        if (num == 5) {
            Children = $(_.takeRight(Children, 2))
        } else {
            Children = $(_.takeRight(Children, 3))
        }
        Children.css({
            "transform": transform
        })
    }


    $dom.css({
        height: absolute_height - moreHeight
    }).addClass("translation");

    $(".sentence-box").css({
        transform: "translate(0," + parseInt(translateY) / 2 + "px)"
    });

    if ($(".autospeak").not(".fade-leave").length && $dom.length) {
        $dom.css({
            transform: "translate(0," + translateY + ")"
        })
        $(".clear").remove();
        $dom.before("<div class=clear/>");
        $dom.removeClass("translation");
    }
}

function reset() {
    $(".autospeak,.repeatspeak,.writewords,.fillgap,.makesentence,.image-box,.imgtosentence")

    .removeClass("layout-3 layout-4")

    .css({
        transform: "initial"
    });


    var $dom = $(".sentencetoimg,.imgtosentencew,.speaktoimg");
    $(".stage").css({
        height: "auto",
        width: "auto",
    }).children().css({
        transform: "initial",
        top: 0
    })

    $dom.css({
        height: "auto"
    }).removeClass("translation");
    // $(window).off("resize");
    $(".sentence-box").css({
        transform: "translate(0,0)",
    });
    $(".clear").remove();
}

function getPos(num) {
    switch (num) {
        case 2:
            return [
                [0, 0],
                [0, "50%"]
            ]
        case 3:
            return [
                [0, 0],
                [0, "33.3333%"],
                [0, "66.6666%"]
            ]
        case 4:
            return [
                [0, 0],
                [0, "50%"],
                ["50%", 0],
                ["50%", "50%"]
            ];
        case 5:
            return [
                [0, 0],
                [0, "33.333%"],
                [0, "66.6666%"],
                ["50%", "16.665%"],
                ["50%", "49.995%"]
            ]
        case 6:
            return [
                [0, 0],
                [0, "33.333%"],
                [0, "66.6666%"],
                ["50%", 0],
                ["50%", "33.333%"],
                ["50%", "66.6666%"]
            ]
        case 8:
            return [
                [0, 0],
                [0, "25%"],
                [0, "50%"],
                [0, "75%"],
                ["50%", 0],
                ["50%", "25%"],
                ["50%", "50%"],
                ["50%", "75%"]
            ]
    }
}


/*
 * 发送统计
 * @params query 查询参数
 * */
function sendStatistics(obj) {
    /* var img = document.createElement("img");
     var query = [];
     for (var key in obj) {
         query.push(key + "=" + obj[key]);
     }
     img.src = Config.URL.statistics + "/log.gif?" + query.join("&") + "&platform=web&t=" + new Date().getTime();
     $(img).on("load", function () {
         $(img).remove();
         img = null;
     });
     $(img).on("error", function () {
         $(img).remove();
         img = null;
     });
     */
}

function getOSAndBrowser() {
    var os = navigator.platform,
        userAgent = navigator.userAgent,
        tempArray = [],
        client = { /*返回的客户端信息*/
            os: "Other",
            /*操作系统*/
            browser: "Other"
        };
    if (os.indexOf("Win") > -1) {
        if (userAgent.indexOf("Windows NT 5.0") > -1) {
            client.os = "Windows 2000";
        } else if (userAgent.indexOf("Windows NT 5.1") > -1) {
            client.os = "Windows XP";
        } else if (userAgent.indexOf("Windows NT 5.2") > -1) {
            client.os = "Windows 2003";
        } else if (userAgent.indexOf("Windows NT 6.0") > -1) {
            client.os = "Windows Vista";
        } else if (userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1) {
            client.os = "Windows 7";
        } else if (userAgent.indexOf("Windows 8") > -1) {
            client.os = "Windows 8";
        } else if (userAgent.indexOf("Windows NT 10.0") > -1) {
            client.os = "Windows 10";
        }
    } else if (os.indexOf("Mac") > -1) {
        client.os = "Mac";
    } else if (os.indexOf("X11") > -1) {
        client.os = "Unix";
    } else if (os.indexOf("Linux") > -1) {
        client.os = "Linux";
    }

    if (/[Ff]irefox(\/\d+\.\d+)/.test(userAgent)) {
        tempArray = /([Ff]irefox)\/(\d+\.\d+)/.exec(userAgent);
    } else if (/MSIE \d+\.\d+/.test(userAgent)) {
        tempArray = /MS(IE) (\d+\.\d+)/.exec(userAgent);
    } else if (/OPR\/\d+/.test(userAgent)) {
        tempArray = /(OPR)\/(\d+)/.exec(userAgent);
    } else if (/[Cc]hrome\/\d+/.test(userAgent)) {
        tempArray = /([Cc]hrome)\/(\d+)/.exec(userAgent);
    } else if (/[Vv]ersion\/\d+\.\d+\.\d+(\.\d)* *[Ss]afari/.test(userAgent)) {
        tempArray = /[Vv]ersion\/(\d+\.\d+\.\d+)(\.\d)* *([Ss]afari)/.exec(userAgent);
    } else if (/[Oo]pera.+[Vv]ersion\/\d+\.\d+/.test(userAgent)) {
        tempArray = /([Oo]pera).+[Vv]ersion\/(\d+)\.\d+/.exec(userAgent);
    } else if (/rv:11.0\) like Gecko/.test(userAgent)) {
        tempArray = ["IEEdge", "IE", "11"];
    }
    if (tempArray.length >= 3) {
        client.browser = tempArray[1] + tempArray[2];
    }
    return client;
}

function microphoneTest() {
    var micPhone = {
        type: 0,
        /* 浏览器是否支持录音 0：不支持， 1：支持 */
        msg: "浏览器不支持录音，推荐使用谷歌或火狐浏览器"
    };
    if (navigator.getUserMedia) {
        micPhone.type = 1;
        navigator.getUserMedia({
                audio: true //只启用音频
            },
            function(stream) {},
            function(error) {
                switch (error.code || error.name) {
                    case 'PERMISSION_DENIED':
                    case 'PermissionDeniedError':
                        micPhone.msg = "抱歉，未获取到麦克风设备。";
                        break;
                    case 'NOT_SUPPORTED_ERROR':
                    case 'NotSupportedError':
                        micPhone.msg = "浏览器不支持硬件设备。";
                        break;
                    case 'MANDATORY_UNSATISFIED_ERROR':
                    case 'MandatoryUnsatisfiedError':
                        micPhone.msg = "无法发现指定的硬件设备。";
                        break;
                    default:
                        micPhone.msg = '无法打开麦克风。异常信息:' + (error.code || error.name);
                }
            });
    }
    return micPhone;
}

function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024, // or 1024
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
/*
 * 创建唯一ID 为当前时间戳＋4位随机数＋递增数
 * */
function createId() {
    return parseInt(new Date().getTime() / 1000, 10) + selectFrom(0, 1000) + (++obtainId);
}

/*
 * 获取随机数
 * @params
 * lowerValue 范围最小值
 * uperValue 范围最大值
 * */
function selectFrom(lowerValue, uperValue) {
    var choices = uperValue - lowerValue + 1;
    return Math.floor(Math.random() * choices + lowerValue);
}

function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {

    }
}

function getLocalStorage(key) {
    var item = null;
    try {
        item = localStorage.getItem(key);
    } catch (e) {

    }
    return item;
}


export default {
    webpHack: webpHack,
    // webpObject: webpObject,
    randomItems: randomItems,
    fullKey: fullKey,
    keyNumber: keyNumber,
    httpRequest: httpRequest,
    jsonpRequest: jsonpRequest,
    reset: reset,
    resize: size,
    getPos: getPos,
    createId: createId,
    getOSAndBrowser: getOSAndBrowser,
    sendStatistics: sendStatistics,
    microphoneTest: microphoneTest,
    bytesToSize: bytesToSize,
    extends: __extends,
    // eventEmitter: new EventEmitter(),
    setLocalStorage: setLocalStorage,
    getLocalStorage: getLocalStorage
}
