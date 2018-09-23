import Promise from '../dist/promise'
import assert from 'assert'

function getResolvePromise (result) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result)
    })
  })
}

function getRejectPromise (err) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(err)
    })
  })
}

function getNumberArray (count) {
  return '-'.repeat(20).split('').map((_, i) => i)
}

describe('Promise.all', () => {
  describe('all be resolve', () => {
    it('sort', (done) => {
      const arr = getNumberArray()
      const promises = arr.map(i => getResolvePromise(i))

      Promise.all(promises)
        .then((result) => done(assert.deepStrictEqual(result, arr)))
        .catch(done)
    })
  })

  describe('have error', () => {
    it('a error', (done) => {
      const err = new Error('error')
      const arr = getNumberArray()
      const promises = arr.map(i => getResolvePromise(i))

      promises.splice(10, 0, getRejectPromise(err))

      Promise.all(promises)
        .then((result) => done(false))
        .catch(e => done(e === err))
    })
  })
})
