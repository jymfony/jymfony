const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class ThrowPromise extends implementationOf(PromiseInterface) {
    /**
     * Constructor.
     *
     * @param {Exception} exception
     */
    __construct(exception) {
        if (! (exception instanceof Error)) {
            const reflection = new ReflectionClass(exception);
            exception = reflection.newInstanceWithoutConstructor();
        }

        this._exception = exception;
    }

    /**
     * @inheritdoc
     */
    execute() {
        throw this._exception;
    }
}

module.exports = ThrowPromise;
