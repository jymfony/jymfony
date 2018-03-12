const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class CallbackPromise extends implementationOf(PromiseInterface) {
    __construct(callback) {
        if (! isFunction(callback)) {
            throw new InvalidArgumentException(__jymfony.sprintf(
                'Callable expected as an argument to CallbackPromise, but got %s.',
                typeof callback
            ));
        }

        this._callback = callback;
    }

    /**
     * @inheritDoc
     */
    execute(args, object) {
        const cb = new BoundFunction(object, this._callback);

        return cb(...args);
    }
}

module.exports = CallbackPromise;
