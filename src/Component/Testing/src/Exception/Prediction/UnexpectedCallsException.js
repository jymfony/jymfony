const MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;
const PredictionException = Jymfony.Component.Testing.Exception.Prediction.PredictionException;

/**
 * @memberOf Jymfony.Component.Testing.Exception.Prediction
 */
class UnexpectedCallsException extends mix(MethodProphecyException, PredictionException) {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.ObjectProphecy} methodProphecy
     * @param {[*]} calls
     */
    __construct(message, methodProphecy, calls) {
        super.__construct(message, methodProphecy);

        this._calls = calls;
    }

    get calls() {
        return this._calls;
    }
}

module.exports = UnexpectedCallsException;
