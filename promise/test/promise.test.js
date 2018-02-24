import Promise from '../src/promise'
import { setTimeout } from 'timers'

var a = new Promise(function (resolve, reject) {
  setTimeout(() => {
    resolve('Hello World')
  }, 3000)
})

a.then((data) => {
  console.log(data)
})
