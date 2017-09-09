const UnexpectedCallsException = Jymfony.Component.Testing.Exception.UnexpectedCallsException;

/**
 * @memberOf Jymfony.Component.Testing.Exception.Prediction
 */
class UnexpectedCallsCountException extends UnexpectedCallsException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} methodProphecy
     * @param {int} count
     * @param {[*]} calls
     */
    constructor(message, methodProphecy, count, calls) {
        super(message, methodProphecy, calls);

        this._expectedCount = count;
    }

    get expectedCount() {
        return this._expectedCount;
    }
}

module.exports = UnexpectedCallsCountException;
