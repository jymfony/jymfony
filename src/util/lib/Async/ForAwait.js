global.__jymfony = global.__jymfony || {};

const forAwait = (iterator, callback) => {
    return new Promise((resolve, reject) => {
        function next() {
            iterator.next()
                .then(step => {
                    if (! step.done) {
                        __jymfony.Async.run(callback, step.value)
                            .then(next)
                            .catch(reject);
                    } else {
                        resolve();
                    }

                    return null;
                })
                .catch(reject);

            return null;
        }

        next();
    });
};

__jymfony.forAwait = forAwait;
