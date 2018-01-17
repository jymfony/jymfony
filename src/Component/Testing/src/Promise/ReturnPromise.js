const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class ReturnPromise extends implementationOf(PromiseInterface) {
    __construct(returnValues = []) {
        this._returnValues = returnValues;
    }

    /**
     * @inheritDoc
     */
    execute() {
        const value = this._returnValues.shift();

        if (0 === this._returnValues.length) {
            this._returnValues.push(value);
        }

        return value;
    }
}

module.exports = ReturnPromise;
