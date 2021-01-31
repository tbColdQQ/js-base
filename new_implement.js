function myNew (fn) {
  let obj = {}
  let args = Array.prototype.slice.call(arguments, 1)
  obj.__proto__.constructor = fn
  obj.__proto__ = fn.prototype
  fn.apply(obj, args)
  return obj
}

