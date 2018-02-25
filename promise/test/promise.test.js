import Promise from '../src/promise'
import { setTimeout } from 'timers'

var a = new Promise(function (resolve, reject) {
  // throw new Error()
  setTimeout(() => {
    resolve('32ts')
  }, 1000)
})
  .then((data) => {
    console.log(data)
    return new Promise(function (resolve, reject) {
      // throw new Error()
      setTimeout(() => {
        resolve('222')
      }, 1000)
    })
  })
  .then((data) => {
    console.log(data)
  })
  .catch((data) => {
    console.log(1)
    console.log(data)
  })
