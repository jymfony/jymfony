const PromiseInterface = Jymfony.Component.Testing.Promise.PromiseInterface;

/**
 * @memberOf Jymfony.Component.Testing.Promise
 */
class ReturnPromise extends implementationOf(PromiseInterface) {
    /**
     * Constructor.
     *
     * @param {*[]} [returnValues = []]
     */
    __construct(returnValues = []) {
        this._returnValues = returnValues;
    }

    /**
     * @inheritdoc
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
