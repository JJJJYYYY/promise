import Promise from '../src/promise'
import { setTimeout } from 'timers'

var a = new Promise(function (resolve, reject) {
  // throw new Error()
  setTimeout(() => {
    resolve('32ts')
  }, 1000)
})
  .then((data) => {
    console.log(data, 0)
    return Promise.resolve(data)
  })
  .then((data) => {
    console.log(data, 1)
    return Promise.reject(data)
  })
  .then((data) => {
    console.log(data, 2)
    return Promise.resolve(data)
  })
  .then((data) => {
    console.log(data, 3)
  })
  .catch((data) => {
    console.log(1)
    console.log(data)
  })
