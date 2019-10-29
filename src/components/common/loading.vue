<template>
  <div class="loading">
    <div class="loader">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="describe">正在加载</div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255,255,255, 0);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -ms-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: 10%;
  transform: translate3d(-50%, -50%, 0);
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -ms-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.describe {
  font-size: 16px;
  color: #64aacc;
  text-align: center;
  margin-top: 20px;
}
.dot {
  width: 20px;
  height: 20px;
  background: #3ac;
  border-radius: 100%;
  margin-left: 6px;
  display: inline-block;
  animation: slide 1s infinite;
}
.dot:nth-child(1) {
  animation-delay: 0.1s;
  background: #0e99c0;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #387696;
}
.dot:nth-child(3) {
  animation-delay: 0.3s;
  background: #7e96c0;
}
.dot:nth-child(4) {
  animation-delay: 0.4s;
  background: #c396c9;
}
.dot:nth-child(5) {
  animation-delay: 0.5s;
  background: #fa94c0;
}
@-moz-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@-webkit-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@-o-keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes slide {
  0% {
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
