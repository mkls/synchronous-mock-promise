# synchronous-mock-promise
Synchronous implementation for promises, to make assertions simpler in tests

The main use case is to return these from mocks instead of for example `Q.when(42)`
and `Q.reject('some error')`.

Promise without any asyncrounous behaviour is basically like the Either monad,
it captures validity of values. It could be used as an Either monad if one really wanted to.

## API

It exposes two static factory functions:

* `resolve`: creates a fullfilled mock promise

* `reject`: creates a rejected mock promise

## Example

```js
const mockPromise = require('syncronous-mock-promise')

mockPromise.resolve(42)          // { state: 'fulfilled', value: 42 }
mockPrimise.reject('problemo')   // { state: 'rejected', reason: 'problemo' }
```

## Motivation behind this package

Let's say you have functions in node that make requests to somewhere and are returning
promises.
They make their requests through an injected requestMaker module of some sort.
During testing we inject the mock version of requestMaker to them, which can be set up
like angular's httpBackend.

An example of this setup:

```js
function underTest(params, requestMaker) {
    return requestMaker.get(someDescriptor)
        .then(a => a + 2)
}
```

This is how we test it in `tape` for example:

```js
mockRequestMaker
    .expectQuery(someDescriptor)
    .respondWith(40)

var expected = 42

underTest('some param', mockRequestMaker)
    .then(actual => {
        t.equal(actual, expected)
    })
    .catch(t.fail)
```

Now if mockRequestMaker were to return a syncronous-mock-promise instead of a
regular one, our test could look like this:

```js
mockRequestMaker
    .expectQuery(someDescriptor)
    .respondWith(40)

var expected = {
    state: 'fullfilled',
    value: 42
}

var actual = underTest('some param', mockRequestMaker)

t.equal(actual, expected)
```

You might say it's not a bit difference, and it might not even improve anything, but I
personally think this is better.

If the underTest function doesn't return a promise for some reason, you don't get
a syntax error, but an actual comparison of actual and expected.
Also it is fun that you can remove all asynchronicity from promises and test your functions
fully syncronously.

And this is the story of how syncronius-mock-promise was made.