import Worker from './file.worker.js'
const worker = new Worker()
worker.onmessage = (event) => {
  console.log('my worker', event.data)
}

export default {
  worker
}
