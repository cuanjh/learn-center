export var urlfix = (value, suffix) => {
  if (!value) {
    return ''
  }
  value = value.replace('http://course-assets.talkmate.com/', 'https://course-assets1.talkmate.com/')
  if (/\?/.test(value)) {
    return value + '&' + suffix
  } else {
    return value + '?' + suffix
  }
}
