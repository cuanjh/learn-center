/* eslint-disable */
var audio = new Audio();
var endedHandler = null;
var sndLoaded = false;
var interval_sndLoaded;

audio.onloadedmetadata = function () {
  sndLoaded = true;
};

audio.addEventListener("ended", ended, false);

function getDuration() {
  return audio.duration;
}

function ended(e) {
  if (endedHandler) {
    endedHandler();
  }
}

function play(cb) {
  if (!sndLoaded) {
    clearInterval(interval_sndLoaded);
    interval_sndLoaded = setInterval(function () {
      if (sndLoaded) {
        clearInterval(interval_sndLoaded);
        audio.play();
        endedHandler = cb;
      }
    }, 100);
  } else {
    audio.play();
    endedHandler = cb;
  }



}

function pause() {
  audio.pause();
}

function stop() {
  if (!audio || audio.readyState != 4) return;
  audio.pause();
  audio.currentTime = 0;

}

function setSnd(curaudio) {
  sndLoaded = false;
  audio.setAttribute("src", curaudio);

}


export default {
  getDuration: getDuration,
  play: play,
  pause: pause,
  stop: stop,
  setSnd: setSnd
};
