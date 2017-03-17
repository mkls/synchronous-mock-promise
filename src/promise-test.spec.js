var test = require('tape')

var Q = require('q')

function getFixtures(p) {
    return [
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
            p.resolve(1).then(a => p.reject('hap')),
            {
                state: 'rejected',
                reason: 'hap'
            }
        ],
        [
            'then with a function that throws',
            p.resolve(1).then(a => {
                throw 'hehe error'
            }),
            {
                state: 'rejected',
                reason: 'hehe error'
            }
        ],
        [
            'then over a rejection',
            p.reject('ajaj').then(a => 42),
            {
                state: 'rejected',
                reason: 'ajaj'
            }
        ],
        [
            'catch over a resolved',
            p.resolve(2).catch(e => 33),
            {
                state: 'fulfilled',
                value: 2
            }
        ],
        [
            'catch over a rejected',
            p.reject('hap').catch(e => 'no hap'),
            {
                state: 'fulfilled',
                value: 'no hap'
            }
        ]
    ]
}

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
