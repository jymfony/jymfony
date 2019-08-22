const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;
const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
export default class ReturnArgumentPromise extends implementationOf(PromiseInterface) {
    /**
     * Constructor.
     *
     * @param {int} [index = 0]
     */
    __construct(index = 0) {
        if (0 > index) {
            throw new InvalidArgumentException('Zero-based index expected as argument to ReturnArgumentPromise, but got ' + index);
        }

        /**
         * @type {int}
         *
         * @private
         */
        this._index = index;
    }

    /**
     * @inheritdoc
     */
    execute(args) {
        return args[this._index];
    }
}
