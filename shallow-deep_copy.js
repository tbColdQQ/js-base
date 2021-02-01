/**
 * 浅拷贝
 */
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 'ddd'
  }
}

// 1. Object.assign()
let obj1 = Object.assign({}, obj)

// 2. lodash 库中的 _clone 方法
var _ = require('lodash')
let obj2 = _.clone(obj)

// 3. 展开运算符
let obj3 = {...obj}

// 4. Array.prototype.concat
let arrayObj = [1, 2, obj, 4]
let obj4 = arrayObj.concat()

// 5. Array.prototype.slice
let obj5 = arrayObj.slice()

// 6. jQuery 的 extend
let obj6 = {}
$.extend(obj6, obj)


/**
 * 深拷贝
 */

// 1. JSON.parse(JSON.stringify())
// 这种方法虽然可以实现数组或对象深拷贝,但不能处理函数和正则
let obj7 = JSON.parse(JSON.stringify(obj))

// 2. lodash 库中的 _cloneDeep 方法
let obj8 = _.cloneDeep(obj)

// 3. jQuery 的 extend
let obj9 = {}
$.extend(true, obj9, obj)

// 4. 手写递归方法
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== "object") return obj;
  // 是对象的话就要进行深拷贝
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}