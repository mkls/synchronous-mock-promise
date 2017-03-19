const Q = require('q')

module.exports = (p) => [
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
        'Q.all works with resolved ones',
        Q.all([p.resolve(2), p.resolve(3)]),
        {
            state: 'fulfilled',
            value: [2, 3]
        }
    ],
    [
        'Q.all with a rejection',
        Q.all([p.resolve(2), p.reject('hap')]),
        {
            state: 'rejected',
            reason: 'hap'
        }
    ]
]
