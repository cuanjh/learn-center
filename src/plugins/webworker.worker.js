onmessage = (evt) => {
  // 向主线程发送消息
  postMessage(evt)
}

// 错误信息
onerror = (event) => {
  console.log(event.message)
}
