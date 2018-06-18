const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class ReturnThisPromise extends implementationOf(PromiseInterface) {
    /**
     * @inheritdoc
     */
    execute(args, object) {
        return object;
    }
}

module.exports = ReturnThisPromise;
