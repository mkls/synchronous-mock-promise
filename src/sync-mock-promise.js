module.exports = {
    resolve: value => new Resolved(value),
    reject: reason => new Rejected(reason)
}

function Resolved(value) {
    this.state = 'fulfilled'
    this.value = value
}

Resolved.prototype.then = function (mapper) {
    try {
        const newValue = mapper(this.value)
        if (isPromise(newValue)) {
            return newValue
        }
        return new Resolved(newValue)
    } catch (e) {
        return new Rejected(e)
    }
}

Resolved.prototype.catch = function () {
    return this
}

function Rejected(reason) {
    this.state = 'rejected'
    this.reason = reason
}

Rejected.prototype.then = function (resolve, reject) {
    if (typeof reject === 'function') {
        return new Resolved(reject(this.reason))
    }
    return this
}

Rejected.prototype.catch = function (mapper) {
    const newValue = mapper(this.reason)
    return new Resolved(newValue)
}

function isPromise(value) {
    return typeof value === 'object' && typeof value.then === 'function'
}
