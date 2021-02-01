function Parent() {
  this.isShow = true
  this.info = {
      name: "yhd",
      age: 18,
  };
}
Parent.prototype.getInfo = function() {
  console.log(this.info);
  console.log(this.isShow); // true
}

/**
 * 1. 原型链继承
 * 优点: 父类方法可以全部复用
 * 缺点: 
 *      (1) 父类的引用属性(info)会被所有子类共享，更改一个子类的引用属性，其他子类会受到影响
 *      (2) 子类型实例不能给父类构造函数传参
 */
function Child() {};
Child.prototype = new Parent()

/**
 * 2. 构造函数继承
 * 优点: 父类引用属性不会被共享，可在子类构造函数中向父类传参
 * 缺点: 子类无法访问父类原型上的属性和方法
 */
function Child1 () {
  Parent.call(this)
}

// 3. 组合继承
function Child2 () {
  Parent.call(this)
}
Child2.prototype = new Parent()

// 4. 原型式继承  优缺点同原型链继承
function objectCopy(obj) {
  function Fun() { }
  Fun.prototype = obj
  return new Fun()
}

// 5. 寄生式继承 父类引用属性会被共享
function createObj (o) {
  var clone = Object.create(o);
  clone.sayName = function () {
      console.log('hi');
  }
  return clone;
}

// 6. 寄生式组合继承
function inheritPrototype(subType, superType) {
  let prototype = Object.create(superType.prototype); // 创建对象
  prototype.constructor = subType; // 增强对象
  subType.prototype = prototype; // 赋值对象
}