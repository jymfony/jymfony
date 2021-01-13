if (! Symbol.asyncIterator) {
    Symbol.asyncIterator = Symbol('asyncIterator');
}

global.__jymfony = global.__jymfony || {};

const forAwait = (iterator, callback) => {
    if (isPromise(iterator)) {
        return iterator.then(resolved => forAwait(resolved, callback));
    }

    const originalIterator = iterator;
    if (isArray(iterator)) {
        iterator = iterator.values();
    }

    if (! iterator.next) {
        iterator = iterator[Symbol.asyncIterator] || iterator[Symbol.iterator];
    }

    if (! iterator) {
        throw new Error(Object.prototype.toString.call(originalIterator) + ' is not iterable');
    } else if (! isFunction(iterator.next) && isFunction(iterator)) {
        iterator = iterator.call(originalIterator);
    }

    return new Promise((resolve, reject) => {
        async function next() {
            try {
                const step = await iterator.next();
                if (! step.done) {
                    const retVal = await callback(await step.value);
                    if (undefined !== retVal) {
                        return resolve(retVal);
                    }

                    return next();
                }

                resolve(await step.value);
            } catch (e) {
                reject(e);
            }

            return null;
        }

        next();
    });
};

__jymfony.forAwait = forAwait;
