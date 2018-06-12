global.__jymfony = global.__jymfony || {};

/**
 * @memberOf __jymfony
 */
class Async {
    /**
     * Run an async generator.
     * Using this function you can use a generator to wait a promise
     * to be completed simply yield-ing it.
     * This function always returns a Promise object.
     *
     * @param {Generator|GeneratorFunction|AsyncFunction|Function} generator
     * @param {...*} args
     *
     * @returns {Promise}
     */
    static run(generator, ...args) {
        if (isAsyncFunction(generator)) {
            return generator(...args);
        }

        if (isGeneratorFunction(generator)) {
            return Async.run(generator(...args));
        }

        return new Promise((resolve, reject) => {
            if (isFunction(generator)) {
                generator = generator(...args);
            }

            if (! generator || isScalar(generator) || ! isFunction(generator.next)) {
                return resolve(generator);
            }

            /* eslint indent: "off" */
            const next = ret => {
                if (ret.done) {
                    return resolve(ret.value);
                }

                const val = Async.toPromise(ret.value);
                if (val && isPromise(val)) {
                    return val.then(onFulfilled, onRejected);
                } else if (isScalar(val)) {
                    return resolve(val);
                }

                return onRejected(new TypeError(
                    __jymfony.sprintf('Expected a function, a generator, a promise, an array or an object. "%s" yielded',
                        undefined === ret.value ? 'undefined' : ret.value.toString())
                ));
            },

            onFulfilled = res => {
                let retVal;

                try {
                    retVal = generator.next(res);
                } catch (e) {
                    return reject(e);
                }

                next(retVal);
                return null;
            },

            onRejected = err => {
                let retVal;

                try {
                    retVal = generator.throw(err);
                } catch (e) {
                    return reject(e);
                }

                next(retVal);
            };

            onFulfilled();
        });
    }

    /**
     * @param {Object} obj
     *
     * @returns {Promise}
     */
    static toPromise(obj) {
        if (! obj || isPromise(obj)) {
            return obj;
        }

        if (isGenerator(obj) || isGeneratorFunction(obj)) {
            return Async.run(obj);
        }

        if (isAsyncFunction(obj)) {
            return obj();
        }

        if (isFunction(obj)) {
            return Async.functionToPromise(obj);
        }

        if (isArray(obj)) {
            return Promise.all(obj.map(Async.toPromise));
        }

        if (isObjectLiteral(obj)) {
            return Async.objectToPromise(obj);
        }

        return obj;
    }

    /**
     * @param {Function} fn
     * @returns {Promise}
     */
    static functionToPromise(fn) {
        return new Promise((resolve, reject) => {
            const retVal = fn(function (err, res) {
                if (err) {
                    return reject(err);
                }

                if (2 < arguments.length) {
                    /* eslint prefer-rest-params: "off" */
                    res = [].slice.call(arguments, 1);
                }

                resolve(res);
            });

            if (undefined !== retVal) {
                resolve(retVal);
            }
        });
    }

    /**
     * @param {Object} obj
     *
     * @returns {Promise}
     */
    static objectToPromise(obj) {
        const results = {};
        const promises = [];

        for (const k of Object.keys(obj)) {
            const promise = Async.toPromise(obj[k]);

            results[k] = undefined;
            promises.push(promise.then(res => (results[k] = res)));
        }

        return Promise.all(promises).then(() => results);
    }
}

module.exports = global.__jymfony.Async = Async;
