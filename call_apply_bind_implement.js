//如果call的第一个参数是null,那么this就指向window
Function.prototype.call2 = function (context = window) {
  //添加函数（this:调用call的函数）
  context.fn = this;
  var args = [];
  // 取出第二个到最后一个参数
  for (var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  //args : [ 'arguments[1]', 'arguments[2]' ]
  //执行函数,res是函数的返回值
  var res = eval('context.fn(' + args + ')');
  // args是一个数组，但是在eval里面会转成字符串也就是 'arguments[1]', 'arguments[2]' 
  //也就对应着下面的zjx和21两个参数
  //删除添加的函数
  delete context.fn;
  //返回函数返回的结果
  return res;
}

Function.prototype.apply2 = function (context, arr) {
  var context = Object(context) || window;
  context.fn = this;
  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + args + ')')
  }
  delete context.fn
  return result;
}

Function.prototype.my_bind = function () {
  var self = this, // 保存原函数
    context = Array.prototype.shift.call(arguments), // 保存需要绑定的this上下文
    // 上一行等价于 context = [].shift.call(arguments);
    args = Array.prototype.slice.call(arguments); // 剩余的参数转为数组
  return function () { // 返回一个新函数
    self.apply(context, Array.prototype.concat.call(args, Array.prototype.slice.call(arguments)));
  }
}