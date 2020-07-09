const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;
const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
export default class CallbackPromise extends implementationOf(PromiseInterface) {
    /**
     * Constructor.
     *
     * @param {Function} callback
     */
    __construct(callback) {
        if (! isFunction(callback)) {
            throw new InvalidArgumentException(__jymfony.sprintf('Callable expected as an argument to CallbackPromise, but got %s.', typeof callback));
        }

        /**
         * @type {Function}
         *
         * @private
         */
        this._callback = callback;
    }

    /**
     * @inheritdoc
     */
    execute(args, object) {
        const cb = new BoundFunction(object, this._callback);

        return cb(...args);
    }
}
