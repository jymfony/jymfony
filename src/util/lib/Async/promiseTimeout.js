'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Applies a timeout to the promise.
 *
 * @param {int} timeoutMs Timeout of the promise in ms
 * @param {Promise|AsyncFunction} promise The promise (or async function) to complete before timeout
 * @param {Error} timeoutError The error to throw in case of timeout
 * @param {boolean} weak Call unref on timeout to not prevent process exit (node.js only)
 */
__jymfony.promiseTimeout = (timeoutMs, promise, timeoutError = new Error('Timed out.'), weak = false) => {
    if ('function' === typeof promise) {
        promise = promise();
    }

    if (! 'then' in promise || 'function' !== typeof promise.then) {
        throw new TypeError('Argument #2 passed to __jymfony.promiseTimeout must be a promise or an async function');
    }


    let rejectFn, resolved = false;
    const clear = () => {
        resolved = true;
        clearTimeout(this._timeout);
    };

    const rejection = err => {
        if (resolved) {
            return;
        }

        clear();
        rejectFn(err);
    };

    this._timeout = setTimeout(() => {
        rejection(timeoutError);
    }, timeoutMs);

    if (weak && 'unref' in this._timeout) {
        this._timeout.unref();
    }

    return new Promise((resolve, reject) => {
        rejectFn = reject;
        promise.then((...args) => {
            clear();
            resolve(...args);
        }, rejection);
    });
};
