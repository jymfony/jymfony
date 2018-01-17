const InvalidArgumentException = Jymfony.Component.Testing.Exception.InvalidArgumentException;
const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class ReturnArgumentPromise extends implementationOf(PromiseInterface) {
    __construct(index = 0) {
        if (0 > index) {
            throw new InvalidArgumentException('Zero-based index expected as argument to ReturnArgumentPromise, but got ' + index);
        }

        this._index = index;
    }

    /**
     * @inheritDoc
     */
    execute(args) {
        return args[this._index];
    }
}

module.exports = ReturnArgumentPromise;
