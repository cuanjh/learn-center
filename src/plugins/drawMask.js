/* eslint-disable */
import $ from "jquery";

let __instance = (function () {
  let instance;
  return (newInstance) => {
    if (newInstance) instance = newInstance;
    return instance;
  }
}());

class DrawMask {
  constructor() {
    if (__instance()) return __instance();

    this.init();
    __instance(this);
  }

  init() {
    this.height = $(window).height() - 50;
    this.width = $(window).width();
    this.canvas = $(`<canvas id="help-mask"></canvas>`);
    this.ctx = this.canvas[0].getContext("2d");
    this.tip = null;

    this.canvas.css({
      "position": "absolute",
      "top": 50,
      "left": 0,
      "z-index": 100
    }).attr("height", this.height).attr("width", this.width);

    this.canvas.hide();
    $("body").append(this.canvas);
  }

  disable() {
    this.resize();
    this.ctx.clearRect(0, 0, 10000, 10000);
    this.canvas.fadeIn();
  }

  enable() {
    this.resize();
    this.canvas.hide();
  }


  resize(fn) {
    this.height = $(window).height() - 50;
    this.width = $(window).width();
    this.canvas.attr("height", this.height).attr("width", this.width)
    if (fn) {
      fn(this);
    }
    return this;
  }
  showRect({
    left,
    top,
    width,
    height
  }) {
    this.rectPos = {
      left,
      top,
      width,
      height
    };
    this.ctx.clearRect(0, 0, 10000, 10000);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.clearRect(left, top, width, height);
    this.canvas.fadeIn();
    return this;
  }

  showGesture({
    left,
    top
  }) {
    this.tip = $(".help-tip");
    if (!this.tip.length) {
      this.tip = $(`<div class="help-tip">
                        <b></b>
                        <div class="help-hand"></div>
                    </div>`);
      $("body").append(this.tip);
    }

    this.tip.css({
      left,
      top
    }).fadeIn();
    return this;
  }

  hideMask() {
    this.canvas.css({
      cursor: "default"
    })
    this.canvas.hide();
    this.tip.hide();
    return this;
  }

  on(type, ...args) {
    this.off(type);


    switch (type) {
      case "click":
        this.canvas.on("click", ({
          offsetX,
          offsetY
        }) => {
          if (this.isInRange({
              offsetX,
              offsetY
            })) {
            args[0]();
          }
        });
        break;
      case "mousemove":
        this.canvas.on("mousemove", ({
          offsetX,
          offsetY
        }) => {
          if (this.isInRange({
              offsetX,
              offsetY
            })) {
            this.canvas.css({
              cursor: "pointer"
            })
            if (typeof args[0] === "function") {
              args[0].call(this);
            }
          } else {
            this.canvas.css({
              cursor: "default"
            });
            if (typeof args[0] === "function") {
              args[1].call(this);
            }
          }
        })
        break;
    }
    return this;
  }

  off(type) {
    this.canvas.off(type);
    return this;
  }

  isInRange({
    offsetX,
    offsetY
  }) {
    let {
      left,
      top,
      width,
      height
    } = this.rectPos;
    return left < offsetX && (left + width) > offsetX && top < offsetY && top + height > offsetY;
  }

}
export default DrawMask;
