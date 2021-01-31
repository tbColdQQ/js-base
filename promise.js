/**
 * 1. Promise 的三个状态： pending fulfilled rejected
 * 2. then 方法传两个回调函数当做参数，分别是成功的回调和失败的回调
 */
const PENDDING = 'pendding'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromiss {
  constructor (executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  status = PENDDING
  value = undefined
  reason = undefined
  successCallback = []
  failCallback = []

  resolve = value => {
    if (this.status !== PENDDING) return
    this.status = FULFILLED
    this.value = value
    while (this.successCallback.length) {
      this.successCallback.shift()()
    }
  }

  reject = reason => {
    if (this.status !== PENDDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallback.length) {
      this.failCallback.shift()()
    }
  }

  then (successCallback, failCallback) {
    successCallback = successCallback ? successCallback : value => value
    failCallback = failCallback ? failCallback : reason => { throw reason }
    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = successCallback(this.value)
            // 判断 x 的值是普通值还是 promise 对象
            // 如果是普通值，直接调用resolve
            // 如果是 promise 对象，查看 promise 对象返回的结果
            // 再根据 promise 对象返回的结果，决定调用 resolve 还是 reject
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = failCallback(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else {
        this.successCallback.push(() => {
          setTimeout(() => {
            try {
              let x = successCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.failCallback.push(() => {
          setTimeout(() => {
            try {
              let x = failCallback(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return promise2
  }

  finally (callback) {
    return this.then(value => {
      return MyPromiss.resolve(callback()).then(() => value)
    }, reason => {
      return MyPromiss.resolve(callback()).then(() => { throw reason })
    })
  }

  catch (failCallback) {
    return this.then(undefined, failCallback)
  }

  static all (array) {
    let result = []
    let index = 0
    return new MyPromise((resolve, reject) => {
      function addData (key, value) {
        result[key] = value
        index++
        if (index === array.length) {
          resolve(result)
        }
      }
      for (let i = 0; i < array.length; i++) {
        let current = array[i]
        if (current instanceof MyPromise) {
          current.then(value => addData(i, value), reason => reject(reason))
        } else {
          addData(i, array[i])
        }
      }
    })
  }

  static resolve (value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }
}

function resolvePromise (promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected form promise #<Promise>'))
  }
  if (x instanceof MyPromise) {
    // x.then(value => {
    //   return resolve(value)
    // }, reason => {
    //   return reject(reason)
    // })
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}