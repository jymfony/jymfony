const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class ReturnThisPromise extends implementationOf(PromiseInterface) {
    /**
     * @inheritDoc
     */
    execute(args, object, method) {
        return object;
    }
}

module.exports = ReturnThisPromise;
