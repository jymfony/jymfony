const MethodProphecyException = Jymfony.Component.Testing.Exception.MethodProphecyException;
const PredictionException = Jymfony.Component.Testing.Exception.Prediction.PredictionException;

/**
 * @memberOf Jymfony.Component.Testing.Exception.Prediction
 */
export default class UnexpectedCallsException extends mix(MethodProphecyException, PredictionException) {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Prophecy.MethodProphecy} methodProphecy
     * @param {*[]} calls
     */
    __construct(message, methodProphecy, calls) {
        super.__construct(message, methodProphecy);

        /**
         * @type {*[]}
         *
         * @private
         */
        this._calls = calls;
    }

    /**
     * @returns {*[]}
     */
    get calls() {
        return this._calls;
    }
}
