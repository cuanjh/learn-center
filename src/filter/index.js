export var urlfix = (value, suffix) => {
  if (/\?/.test(value)) {
    return value + '&' + suffix
  } else {
    return value + '?' + suffix
  }
}
