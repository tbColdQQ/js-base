function debounce (fn, time) {
  let timer = null
  return function () {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this)
    }, time)
  }
}