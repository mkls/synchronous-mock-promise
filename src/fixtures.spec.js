const test = require('tape')
const Q = require('q')
const mockPromise = require('./sync-mock-promise')

const getFixtures = p => [
    [
        'resolve factory function',
        p.resolve(42),
        {
            state: 'fulfilled',
            value: 42
        }
    ],
    [
        'reject factory function',
        p.reject('hapli'),
        {
            state: 'rejected',
            reason: 'hapli'
        }
    ],
    [
        'then over resolved with a -> b',
        p.resolve(42).then(a => a + 1),
        {
            state: 'fulfilled',
            value: 43
        }
    ],
    [
        'then over resolved with a -> Promise b',
        p.resolve(42).then(a => p.resolve(a + 2)),
        {
            state: 'fulfilled',
            value: 44
        }
    ],
    [
        'then over resolved with a -> Rejection r',
        p.resolve(1).then(() => p.reject('hap')),
        {
            state: 'rejected',
            reason: 'hap'
        }
    ],
    [
        'then with a function that throws',
        p.resolve(1).then(() => {
            throw 'hehe error'
        }),
        {
            state: 'rejected',
            reason: 'hehe error'
        }
    ],
    [
        'then over a rejection',
        p.reject('ajaj').then(() => 42),
        {
            state: 'rejected',
            reason: 'ajaj'
        }
    ],
    [
        'catch over a resolved',
        p.resolve(2).catch(() => 33),
        {
            state: 'fulfilled',
            value: 2
        }
    ],
    [
        'catch over a rejected',
        p.reject('hap').catch(() => 'no hap'),
        {
            state: 'fulfilled',
            value: 'no hap'
        }
    ],
    [
        'second parameter of then for rejection is equivalent to .catch',
        p.reject('etwas').then(null, () => 33),
        {
            state: 'fulfilled',
            value: 33
        }
    ],
    [
        'Q.all works with resolved ones',
        Q.all([p.resolve(2), p.resolve(3)]),
        {
            state: 'fulfilled',
            value: [2, 3]
        }
    ],
    [
        'Q.all with a rejection',
        Q.all([p.resolve(2), p.reject('one hap')]),
        {
            state: 'rejected',
            reason: 'one hap'
        }
    ]
]

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

test('sync mock promise', t => {
    const fixtures = getFixtures(mockPromise)
    t.plan(fixtures.length)

    fixtures.forEach(fixture => {
        setTimeout(() => {
            const actual = typeof fixture[1].inspect === 'function'
                ? fixture[1].inspect()
                : fixture[1]

            t.deepEqual(actual, fixture[2], fixture[0])
        })
    })
})
