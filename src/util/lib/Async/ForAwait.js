if (! Symbol.asyncIterator) {
    Symbol.asyncIterator = Symbol('asyncIterator');
}

global.__jymfony = global.__jymfony || {};

const forAwait = (iterator, callback) => {
    const originalIterator = iterator;
    if (! iterator.next) {
        iterator = iterator[Symbol.asyncIterator] || iterator[Symbol.iterator];
    }

    if (! iterator) {
        throw new Error(Object.prototype.toString.call(originalIterator) + ' is not iterable');
    } else if (isGeneratorFunction(iterator)) {
        iterator = iterator();
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
