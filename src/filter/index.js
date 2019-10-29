export var urlfix = (value, suffix) => {
  if (!value) {
    return ''
  }
  if (/\?/.test(value)) {
    return value + '&' + suffix
  } else {
    return value + '?' + suffix
  }
}
