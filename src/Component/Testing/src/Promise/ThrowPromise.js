const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class ThrowPromise extends implementationOf(PromiseInterface) {
    __construct(exception) {
        if (! (exception instanceof Error)) {
            const reflection = new ReflectionClass(exception);
            exception = reflection.newInstanceWithoutConstructor();
        }

        this._exception = exception;
    }

    /**
     * @inheritDoc
     */
    execute() {
        throw this._exception;
    }
}

module.exports = ThrowPromise;
