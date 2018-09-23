import Promise from '../dist/promise'
import assert from 'assert'

function getResolvePromise (result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result)
    }, 4 + result)
  })
}

function getRejectPromise (err) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(err)
    })
  })
}

function getRandom (max) {
  return ~~(Math.random() * max)
}

function getRandomNumberArray (count, min = 0) {
  return '-'.repeat(count).split('').map(_ => getRandom(count) + min)
}

describe('Promise.race', () => {
  describe('all be resolve', () => {
    it('get result', (done) => {
      const arr = getRandomNumberArray(20)
      const promises = arr.map(i => getResolvePromise(i))

      Promise.race(promises)
        .then((result) => done(assert.strictEqual(result, Math.min(...arr))))
        .catch(done)
    })

    it('get error', (done) => {
      const arr = getRandomNumberArray(20, 5)
      const promises = arr.map(i => getResolvePromise(i))

      const index = getRandom(arr.length)
      const err = new Error()
      promises.splice(index, 0, getRejectPromise())

      Promise.race(promises)
        .then((result) => done(false))
        .catch(e => done(e === err))
    })
  })
})
