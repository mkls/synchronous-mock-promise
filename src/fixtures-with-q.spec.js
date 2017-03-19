const test = require('tape')
const Q = require('q')

const getFixtures = require('./fixtures')

test('the same functionality is provided with Q', t => {
    const promiseProvider = {
        resolve(value) {
            return Q.when(value)
        },
        reject(reason) {
            return Q.reject(reason)
        }
    }

    const fixtures = getFixtures(promiseProvider)

    t.plan(fixtures.length)

    fixtures.forEach(fixture => {
        setTimeout(() => {
            const actual = fixture[1].inspect()
            t.deepEqual(actual, fixture[2], fixture[0])
        })
    })
})
