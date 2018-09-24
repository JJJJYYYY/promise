import Promise from '../dist/promise'
import { expect } from 'chai'

function shouldNotBeResolve (promise, done) {
  return promise.then(result => done(new Error('not should call this')))
}

describe('Promise.all', () => {
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

  function getNumberArray (count = 20, min = 0) {
    return '-'.repeat(count).split('').map((_, i) => i + min)
  }

  describe('all be resolve', () => {
    it('sort', done => {
      const arr = getNumberArray()
      const promises = arr.map(i => getResolvePromise(i))

      Promise.all(promises)
        .then(result => expect(result).to.deep.equal(arr, 'result is wrong') && done())
        .catch(done)
    })

    it('exist `T` in promises', done => {
      const arr = getNumberArray()
      arr.splice(10, 0, 3)
      const promises = arr.map(i => getResolvePromise(i))

      Promise.all(promises)
        .then(result => expect(result).to.deep.equal(arr, 'result is wrong') && done())
        .catch(done)
    })
  })

  describe('have error', () => {
    it('a error', (done) => {
      const err = new Error('error')
      const arr = getNumberArray(20, 5)
      const promises = arr.map(i => getResolvePromise(i))

      promises.splice(10, 0, getRejectPromise(err))

      shouldNotBeResolve(Promise.all(promises), done)
        .catch(e => expect(e).to.be.equal(err, 'error has been changed') && done())
    })

    it('a error', (done) => {
      const err = new Error('error')
      const arr = getNumberArray(20, 5)
      const promises = arr.map(i => getResolvePromise(i))

      promises.splice(10, 0, getRejectPromise(err))

      shouldNotBeResolve(Promise.all(promises), done)
        .catch(e => expect(e).to.be.equal(err, 'error has been changed') && done())
    })
  })
})

describe('Promise.race', () => {
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

  describe('all be resolve', () => {
    it('get result', (done) => {
      const arr = getRandomNumberArray(20)
      const promises = arr.map(i => getResolvePromise(i))

      Promise.race(promises)
        .then(result => expect(result).to.be.equal(Math.min(...arr), 'result is wrong') && done())
        .catch(done)
    })

    it('exist `T` in promises', done => {
      const arr = getRandomNumberArray(20, 5)
      arr.splice(0, 0, 0)
      const promises = arr.map(i => getResolvePromise(i))

      Promise.race(promises)
        .then(result => expect(result).to.be.equal(0, 'result is wrong') && done())
        .catch(done)
    })
  })

  describe('have error', () => {
    it('get error', done => {
      const arr = getRandomNumberArray(20, 5)
      const promises = arr.map(i => getResolvePromise(i))

      const index = getRandom(arr.length)
      const err = new Error('This is a error')
      promises.splice(index, 0, getRejectPromise(err))

      shouldNotBeResolve(Promise.race(promises), done)
        .catch(e => expect(e).to.be.equal(err, 'error has been changed') && done())
    })
  })
})
